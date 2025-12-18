import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { AchievementsManagement } from "@/components/admin/achievements-management";

export const metadata: Metadata = {
  title: "Achievements & Certifications - " + process.env.NEXT_PUBLIC_SITE_NAME + " Admin",
  description: "Manage achievements and certifications displayed on the " + process.env.NEXT_PUBLIC_SITE_NAME + " website.",
};

export default async function AchievementsPage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  const achievements = await prisma.achievementCertification.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <>
      <DashboardHeader
        title="Achievements & Certifications"
        description="Manage achievements and certifications displayed on the website."
        healthStatus={false}
      />
      <AchievementsManagement
        initialAchievements={achievements.map((a: any) => ({
          ...a,
          createdAt: a.createdAt.toISOString(),
          updatedAt: a.updatedAt.toISOString(),
        }))}
      />
    </>
  );
}

