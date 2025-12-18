import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
config({ path: resolve(__dirname, "../.env") });
config({ path: resolve(__dirname, "../.env.local") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("Please check your .env or .env.local file.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Helper function to convert HTML to Markdown
function htmlToMarkdown(html: string): string {
  let markdown = html
    .trim()
    // Convert headings
    .replace(/<h2>(.*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3>(.*?)<\/h3>/gi, "\n### $1\n")
    // Convert paragraphs
    .replace(/<p>(.*?)<\/p>/gi, "\n$1\n")
    // Convert lists
    .replace(/<ul>/gi, "\n")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
    // Convert strong/bold
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    // Remove any remaining HTML tags
    .replace(/<[^>]+>/g, "")
    // Clean up extra newlines
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return markdown;
}

async function main() {
  console.log("🌱 Seeding blogs...");

  // First, ensure categories exist
  const categoryMap = new Map<string, string>();

  const categories = [
    { name: "AI & Automation", slug: "ai-automation" },
    { name: "Digital Marketing", slug: "digital-marketing" },
    { name: "SaaS", slug: "saas" },
    { name: "IT Services", slug: "it-services" },
    { name: "Business Growth", slug: "business-growth" },
    { name: "Technology", slug: "technology" },
    { name: "Strategy", slug: "strategy" },
  ];

  for (const cat of categories) {
    const existing = await prisma.blogCategory.findUnique({
      where: { slug: cat.slug },
    });

    if (!existing) {
      const created = await prisma.blogCategory.create({
        data: {
          slug: cat.slug,
          name: cat.name,
        },
      });
      categoryMap.set(cat.name, created.id);
      console.log(`✅ Created category: ${cat.name}`);
    } else {
      categoryMap.set(cat.name, existing.id);
      console.log(`ℹ️  Category already exists: ${cat.name}`);
    }
  }

  // Blog posts data
  const blogPosts = [
    {
      title: "The Future of AI in Business Automation",
      slug: "future-of-ai-in-business-automation",
      excerpt: "Explore how artificial intelligence is revolutionizing business operations, from automated workflows to intelligent decision-making systems that drive efficiency and growth.",
      content: `
## Introduction

Artificial Intelligence is no longer a futuristic concept—it's here, and it's transforming how businesses operate. From automating repetitive tasks to making intelligent decisions, AI is revolutionizing business operations across industries.

## The Current State of AI in Business

Today's businesses are leveraging AI in unprecedented ways. Machine learning algorithms analyze vast amounts of data to identify patterns, predict trends, and make recommendations that would be impossible for humans to process manually.

### Key Applications

- **Process Automation:** AI-powered systems can automate complex workflows, reducing manual effort and human error.
- **Intelligent Decision Making:** Advanced analytics help businesses make data-driven decisions faster and more accurately.
- **Customer Experience:** AI chatbots and virtual assistants provide 24/7 customer support, improving satisfaction and reducing costs.
- **Predictive Analytics:** Machine learning models forecast demand, identify risks, and optimize operations.

## Benefits of AI Automation

The benefits of implementing AI in business operations are substantial. Companies report significant improvements in efficiency, cost reduction, and customer satisfaction.

## Getting Started

Implementing AI automation doesn't have to be overwhelming. Start with identifying repetitive tasks that can be automated, then gradually expand to more complex processes. Partnering with experienced AI solution providers can accelerate your journey.

## Conclusion

The future of business automation is AI-driven. Companies that embrace these technologies today will have a significant competitive advantage tomorrow.
      `,
      category: "AI & Automation",
      tags: ["AI", "Automation", "Business", "Technology"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      authorName: process.env.NEXT_PUBLIC_SITE_NAME || "",
      authorAvatar: "",
      authorRole: "Company",
      publishedAt: "2024-01-15",
      readTime: 8,
      featured: true,
    },
    {
      title: "Digital Marketing Strategies for 2024",
      slug: "digital-marketing-strategies-2024",
      excerpt: "Discover the latest digital marketing trends and strategies that are driving results in 2024, including SEO, social media, and content marketing best practices.",
      content: `
## Introduction

Digital marketing continues to evolve at a rapid pace. In 2024, businesses need to stay ahead of the curve with innovative strategies that engage audiences and drive conversions.

## The Current State of Digital Marketing

Today's digital landscape is more competitive than ever. Businesses are leveraging advanced analytics, AI-powered tools, and personalized content to connect with their target audiences.

### Key Strategies

- **SEO Optimization:** Search engine optimization remains crucial for organic visibility and traffic generation.
- **Social Media Marketing:** Platforms like LinkedIn, Twitter, and Instagram offer powerful ways to engage with audiences.
- **Content Marketing:** High-quality, valuable content continues to be the foundation of successful marketing campaigns.
- **Email Marketing:** Personalized email campaigns drive engagement and conversions.

## Benefits of Modern Digital Marketing

The benefits of implementing modern digital marketing strategies are substantial. Companies report significant improvements in brand awareness, lead generation, and customer engagement.

## Getting Started

Implementing effective digital marketing doesn't have to be overwhelming. Start with understanding your target audience, then develop a comprehensive strategy that aligns with your business goals.

## Conclusion

The future of marketing is digital-first. Companies that embrace these strategies today will have a significant competitive advantage tomorrow.
      `,
      category: "Digital Marketing",
      tags: ["Marketing", "SEO", "Social Media", "Strategy"],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
      authorName: process.env.NEXT_PUBLIC_SITE_NAME || "",
      authorAvatar: "",
      authorRole: "Company",
      publishedAt: "2024-01-10",
      readTime: 6,
      featured: true,
    },
    {
      title: "Building Scalable SaaS Products",
      slug: "building-scalable-saas-products",
      excerpt: "Learn the essential principles and best practices for building SaaS products that scale, from architecture design to user acquisition strategies.",
      content: `
## Introduction

Building a scalable SaaS product requires careful planning, robust architecture, and a deep understanding of your users' needs. Success in the SaaS space demands more than just great code—it requires a comprehensive approach to product development.

## The Fundamentals of SaaS Architecture

Scalable SaaS products are built on solid foundations. This includes choosing the right technology stack, designing for multi-tenancy, and implementing robust security measures.

### Key Principles

- **Scalable Architecture:** Design your system to handle growth from day one.
- **User Experience:** Prioritize intuitive interfaces and seamless user journeys.
- **Performance:** Optimize for speed and reliability to keep users engaged.
- **Security:** Implement comprehensive security measures to protect user data.

## Benefits of Scalable SaaS Products

The benefits of building scalable SaaS products are substantial. Companies that invest in proper architecture see improved performance, lower operational costs, and faster time to market.

## Getting Started

Building a scalable SaaS product doesn't have to be overwhelming. Start with a clear vision, choose the right technology stack, and iterate based on user feedback.

## Conclusion

The future of software is SaaS. Companies that build scalable products today will have a significant competitive advantage tomorrow.
      `,
      category: "SaaS",
      tags: ["SaaS", "Product Development", "Scaling", "Technology"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      authorName: process.env.NEXT_PUBLIC_SITE_NAME || "",
      authorAvatar: "",
      authorRole: "Company",
      publishedAt: "2024-01-05",
      readTime: 10,
      featured: true,
    },
    {
      title: "Cybersecurity Best Practices for Modern Businesses",
      slug: "cybersecurity-best-practices",
      excerpt: "Protect your business from cyber threats with these essential cybersecurity practices, including data encryption, access controls, and incident response planning.",
      content: `
## Introduction

Cybersecurity is no longer optional—it's essential for every modern business. As cyber threats become more sophisticated, businesses must implement comprehensive security measures to protect their data and systems.

## The Current Threat Landscape

Today's businesses face an ever-evolving array of cyber threats. From ransomware attacks to data breaches, the stakes have never been higher.

### Key Practices

- **Data Encryption:** Encrypt sensitive data both in transit and at rest.
- **Access Controls:** Implement strong authentication and authorization mechanisms.
- **Regular Updates:** Keep all systems and software up to date with the latest security patches.
- **Incident Response:** Develop and test incident response plans regularly.

## Benefits of Strong Cybersecurity

The benefits of implementing strong cybersecurity practices are substantial. Companies that invest in security see reduced risk, improved compliance, and enhanced customer trust.

## Getting Started

Implementing cybersecurity best practices doesn't have to be overwhelming. Start with a security audit, identify vulnerabilities, and develop a comprehensive security strategy.

## Conclusion

The future of business security is proactive. Companies that implement strong cybersecurity practices today will be better protected tomorrow.
      `,
      category: "IT Services",
      tags: ["Cybersecurity", "IT", "Security", "Best Practices"],
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
      authorName: process.env.NEXT_PUBLIC_SITE_NAME || "",
      authorAvatar: "",
      authorRole: "Company",
      publishedAt: "2024-01-20",
      readTime: 7,
      featured: false,
    },
    {
      title: "How to Grow Your Business with Data-Driven Decisions",
      slug: "grow-business-data-driven-decisions",
      excerpt: "Unlock the power of data analytics to make informed business decisions that drive growth, improve customer experience, and optimize operations.",
      content: `
## Introduction

Data-driven decision making is transforming how businesses operate. By leveraging analytics and insights, companies can make more informed decisions that drive growth and improve outcomes.

## The Power of Data Analytics

Today's businesses have access to more data than ever before. The challenge is turning that data into actionable insights that drive business value.

### Key Strategies

- **Data Collection:** Implement systems to collect relevant business data.
- **Analytics Tools:** Use advanced analytics tools to process and analyze data.
- **Visualization:** Create clear visualizations to communicate insights effectively.
- **Action Plans:** Develop action plans based on data-driven insights.

## Benefits of Data-Driven Decisions

The benefits of making data-driven decisions are substantial. Companies that leverage data see improved performance, better customer experiences, and increased profitability.

## Getting Started

Implementing data-driven decision making doesn't have to be overwhelming. Start with identifying key metrics, implementing analytics tools, and developing a culture of data-driven thinking.

## Conclusion

The future of business is data-driven. Companies that embrace analytics today will have a significant competitive advantage tomorrow.
      `,
      category: "Business Growth",
      tags: ["Business Growth", "Analytics", "Data", "Strategy"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      authorName: process.env.NEXT_PUBLIC_SITE_NAME || "",
      authorAvatar: "",
      authorRole: "Company",
      publishedAt: "2024-01-18",
      readTime: 9,
      featured: false,
    },
    {
      title: "Cloud Migration: A Complete Guide",
      slug: "cloud-migration-complete-guide",
      excerpt: "Navigate your cloud migration journey with confidence. Learn about planning, execution, and best practices for moving your infrastructure to the cloud.",
      content: `
## Introduction

Cloud migration is a critical step for modern businesses looking to improve scalability, reduce costs, and enhance flexibility. However, the migration process requires careful planning and execution.

## The Cloud Migration Process

Migrating to the cloud involves several key steps, from initial assessment to post-migration optimization. Each phase requires careful planning and execution.

### Key Steps

- **Assessment:** Evaluate your current infrastructure and identify migration candidates.
- **Planning:** Develop a comprehensive migration plan with timelines and milestones.
- **Execution:** Execute the migration with minimal disruption to business operations.
- **Optimization:** Optimize cloud resources for performance and cost efficiency.

## Benefits of Cloud Migration

The benefits of cloud migration are substantial. Companies that migrate to the cloud see improved scalability, reduced costs, and enhanced flexibility.

## Getting Started

Planning a cloud migration doesn't have to be overwhelming. Start with a comprehensive assessment, develop a detailed plan, and work with experienced cloud migration partners.

## Conclusion

The future of infrastructure is in the cloud. Companies that migrate today will have a significant competitive advantage tomorrow.
      `,
      category: "IT Services",
      tags: ["Cloud", "Migration", "IT", "Infrastructure"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
      authorName: process.env.NEXT_PUBLIC_SITE_NAME || "",
      authorAvatar: "",
      authorRole: "Company",
      publishedAt: "2024-01-12",
      readTime: 12,
      featured: false,
    },
    {
      title: "The Power of Content Marketing in 2024",
      slug: "power-of-content-marketing-2024",
      excerpt: "Discover how content marketing continues to be a powerful tool for building brand awareness, engaging audiences, and driving conversions in 2024.",
      content: `
## Introduction

Content marketing remains one of the most effective strategies for building brand awareness and driving business growth. In 2024, the landscape continues to evolve with new platforms and formats.

## The Evolution of Content Marketing

Content marketing has evolved significantly over the years. Today's strategies focus on creating valuable, engaging content that resonates with target audiences.

### Key Strategies

- **Content Planning:** Develop a comprehensive content calendar aligned with business goals.
- **Multi-Format Content:** Create content in various formats including blog posts, videos, and infographics.
- **SEO Optimization:** Optimize content for search engines to improve visibility.
- **Distribution:** Leverage multiple channels to distribute and promote content.

## Benefits of Content Marketing

The benefits of content marketing are substantial. Companies that invest in content see improved brand awareness, increased engagement, and higher conversion rates.

## Getting Started

Implementing content marketing doesn't have to be overwhelming. Start with understanding your audience, developing a content strategy, and creating high-quality content consistently.

## Conclusion

The future of marketing is content-driven. Companies that invest in content marketing today will have a significant competitive advantage tomorrow.
      `,
      category: "Digital Marketing",
      tags: ["Content Marketing", "Marketing", "SEO", "Strategy"],
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
      authorName: process.env.NEXT_PUBLIC_SITE_NAME || "",
      authorAvatar: "",
      authorRole: "Company",
      publishedAt: "2024-01-08",
      readTime: 5,
      featured: false,
    },
    {
      title: "AI Chatbots: Transforming Customer Service",
      slug: "ai-chatbots-transforming-customer-service",
      excerpt: "Learn how AI-powered chatbots are revolutionizing customer service, providing 24/7 support, reducing costs, and improving customer satisfaction.",
      content: `
## Introduction

AI chatbots are transforming customer service by providing instant, personalized support around the clock. These intelligent systems are revolutionizing how businesses interact with their customers.

## The Impact of AI Chatbots

AI chatbots are changing the customer service landscape by providing instant responses, handling multiple queries simultaneously, and learning from each interaction.

### Key Benefits

- **24/7 Availability:** Chatbots provide round-the-clock customer support without additional staffing costs.
- **Instant Responses:** Customers receive immediate answers to their queries.
- **Cost Efficiency:** Reduce customer service costs while maintaining high service quality.
- **Scalability:** Handle unlimited customer interactions simultaneously.

## Benefits of AI Chatbots

The benefits of implementing AI chatbots are substantial. Companies that deploy chatbots see improved customer satisfaction, reduced costs, and increased efficiency.

## Getting Started

Implementing AI chatbots doesn't have to be overwhelming. Start with identifying common customer queries, choosing the right chatbot platform, and training the system with relevant data.

## Conclusion

The future of customer service is AI-powered. Companies that implement chatbots today will have a significant competitive advantage tomorrow.
      `,
      category: "AI & Automation",
      tags: ["AI", "Chatbots", "Customer Service", "Automation"],
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
      authorName: process.env.NEXT_PUBLIC_SITE_NAME || "",
      authorAvatar: "",
      authorRole: "Company",
      publishedAt: "2024-01-03",
      readTime: 6,
      featured: false,
    },
    {
      title: "Scaling Your Startup: Technology Stack Essentials",
      slug: "scaling-startup-technology-stack",
      excerpt: "Build a technology foundation that grows with your startup. Learn about essential tools, frameworks, and architectures for scaling your business.",
      content: `
## Introduction

Choosing the right technology stack is crucial for startup success. The decisions you make early on will impact your ability to scale and grow your business.

## Essential Technology Components

A well-designed technology stack includes the right combination of tools, frameworks, and services that support your business goals and growth trajectory.

### Key Components

- **Frontend Framework:** Choose modern frameworks that support rapid development and scalability.
- **Backend Infrastructure:** Build robust backend systems that can handle growth.
- **Database Solutions:** Select databases that support your data requirements and scale.
- **Cloud Services:** Leverage cloud services for flexibility and scalability.

## Benefits of the Right Technology Stack

The benefits of choosing the right technology stack are substantial. Startups that make informed technology decisions see faster development, better scalability, and lower costs.

## Getting Started

Building the right technology stack doesn't have to be overwhelming. Start with understanding your requirements, evaluating options, and making informed decisions.

## Conclusion

The future of startups is technology-driven. Companies that build the right technology foundation today will have a significant competitive advantage tomorrow.
      `,
      category: "Technology",
      tags: ["Startup", "Technology", "Scaling", "Development"],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      authorName: process.env.NEXT_PUBLIC_SITE_NAME || "",
      authorAvatar: "",
      authorRole: "Company",
      publishedAt: "2024-01-01",
      readTime: 11,
      featured: false,
    },
  ];

  // Create blog posts
  for (const post of blogPosts) {
    const categoryId = categoryMap.get(post.category);
    if (!categoryId) {
      console.error(`❌ Category not found: ${post.category}`);
      continue;
    }

    const existing = await prisma.blog.findUnique({
      where: { slug: post.slug },
    });

    if (!existing) {
      await prisma.blog.create({
        data: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content.trim(), // Markdown content
          image: post.image,
          categoryId,
          authorName: post.authorName,
          authorAvatar: post.authorAvatar,
          authorRole: post.authorRole,
          tags: post.tags,
          publishedAt: new Date(post.publishedAt),
          readTime: post.readTime,
          featured: post.featured,
          isPublished: true,
        },
      });
      console.log(`✅ Created blog: ${post.title}`);
    } else {
      console.log(`ℹ️  Blog already exists: ${post.title}`);
    }
  }

  console.log("✨ Blog seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding blogs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

