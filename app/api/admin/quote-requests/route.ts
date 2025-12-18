import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const query = searchParams.get("q") || "";

  // Validate status is a valid enum value
  const validStatuses = ["NEW", "IN_PROGRESS", "QUOTED", "COMPLETED"] as const;
  const status = statusParam && validStatuses.includes(statusParam as any)
    ? (statusParam as "NEW" | "IN_PROGRESS" | "QUOTED" | "COMPLETED")
    : undefined;

  const quotes = await prisma.quoteRequest.findMany({
    where: {
      ...(status && { status }),
      OR: query
        ? [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { company: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
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
  });

  return NextResponse.json(quotes);
}


