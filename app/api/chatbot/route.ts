import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CALENDLY_LINK = process.env.NEXT_PUBLIC_CALENDLY_LINK || "";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatbotRequest = {
  messages: ChatMessage[];
  context?: {
    pagePath?: string;
    referrer?: string;
    serviceSlug?: string;
  };
};

async function getCompanyContext() {
  const [services, industries] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        title: true,
        shortDescription: true,
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.industry.findMany({
      where: { isActive: true },
      select: {
        name: true,
        description: true,
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const servicesList = services
    .map((s: typeof services[0]) => `- ${s.title} (slug: ${s.slug}): ${s.shortDescription}`)
    .join("\n");

  const industriesList = industries
    .map((i: typeof industries[0]) => `- ${i.name}: ${i.description || "Tailored solutions"}`)
    .join("\n");

  return {
    servicesList,
    industriesList,
    serviceSlugs: services.map((s: typeof services[0]) => s.slug),
  };
}

function buildSystemPrompt(context: Awaited<ReturnType<typeof getCompanyContext>>): string {
  return `You are a helpful AI assistant for ${process.env.NEXT_PUBLIC_SITE_NAME} Solutions, a digital transformation company.

COMPANY INFORMATION:
${process.env.NEXT_PUBLIC_SITE_NAME} Solutions provides comprehensive digital services to help businesses grow and scale.

OUR SERVICES:
${context.servicesList}

INDUSTRIES WE SERVE:
${context.industriesList}

CALENDLY MEETING LINK:
${CALENDLY_LINK}

YOUR RESPONSIBILITIES:
1. Answer FAQs about our services, industries, and company clearly and concisely.
2. When users express interest in working with us, politely collect their information:
   - Name
   - Email
   - Phone (optional)
   - Company (optional)
   - Budget range (optional)
   - Their project needs/message
   
   When you have collected this information, respond with a JSON action in this format:
   {"action": "create_lead", "lead": {"name": "...", "email": "...", "phone": "...", "company": "...", "budget": "...", "message": "..."}}
   
   Then provide a friendly confirmation message.

3. For booking meetings, when user wants to schedule a meeting or you suggest booking one, include a JSON action:
   {"action": "book_meeting"}
   Then provide a friendly message like "You can also book a meeting with us!" but DO NOT include the raw Calendly URL in your response text.

4. Recommend relevant services based on user needs. When recommending services OR when asked to show/list all services, include a JSON action:
   {"action": "recommend_services", "services": ["service-slug-1", "service-slug-2"]}
   
   IMPORTANT: When user asks to "show all services", "list all services", "what services do you offer", or similar requests, ALWAYS include ALL service slugs in the recommend_services action: ${JSON.stringify(context.serviceSlugs)}
   
   Available service slugs: ${context.serviceSlugs.join(", ")}
   
   CRITICAL: When you include the recommend_services action, place the JSON on a SEPARATE LINE at the END of your response, or embed it invisibly. Your text response should be brief and natural (1-2 sentences) like "Here are our services:" or "Here's what we offer:" - DO NOT include the JSON inline with your text. The services will be displayed as interactive cards automatically.

5. Be friendly, professional, and helpful. Keep responses concise (2-3 sentences max unless detailed explanation is needed).

6. Format your responses attractively:
   - Use **bold** for emphasis on important terms
   - Use bullet points (-) or numbered lists (1., 2., etc.) for lists
   - Use line breaks to separate ideas
   - Keep paragraphs short (2-3 sentences)
   - Use clear, conversational language

IMPORTANT:
- Always respond naturally in conversation, but include JSON actions when needed.
- JSON actions should be placed on SEPARATE LINES at the END of your response, NOT inline with your text.
- NEVER include JSON objects in the middle of sentences - they will be automatically extracted and removed from the displayed text.
- If user asks about pricing, mention that pricing varies by project and suggest booking a meeting or getting a quote.
- If user wants to work with us, collect their information and use the create_lead action.
- Keep your text responses clean and readable - the JSON actions are processed separately and won't be shown to users.`;
}

async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured. Please set OPENROUTER_API_KEY or OPENAI_API_KEY environment variable.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.NEXT_PUBLIC_SITE_NAME}.com`,
      "X-Title": `${process.env.NEXT_PUBLIC_SITE_NAME} Solutions Chatbot`,
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini", // Using GPT-4o-mini via OpenRouter (cost-effective)
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
}

function extractActions(responseText: string): {
  replyText: string;
  actions?: {
    createLead?: {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      budget?: string;
      message?: string;
    };
    recommendServices?: string[];
    bookMeeting?: boolean;
  };
} {
  const actions: any = {};
  let cleanedText = responseText;

  // Function to find and extract JSON objects (handles nested objects and arrays)
  function findJsonObjects(text: string): string[] {
    const results: string[] = [];
    let braceDepth = 0;
    let bracketDepth = 0;
    let start = -1;
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"' && !escapeNext) {
        inString = !inString;
        continue;
      }
      
      if (inString) continue;
      
      if (char === '{') {
        if (braceDepth === 0 && bracketDepth === 0) start = i;
        braceDepth++;
      } else if (char === '}') {
        braceDepth--;
        if (braceDepth === 0 && bracketDepth === 0 && start !== -1) {
          const jsonStr = text.substring(start, i + 1);
          // Only include if it contains "action" key
          if (jsonStr.includes('"action"')) {
            results.push(jsonStr);
          }
          start = -1;
        }
      } else if (char === '[') {
        bracketDepth++;
      } else if (char === ']') {
        bracketDepth--;
      }
    }
    
    return results;
  }

  // Extract all JSON objects from the response
  const jsonMatches = findJsonObjects(responseText);

  for (const jsonStr of jsonMatches) {
    try {
      const parsed = JSON.parse(jsonStr);
      
      if (parsed.action === "create_lead" && parsed.lead) {
        actions.createLead = {
          name: parsed.lead.name || "",
          email: parsed.lead.email || "",
          phone: parsed.lead.phone || "",
          company: parsed.lead.company || "",
          budget: parsed.lead.budget || "",
          message: parsed.lead.message || "",
        };
        // Remove this JSON from response text (escape special regex chars)
        cleanedText = cleanedText.replace(jsonStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "").trim();
      } else if (parsed.action === "recommend_services" && Array.isArray(parsed.services)) {
        actions.recommendServices = parsed.services;
        // Remove this JSON from response text - handle various placements
        // Try multiple replacement strategies
        cleanedText = cleanedText.replace(jsonStr, '').trim();
        
        // Also try with normalized whitespace
        const normalizedJson = jsonStr.replace(/\s+/g, ' ');
        cleanedText = cleanedText.replace(normalizedJson, '').trim();
        
        // Try with regex pattern (more flexible)
        const escapedJson = jsonStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        cleanedText = cleanedText.replace(new RegExp(escapedJson, 'g'), '').trim();
        
        // Clean up any double spaces or orphaned punctuation
        cleanedText = cleanedText
          .replace(/\s{2,}/g, ' ')
          .replace(/\s*:\s*$/, '') // Remove trailing colons
          .replace(/^\s*:\s*/, '') // Remove leading colons
          .trim();
      } else if (parsed.action === "book_meeting") {
        actions.bookMeeting = true;
        // Remove this JSON from response text
        cleanedText = cleanedText.replace(jsonStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "").trim();
      }
    } catch (e) {
      // If JSON parsing fails for this specific match, continue with others
      console.error("Failed to parse action JSON:", jsonStr.substring(0, 100), e);
    }
  }

  // Additional cleanup: Remove any remaining JSON-like patterns that might have been missed
  // This handles cases where JSON might appear inline with text
  // Use a more robust approach to remove JSON objects
  const jsonPatterns = [
    // Pattern for recommend_services - handles arrays with any content
    /\{\s*"action"\s*:\s*"recommend_services"\s*,\s*"services"\s*:\s*\[[^\]]*\]\s*\}/gi,
    // More flexible pattern for recommend_services (handles any whitespace)
    /\{\s*"action"\s*:\s*"recommend_services"\s*[^}]*"services"\s*:\s*\[[^}]*\]\s*\}/gi,
    // Pattern for create_lead with nested objects
    /\{\s*"action"\s*:\s*"create_lead"\s*[^}]*"lead"\s*:\s*\{[^}]*\}\s*\}/gi,
    // Pattern for simple action objects
    /\{\s*"action"\s*:\s*"[^"]+"\s*\}/gi,
    // Catch any remaining JSON-like structures with "action" key
    /\{[^{}]*"action"[^{}]*\}/gi,
  ];

  jsonPatterns.forEach(pattern => {
    cleanedText = cleanedText.replace(pattern, '').trim();
  });

  // Remove any remaining empty curly braces or malformed JSON
  cleanedText = cleanedText
    .replace(/\{\s*\}/g, '')
    .replace(/\{\s*[^}]*\}/g, (match) => {
      // Only remove if it looks like JSON (has quotes and colons)
      if (match.includes('"') && match.includes(':')) {
        return '';
      }
      return match;
    })
    .trim();

  // Also check if Calendly URL is mentioned and remove it, set bookMeeting action
  if (responseText.includes(CALENDLY_LINK) || responseText.toLowerCase().includes("calendly")) {
    actions.bookMeeting = true;
    cleanedText = cleanedText.replace(CALENDLY_LINK, "").replace(/https?:\/\/[^\s]+/g, "").trim();
    // Clean up any leftover "here:" or similar text
    cleanedText = cleanedText.replace(/\s*here:\s*/gi, "").trim();
  }

  // Clean up extra whitespace, empty lines, and orphaned punctuation
  cleanedText = cleanedText
    .replace(/\n\s*\n/g, "\n") // Remove multiple newlines
    .replace(/^\s*[.,;:]\s*/gm, "") // Remove leading punctuation on lines
    .replace(/\s+([.,;:])/g, "$1") // Fix spacing before punctuation
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
    .replace(/^\s+|\s+$/g, '') // Trim start and end
    .replace(/\s*:\s*/g, ': ') // Clean up colons (but keep them if they're part of text)
    .replace(/:\s*\{/g, '') // Remove any remaining ": {" patterns
    .trim();

  return {
    replyText: cleanedText || responseText,
    actions: Object.keys(actions).length > 0 ? actions : undefined,
  };
}

export async function POST(req: Request) {
  try {
    const body: ChatbotRequest = await req.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Get company context (services, industries)
    const companyContext = await getCompanyContext();

    // Build system prompt with company info
    const systemPrompt = buildSystemPrompt(companyContext);

    // Prepare messages for OpenRouter (include system prompt)
    const openRouterMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10), // Keep last 10 messages for context (to avoid token limits)
    ];

    // Call OpenRouter API
    const aiResponse = await callOpenRouter(openRouterMessages);

    // Extract actions (lead creation, service recommendations)
    let { replyText, actions } = extractActions(aiResponse);

    // If user asked for all services and no services were recommended, add all services
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const askedForAllServices = lastUserMessage.includes("all services") || 
                                lastUserMessage.includes("show services") || 
                                lastUserMessage.includes("list services") ||
                                lastUserMessage.includes("what services") ||
                                lastUserMessage.includes("services do you offer");
    
    if (askedForAllServices && (!actions?.recommendServices || actions.recommendServices.length === 0)) {
      // Add all services to recommendations
      if (!actions) {
        actions = {};
      }
      actions.recommendServices = companyContext.serviceSlugs;
    }

    // If create_lead action exists, save to database
    if (actions?.createLead) {
      try {
        await prisma.chatLead.create({
          data: {
            name: actions.createLead.name || null,
            email: actions.createLead.email || null,
            phone: actions.createLead.phone || null,
            company: actions.createLead.company || null,
            budget: actions.createLead.budget || null,
            message: actions.createLead.message || null,
            sourcePage: context?.pagePath || null,
          },
        });
      } catch (dbError) {
        console.error("Failed to save chat lead:", dbError);
        // Don't fail the request if DB save fails, just log it
      }
    }

    // Return response with actions
    return NextResponse.json({
      replyText,
      recommendedServices: actions?.recommendServices || undefined,
      leadCreated: !!actions?.createLead,
      showBookMeeting: !!actions?.bookMeeting,
    });
  } catch (error: any) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat message",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

