import type { Metadata } from "next";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { ContactsManagement } from "@/components/admin/contacts-management";

export const metadata: Metadata = {
  title: "Contacts - " + process.env.NEXT_PUBLIC_SITE_NAME + " Admin",
  description: "Manage contact messages and quote requests from the " + process.env.NEXT_PUBLIC_SITE_NAME + " website.",
};

export default async function ContactsPage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  const [contactSubmissions, quoteRequests, chatLeads] = await Promise.all([
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        subject: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        website: true,
        services: true,
        projectDescription: true,
        timeline: true,
        budget: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.chatLead.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        message: true,
        budget: true,
        sourcePage: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return (
    <>
      <DashboardHeader
        title="Contacts"
        description="Manage contact messages and quote requests from the website."
        healthStatus={false}
      />
      <Suspense fallback={<div className="p-4 text-center text-muted-foreground">Loading contacts...</div>}>
        <ContactsManagement
          initialContactSubmissions={contactSubmissions.map((c: any) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
          }))}
          initialQuoteRequests={quoteRequests.map((q: any) => ({
            ...q,
            createdAt: q.createdAt.toISOString(),
            updatedAt: q.updatedAt.toISOString(),
          }))}
          initialChatLeads={chatLeads.map((l: any) => ({
            ...l,
            createdAt: l.createdAt.toISOString(),
            updatedAt: l.updatedAt.toISOString(),
          }))}
        />
      </Suspense>
    </>
  );
}


