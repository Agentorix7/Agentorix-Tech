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
    name,
    role,
    company,
    image,
    content,
    rating,
    portfolioId,
    isFeatured,
    isActive,
    displayOrder,
  } = body;

  // Validate rating if provided
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return new NextResponse("Rating must be between 1 and 5", { status: 400 });
  }

  const updated = await prisma.testimonial.update({
    where: { id },
    data: {
      name,
      role,
      company,
      image,
      content,
      rating: rating !== undefined ? Number(rating) : undefined,
      portfolioId: portfolioId || null,
      isFeatured,
      isActive,
      displayOrder,
    },
    select: {
      id: true,
      name: true,
      role: true,
      company: true,
      image: true,
      content: true,
      rating: true,
      portfolioId: true,
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

  await prisma.testimonial.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}

