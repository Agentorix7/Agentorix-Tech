import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const portfolios = await prisma.portfolio.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      type: true,
      image: true,
      description: true,
      link: true,
      client: true,
      metrics: true,
      before: true,
      after: true,
      isFeatured: true,
      isActive: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(portfolios);
}

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const {
    slug,
    title,
    category,
    type,
    image,
    description,
    link,
    client,
    metrics,
    before,
    after,
    isFeatured,
    isActive,
    displayOrder,
  } = body;

  if (!slug || !title || !category || !type || !image || !description) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const created = await prisma.portfolio.create({
    data: {
      slug,
      title,
      category,
      type: type || null,
      image,
      description,
      link: link || null,
      client: client || null,
      metrics: metrics || null,
      before: before || null,
      after: after || null,
      isFeatured: isFeatured ?? false,
      isActive: isActive ?? true,
      displayOrder: displayOrder ?? null,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      type: true,
      image: true,
      description: true,
      link: true,
      client: true,
      metrics: true,
      before: true,
      after: true,
      isFeatured: true,
      isActive: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(created);
}

