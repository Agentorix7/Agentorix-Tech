import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
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

  return NextResponse.json(blogs);
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

  if (!slug || !title || !excerpt || !content || !categoryId || !authorName) {
    return new NextResponse(
      "Missing required fields: slug, title, excerpt, content, categoryId, and authorName",
      { status: 400 }
    );
  }

  // Calculate read time (approximate: 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const calculatedReadTime = readTime || Math.ceil(wordCount / 200);

  const created = await prisma.blog.create({
    data: {
      slug,
      title,
      excerpt,
      content,
      image: image || "",
      categoryId,
      authorUserId: authorUserId || null,
      authorName,
      authorAvatar: authorAvatar || "",
      authorRole: authorRole || "Author",
      tags: tags || [],
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      readTime: calculatedReadTime,
      featured: featured ?? false,
      isPublished: isPublished ?? false,
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

  return NextResponse.json(created);
}

