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
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Calculate Website Visits (using total submissions/leads as proxy)
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
    const totalLeads = await prisma.contactSubmission.count() +
      await prisma.quoteRequest.count() +
      await prisma.chatLead.count();

    const leadsLast7Days = visitsLast7Days; // Same calculation
    const leadsPrevious7Days = visitsPrevious7Days; // Same calculation

    const leadsChange = leadsPrevious7Days > 0
      ? ((leadsLast7Days - leadsPrevious7Days) / leadsPrevious7Days) * 100
      : leadsLast7Days > 0 ? 100 : 0;

    // Calculate Blog Views (using published blogs count as proxy)
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

    return NextResponse.json({
      websiteVisits: {
        value: formatNumber(totalVisits),
        change: formatChange(visitsChange),
        trend: visitsChange >= 0 ? "up" : "down"
      },
      newLeads: {
        value: formatNumber(totalLeads),
        change: formatChange(leadsChange),
        trend: leadsChange >= 0 ? "up" : "down"
      },
      blogViews: {
        value: formatNumber(totalBlogViews),
        change: formatChange(blogViewsChange),
        trend: blogViewsChange >= 0 ? "up" : "down"
      }
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return new NextResponse("Failed to fetch dashboard stats", { status: 500 });
  }
}

