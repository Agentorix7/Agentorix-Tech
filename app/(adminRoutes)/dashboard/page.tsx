import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { AnalyticsCards } from "@/components/admin/analytics-cards";
import { RecentActivity } from "@/components/admin/recent-activity";
import { TrafficOverview } from "@/components/admin/traffic-overview";

export const metadata: Metadata = {
  title: "Dashboard - " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions",
  description: "Admin dashboard for " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions",
};

async function getDashboardStats() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Calculate Website Visits
    // NOTE: This is a proxy metric using total engagement (contact forms + quote requests + chat leads)
    // For actual website visits, you would need to integrate Google Analytics or a similar service
    const totalVisits = await prisma.contactSubmission.count() +
      await prisma.quoteRequest.count() +
      await prisma.chatLead.count();

    const visitsLast7Days = await prisma.contactSubmission.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    }) + await prisma.quoteRequest.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    }) + await prisma.chatLead.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    });

    const visitsPrevious7Days = await prisma.contactSubmission.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } }
    }) + await prisma.quoteRequest.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } }
    }) + await prisma.chatLead.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } }
    });

    const visitsChange = visitsPrevious7Days > 0
      ? ((visitsLast7Days - visitsPrevious7Days) / visitsPrevious7Days) * 100
      : visitsLast7Days > 0 ? 100 : 0;

    // Calculate New Leads
    const totalLeads = totalVisits; // Same calculation
    const leadsLast7Days = visitsLast7Days;
    const leadsPrevious7Days = visitsPrevious7Days;
    const leadsChange = visitsChange;

    // Calculate Blog Views
    // NOTE: This shows the total count of published blogs
    // For actual blog view counts, you would need to add a viewCount field to the Blog model
    // and track views when users visit blog detail pages
    const totalBlogViews = await prisma.blog.count({
      where: { isPublished: true }
    });

    const blogsLast7Days = await prisma.blog.count({
      where: {
        isPublished: true,
        publishedAt: { gte: sevenDaysAgo }
      }
    });

    const blogsPrevious7Days = await prisma.blog.count({
      where: {
        isPublished: true,
        publishedAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo }
      }
    });

    const blogViewsChange = blogsPrevious7Days > 0
      ? ((blogsLast7Days - blogsPrevious7Days) / blogsPrevious7Days) * 100
      : blogsLast7Days > 0 ? 100 : 0;

    // Format numbers with commas
    const formatNumber = (num: number) => {
      return num.toLocaleString('en-US');
    };

    // Format percentage change
    const formatChange = (change: number) => {
      const sign = change >= 0 ? "+" : "";
      return `${sign}${change.toFixed(1)}%`;
    };

    return {
      websiteVisits: {
        value: formatNumber(totalVisits),
        change: formatChange(visitsChange),
        trend: visitsChange >= 0 ? "up" as const : "down" as const
      },
      newLeads: {
        value: formatNumber(totalLeads),
        change: formatChange(leadsChange),
        trend: leadsChange >= 0 ? "up" as const : "down" as const
      },
      blogViews: {
        value: formatNumber(totalBlogViews),
        change: formatChange(blogViewsChange),
        trend: blogViewsChange >= 0 ? "up" as const : "down" as const
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return default values on error
    return {
      websiteVisits: { value: "0", change: "0%", trend: "up" as const },
      newLeads: { value: "0", change: "0%", trend: "up" as const },
      blogViews: { value: "0", change: "0%", trend: "up" as const },
    };
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

async function getDashboardActivities() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch recent activities from different sources (last 7 days only)
    const [recentQuotes, recentContacts, recentBlogs, recentChatLeads] = await Promise.all([
      // Recent quote requests (last 7 days)
      prisma.quoteRequest.findMany({
        take: 20,
        where: { createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          company: true,
          createdAt: true,
        }
      }),
      // Recent contact submissions (last 7 days)
      prisma.contactSubmission.findMany({
        take: 20,
        where: { createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
        }
      }),
      // Recent published blogs (last 7 days)
      prisma.blog.findMany({
        take: 20,
        where: { 
          isPublished: true,
          publishedAt: { gte: sevenDaysAgo }
        },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          publishedAt: true,
        }
      }),
      // Recent chat leads (last 7 days)
      prisma.chatLead.findMany({
        take: 20,
        where: { createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          company: true,
          createdAt: true,
        }
      })
    ]);

    // Combine and format activities with dates for sorting
    const activities: Array<{
      type: "lead" | "blog" | "contact";
      title: string;
      meta: string;
      link: string;
      createdAt: Date;
    }> = [];

    // Add quote requests
    recentQuotes.forEach((quote: typeof recentQuotes[0]) => {
      activities.push({
        type: "lead",
        title: `New quote request${quote.company ? ` from ${quote.company}` : ` from ${quote.name}`}`,
        meta: `Lead · ${formatTimeAgo(quote.createdAt)}`,
        link: `/dashboard/contacts?tab=quotes`,
        createdAt: quote.createdAt,
      });
    });

    // Add contact submissions
    recentContacts.forEach((contact: typeof recentContacts[0]) => {
      activities.push({
        type: "contact",
        title: `Contact form submitted by ${contact.name}`,
        meta: `Contact · ${formatTimeAgo(contact.createdAt)}`,
        link: `/dashboard/contacts?tab=contacts`,
        createdAt: contact.createdAt,
      });
    });

    // Add published blogs
    recentBlogs.forEach((blog: typeof recentBlogs[0]) => {
      if (blog.publishedAt && blog.slug) {
        activities.push({
          type: "blog",
          title: `Published blog: ${blog.title}`,
          meta: `Blog · ${formatTimeAgo(blog.publishedAt)}`,
          link: `/blog/${blog.slug}`,
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
          link: `/dashboard/contacts?tab=chatbot-leads`,
          createdAt: lead.createdAt,
        });
      }
    });

    // Sort by createdAt (most recent first) and take top 10
    activities.sort((a: typeof activities[0], b: typeof activities[0]) => b.createdAt.getTime() - a.createdAt.getTime());

    // Return activities with links
    return activities.slice(0, 10).map((activity: typeof activities[0]) => {
      const { createdAt, ...rest } = activity;
      return rest;
    });
  } catch (error) {
    console.error("Error fetching dashboard activities:", error);
    return [];
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  const [stats, activities] = await Promise.all([
    getDashboardStats(),
    getDashboardActivities(),
  ]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader title="Dashboard" description={`Overview of ${process.env.NEXT_PUBLIC_SITE_NAME} website performance, leads, and content activity.`} healthStatus={true} />
      <AnalyticsCards data={stats} />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <TrafficOverview />
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}

