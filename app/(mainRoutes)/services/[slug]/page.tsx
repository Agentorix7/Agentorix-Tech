import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { prisma } from "@/lib/prisma";
import type { ServiceData } from "@/lib/services-data";

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  
  return services.map((service: typeof services[0]) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug, isActive: true },
    select: {
      title: true,
      shortDescription: true,
      overview: true,
    },
  });
  
  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} - ${process.env.NEXT_PUBLIC_SITE_NAME} Solutions`,
    description: service.shortDescription || service.overview || `Learn more about ${service.title} at ${process.env.NEXT_PUBLIC_SITE_NAME} Solutions`,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug, isActive: true },
  });
  
  if (!service) {
    notFound();
  }

  // Convert database service to ServiceData format
  const fullServiceData: ServiceData = {
    slug: service.slug,
    title: service.title,
    shortDescription: service.shortDescription,
    overview: service.overview,
    image: service.image,
    icon: service.icon,
    sections: (service.sections as any) || [],
    features: (service.features as any) || [],
    benefits: (service.benefits as any) || [],
    useCases: (service.useCases as any) || [],
    caseStudies: (service.caseStudies as any) || [],
    pricing: (service.pricing as any) || undefined,
    cta: (service.cta as any) || { text: "Get Started", link: "/contact" },
  };

  return <ServiceDetailPage service={fullServiceData} />;
}

