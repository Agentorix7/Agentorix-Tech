import type { Metadata } from "next";
import { BlogHero } from "@/components/sections/blog-hero";
import { BlogPosts } from "@/components/sections/blog-posts";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog - " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions | IT, AI, Marketing & Business Insights",
  description: "Discover insightful resources and expert advice on IT services, AI automation, digital marketing, SaaS, and business growth strategies from our seasoned team.",
  keywords: "IT blog, AI automation, digital marketing, SaaS, business growth, technology insights, cybersecurity, cloud solutions",
  openGraph: {
    title: "Blog - " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions",
    description: "Expert insights on IT, AI, Marketing, SaaS, and Business Growth",
    type: "website",
  },
};

export default async function Blog() {
  const [blogs, categories] = await Promise.all([
    prisma.blog.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
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
    }),
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      select: {
        name: true,
        slug: true,
      },
    }),
  ]);

  // Transform blogs to match the expected format
  const blogPosts = blogs.map((blog: typeof blogs[0]) => ({
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    image: blog.image,
    category: blog.category.name,
    author: {
      name: blog.authorName,
      avatar: blog.authorAvatar || "",
      role: blog.authorRole,
    },
    tags: blog.tags,
    publishedAt: blog.publishedAt?.toISOString() || new Date().toISOString(),
    readTime: blog.readTime,
    featured: blog.featured,
  }));

  const blogCategories = ["All", ...categories.map((cat: typeof categories[0]) => cat.name)];

  return (
    <>
      <BlogHero />
      <BlogPosts initialPosts={blogPosts} initialCategories={blogCategories} />
    </>
  );
}

