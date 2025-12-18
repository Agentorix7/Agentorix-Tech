import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServicesManagement } from "@/components/admin/services-management";
import { DashboardHeader } from "@/components/admin/dashboard-header";

export const metadata: Metadata = {
  title: "Services - " + process.env.NEXT_PUBLIC_SITE_NAME + " Admin",
  description: "Manage services for " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions",
};

export default async function Services() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  const services = await prisma.service.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      overview: true,
      image: true,
      icon: true,
      isMainService: true,
      isActive: true,
      displayOrder: true,
      sections: true,
      features: true,
      benefits: true,
      useCases: true,
      caseStudies: true,
      pricing: true,
      cta: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Services"
        description="Manage the services shown across the website."
        healthStatus={false}
      />
      <ServicesManagement
        initialServices={services.map((s: any) => ({
          ...s,
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}

