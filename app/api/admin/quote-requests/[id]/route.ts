import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { QuoteRequestStatus } from "@prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { status } = body as { status?: QuoteRequestStatus };

  if (!status) {
    return new NextResponse("Missing status", { status: 400 });
  }

  const updated = await prisma.quoteRequest.update({
    where: { id },
    data: { status },
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
  });

  return NextResponse.json(updated);
}


