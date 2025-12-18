import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
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

  return NextResponse.json(testimonials);
}

export async function POST(req: Request) {
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

  if (!name || !role || !company || !content || !rating) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  // Validate rating (1-5)
  if (rating < 1 || rating > 5) {
    return new NextResponse("Rating must be between 1 and 5", { status: 400 });
  }

  const created = await prisma.testimonial.create({
    data: {
      name,
      role,
      company,
      image: image || "",
      content,
      rating: Number(rating),
      portfolioId: portfolioId || null,
      isFeatured: isFeatured ?? false,
      isActive: isActive ?? true,
      displayOrder: displayOrder ?? null,
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

  return NextResponse.json(created);
}

