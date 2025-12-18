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
  const validStatuses = ["NEW", "READ", "REPLIED"] as const;
  const status = statusParam && validStatuses.includes(statusParam as any)
    ? (statusParam as "NEW" | "READ" | "REPLIED")
    : undefined;

  const submissions = await prisma.contactSubmission.findMany({
    where: {
      ...(status && { status }),
      OR: query
        ? [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { subject: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
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
  });

  return NextResponse.json(submissions);
}


