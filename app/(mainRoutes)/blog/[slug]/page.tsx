import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogDetailPage } from "@/components/sections/blog-detail-page";

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: {
      isPublished: true,
    },
    select: {
      slug: true,
    },
  });

  return blogs.map((blog: typeof blogs[0]) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({
    where: { slug, isPublished: true },
    select: {
      title: true,
      excerpt: true,
      image: true,
      tags: true,
      publishedAt: true,
      authorName: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - ${process.env.NEXT_PUBLIC_SITE_NAME} Solutions Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    authors: [{ name: post.authorName }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      images: [post.image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({
    where: { slug, isPublished: true },
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
          name: true,
        },
      },
      authorName: true,
      authorAvatar: true,
      authorRole: true,
      tags: true,
      publishedAt: true,
      readTime: true,
      featured: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = await prisma.blog.findMany({
    where: {
      categoryId: post.categoryId || undefined,
      isPublished: true,
      slug: { not: slug },
    },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      image: true,
      category: {
        select: {
          name: true,
        },
      },
      authorName: true,
      authorAvatar: true,
      authorRole: true,
      tags: true,
      publishedAt: true,
      readTime: true,
      featured: true,
    },
  });

  // Transform post to match expected format
  const transformedPost = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content, // Markdown content
    image: post.image,
    category: post.category.name,
    author: {
      name: post.authorName,
      avatar: post.authorAvatar || "",
      role: post.authorRole,
    },
    tags: post.tags,
    publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
    readTime: post.readTime,
    featured: post.featured,
  };

  const transformedRelatedPosts = relatedPosts.map((p: typeof relatedPosts[0]) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    image: p.image,
    category: p.category.name,
    author: {
      name: p.authorName,
      avatar: p.authorAvatar || "",
      role: p.authorRole,
    },
    tags: p.tags,
    publishedAt: p.publishedAt?.toISOString() || new Date().toISOString(),
    readTime: p.readTime,
    featured: p.featured,
  }));

  return <BlogDetailPage post={transformedPost} relatedPosts={transformedRelatedPosts} />;
}

