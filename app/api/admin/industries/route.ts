import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const industries = await prisma.industry.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      image: true,
      services: true,
      displayOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(industries);
}

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const {
    slug,
    name,
    description,
    image,
    services,
    displayOrder,
    isActive,
  } = body;

  if (!slug || !name) {
    return new NextResponse("Missing required fields: slug and name", { status: 400 });
  }

  const created = await prisma.industry.create({
    data: {
      slug,
      name,
      description: description || null,
      image: image || null,
      services: services || null,
      displayOrder: displayOrder ?? null,
      isActive: isActive ?? true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      image: true,
      services: true,
      displayOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(created);
}

