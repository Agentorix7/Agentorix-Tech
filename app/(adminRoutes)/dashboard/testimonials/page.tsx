import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { TestimonialsManagement } from "@/components/admin/testimonials-management";

export const metadata: Metadata = {
  title: "Testimonials - " + process.env.NEXT_PUBLIC_SITE_NAME + " Admin",
  description: "Manage testimonials displayed on the website.",
};

export default async function TestimonialsPage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
      role: true,
      company: true,
      image: true,
      content: true,
      rating: true,
      portfolioId: true,
      isFeatured: true,
      isActive: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <>
      <DashboardHeader
        title="Testimonials"
        description="Manage testimonials displayed on the website."
        healthStatus={false}
      />
      <TestimonialsManagement
        initialTestimonials={testimonials.map((t: any) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        }))}
      />
    </>
  );
}

