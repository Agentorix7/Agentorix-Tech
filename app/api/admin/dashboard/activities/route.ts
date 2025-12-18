import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Fetch recent activities from different sources
    const [recentQuotes, recentContacts, recentBlogs, recentChatLeads] = await Promise.all([
      // Recent quote requests (last 10)
      prisma.quoteRequest.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          company: true,
          createdAt: true,
        }
      }),
      // Recent contact submissions (last 10)
      prisma.contactSubmission.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
        }
      }),
      // Recent published blogs (last 10)
      prisma.blog.findMany({
        take: 10,
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          publishedAt: true,
        }
      }),
      // Recent chat leads (last 10)
      prisma.chatLead.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          company: true,
          createdAt: true,
        }
      })
    ]);

    // Combine and format activities
    const activities: Array<{
      type: "lead" | "blog" | "contact";
      title: string;
      meta: string;
      createdAt: Date;
    }> = [];

    // Add quote requests
    recentQuotes.forEach((quote: typeof recentQuotes[0]) => {
      activities.push({
        type: "lead",
        title: `New quote request${quote.company ? ` from ${quote.company}` : ` from ${quote.name}`}`,
        meta: `Lead · ${formatTimeAgo(quote.createdAt)}`,
        createdAt: quote.createdAt,
      });
    });

    // Add contact submissions
    recentContacts.forEach((contact: typeof recentContacts[0]) => {
      activities.push({
        type: "contact",
        title: `Contact form submitted by ${contact.name}`,
        meta: `Contact · ${formatTimeAgo(contact.createdAt)}`,
        createdAt: contact.createdAt,
      });
    });

    // Add published blogs
    recentBlogs.forEach((blog: typeof recentBlogs[0]) => {
      if (blog.publishedAt) {
        activities.push({
          type: "blog",
          title: `Published blog: ${blog.title}`,
          meta: `Blog · ${formatTimeAgo(blog.publishedAt)}`,
          createdAt: blog.publishedAt,
        });
      }
    });

    // Add chat leads
    recentChatLeads.forEach((lead: typeof recentChatLeads[0]) => {
      if (lead.name || lead.company) {
        activities.push({
          type: "lead",
          title: `New lead${lead.company ? ` from ${lead.company}` : lead.name ? `: ${lead.name}` : ""}`,
          meta: `Lead · ${formatTimeAgo(lead.createdAt)}`,
          createdAt: lead.createdAt,
        });
      }
    });

    // Sort by createdAt (most recent first) and take top 10
    activities.sort((a: typeof activities[0], b: typeof activities[0]) => b.createdAt.getTime() - a.createdAt.getTime());
    const topActivities = activities.slice(0, 10);

    return NextResponse.json(topActivities);
  } catch (error) {
    console.error("Failed to fetch dashboard activities:", error);
    return new NextResponse("Failed to fetch dashboard activities", { status: 500 });
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec${diffInSeconds !== 1 ? "s" : ""} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;
}

