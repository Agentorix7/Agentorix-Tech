import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SettingsManagement } from "@/components/admin/settings-management";
import { DashboardHeader } from "@/components/admin/dashboard-header";

export const metadata: Metadata = {
  title: "Settings - " + process.env.NEXT_PUBLIC_SITE_NAME + " Admin",
  description: "Manage your account settings and preferences.",
};

export default async function SettingsPage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  // Fetch user data from database to get the latest name
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <DashboardHeader 
        title="Settings" 
        description="Manage your account settings and site preferences." 
        healthStatus={false} 
      />
      <SettingsManagement user={user} />
    </>
  );
}

