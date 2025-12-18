import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UsersManagement } from "@/components/admin/users-management";
import { DashboardHeader } from "@/components/admin/dashboard-header";

export const metadata: Metadata = {
  title: "Users - " + process.env.NEXT_PUBLIC_SITE_NAME + " Admin",
  description: "Manage admin users and public team members.",
};

export default async function UsersPage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  const [users, teamMembers] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    }),
    prisma.teamMember.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        role: true,
        department: true,
        email: true,
        bio: true,
        image: true,
        linkedinUrl: true,
      },
    }),
  ]);

  return (
    <>
    <DashboardHeader title="Users" description="Manage admin users and public team members." healthStatus={false} />
    <UsersManagement
      initialUsers={users.map((u: any) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      }))}
      initialTeamMembers={teamMembers}
    />
    </>
  );
}


