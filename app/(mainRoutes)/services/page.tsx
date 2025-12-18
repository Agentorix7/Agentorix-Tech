import type { Metadata } from "next";
import { ServicesHero } from "@/components/sections/services-hero";
import { AllServices } from "@/components/sections/all-services";
import { AdditionalServices } from "@/components/sections/additional-services";
import { ServicesIndustries } from "@/components/sections/services-industries";
import { ServicesPortfolio } from "@/components/sections/services-portfolio";
import { GetQuoteForm } from "@/components/sections/get-quote-form";
import { CTABanner } from "@/components/sections/cta-banner";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Services - " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions | IT, Marketing, AI & Digital Solutions",
  description: "Comprehensive digital services including IT solutions, digital marketing, AI agents, lead generation, web development, cloud services, and more. Transform your business with " + process.env.NEXT_PUBLIC_SITE_NAME + ".",
};

export default async function Services() {
  // Fetch main services (isMainService: true) and additional services (isMainService: false)
  const [mainServices, additionalServices, portfolios] = await Promise.all([
    prisma.service.findMany({
      where: {
        isMainService: true,
        isActive: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        image: true,
        icon: true,
      },
    }),
    prisma.service.findMany({
      where: {
        isMainService: false,
        isActive: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        image: true,
        icon: true,
      },
    }),
    prisma.portfolio.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        type: true,
        image: true,
        description: true,
        link: true,
        client: true,
        metrics: true,
        before: true,
        after: true,
        isFeatured: true,
        isActive: true,
        displayOrder: true,
      },
    }),
  ]);

  return (
    <div className="w-full">
      <ServicesHero />
      <AllServices services={mainServices} />
      <AdditionalServices services={additionalServices} />
      <ServicesIndustries />
      <ServicesPortfolio portfolios={portfolios} />
      <GetQuoteForm />
      <CTABanner />
    </div>
  );
}
  