import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about-hero";
import { CompanyIntro } from "@/components/sections/company-intro";
import { OurStory } from "@/components/sections/our-story";
import { LeadershipTeam } from "@/components/sections/leadership-team";
import { OurProcess } from "@/components/sections/our-process";
import { Achievements } from "@/components/sections/achievements";
import { CompanyCulture } from "@/components/sections/company-culture";
import { CTABanner } from "@/components/sections/cta-banner";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "About Us - " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions",
  description: "Learn about " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions - our mission, vision, values, leadership team, process, achievements, and company culture.",
};

export default async function About() {
  const allItems = await prisma.achievementCertification.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
  });

  const achievements = allItems
    .filter((item: typeof allItems[0]) => item.type === "ACHIEVEMENT")
    .map((item: typeof allItems[0]) => ({
      id: item.id,
      type: item.type,
      icon: item.icon,
      title: item.title,
      organization: item.organization,
      year: item.year,
      description: item.description,
      image: item.image,
      name: null,
      status: null,
      logo: null,
    }));

  const certifications = allItems
    .filter((item: typeof allItems[0]) => item.type === "CERTIFICATION")
    .map((item: typeof allItems[0]) => ({
      id: item.id,
      type: item.type,
      icon: null,
      title: null,
      organization: null,
      year: null,
      description: null,
      image: null,
      name: item.name,
      status: item.status,
      logo: item.logo,
    }));

  return (
    <div className="w-full">
      <AboutHero />
      <CompanyIntro />
      <OurStory />
      <LeadershipTeam />
      <OurProcess />
      <Achievements achievements={achievements} certifications={certifications} />
      <CompanyCulture />
      <CTABanner />
    </div>
  );
}
