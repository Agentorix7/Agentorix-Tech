import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { IndustriesManagement } from "@/components/admin/industries-management";

export const metadata: Metadata = {
  title: "Industries - " + process.env.NEXT_PUBLIC_SITE_NAME + " Admin",
  description: "Manage industries served by " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions.",
};

export default async function IndustriesPage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  const industries = await prisma.industry.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      image: true,
      services: true,
      displayOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <>
      <DashboardHeader
        title="Industries"
        description="Manage the industries we serve shown across the website."
        healthStatus={false}
      />
      <IndustriesManagement
        initialIndustries={industries.map((i: any) => ({
          ...i,
          createdAt: i.createdAt.toISOString(),
          updatedAt: i.updatedAt.toISOString(),
        }))}
      />
    </>
  );
}

