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
    name,
    description,
    image,
    services,
    displayOrder,
    isActive,
  } = body;

  const updated = await prisma.industry.update({
    where: { id },
    data: {
      slug,
      name,
      description,
      image,
      services,
      displayOrder,
      isActive,
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

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.industry.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}

