import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const updated = await prisma.portfolio.update({
    where: { id },
    data: {
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

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.portfolio.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}

