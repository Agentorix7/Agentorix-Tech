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
  const { slug, name, description } = body;

  const updated = await prisma.blogCategory.update({
    where: { id },
    data: {
      slug,
      name,
      description,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
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

  // Check if category has blogs
  const category = await prisma.blogCategory.findUnique({
    where: { id },
    include: { blogs: true },
  });

  if (category && category.blogs.length > 0) {
    return new NextResponse(
      `Cannot delete category with ${category.blogs.length} blog(s). Please delete or reassign blogs first.`,
      { status: 400 }
    );
  }

  await prisma.blogCategory.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}

