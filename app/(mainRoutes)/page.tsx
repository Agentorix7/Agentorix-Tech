import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSnapshot } from "@/components/sections/services-snapshot";
import { WhyChoose } from "@/components/sections/why-choose";
import { IndustriesServe } from "@/components/sections/industries-serve";
import { PortfolioHighlight } from "@/components/sections/portfolio-highlight";
import { Testimonials } from "@/components/sections/testimonials";
import { CTABanner } from "@/components/sections/cta-banner";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_SITE_NAME} Solutions - Empowering Businesses with IT, Marketing & AI Solutions`,
  description: `${process.env.NEXT_PUBLIC_SITE_NAME} delivers cutting-edge digital solutions that drive revenue, automate operations, and scale your business. IT Services, Digital Marketing, AI Agents, Lead Generation & more.`,
};

export default async function Home() {
  const [mainServices, testimonials, portfolios] = await Promise.all([
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
    prisma.testimonial.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
      select: {
        id: true,
        name: true,
        role: true,
        company: true,
        image: true,
        content: true,
        rating: true,
      },
    }),
    prisma.portfolio.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    }),
  ]);

  // Transform portfolios to match expected format
  const transformedPortfolios = portfolios.map((p: typeof portfolios[0]) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    type: p.type || null,
    image: p.image,
    description: p.description,
    link: p.link,
    metrics: p.metrics,
  }));

  return (
    <div className="w-full">
      <HeroSection />
      <ServicesSnapshot services={mainServices} />
      <WhyChoose />
      <IndustriesServe />
      <PortfolioHighlight portfolios={transformedPortfolios} />
      <Testimonials testimonials={testimonials} />
      <CTABanner />
    </div>
  );
}
