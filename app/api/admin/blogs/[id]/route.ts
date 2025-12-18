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
    excerpt,
    content,
    image,
    categoryId,
    authorUserId,
    authorName,
    authorAvatar,
    authorRole,
    tags,
    publishedAt,
    readTime,
    featured,
    isPublished,
  } = body;

  // Calculate read time if content changed
  let calculatedReadTime = readTime;
  if (content) {
    const wordCount = content.split(/\s+/).length;
    calculatedReadTime = Math.ceil(wordCount / 200);
  }

  const updated = await prisma.blog.update({
    where: { id },
    data: {
      slug,
      title,
      excerpt,
      content,
      image,
      categoryId,
      authorUserId,
      authorName,
      authorAvatar,
      authorRole,
      tags,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      readTime: calculatedReadTime,
      featured,
      isPublished,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      image: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
      authorUserId: true,
      authorName: true,
      authorAvatar: true,
      authorRole: true,
      tags: true,
      publishedAt: true,
      readTime: true,
      featured: true,
      isPublished: true,
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

  await prisma.blog.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}

