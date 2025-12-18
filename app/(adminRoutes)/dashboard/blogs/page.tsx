import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { BlogCategoriesManagement } from "@/components/admin/blog-categories-management";
import { BlogsManagement } from "@/components/admin/blogs-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Blogs - " + process.env.NEXT_PUBLIC_SITE_NAME + " Admin",
  description: "Manage blog posts and categories on the " + process.env.NEXT_PUBLIC_SITE_NAME + " website.",
};

export default async function BlogsPage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  const [blogs, categories] = await Promise.all([
    prisma.blog.findMany({
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
    }),
    prisma.blogCategory.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return (
    <>
      <DashboardHeader
        title="Blogs"
        description="Manage blog posts and categories."
        healthStatus={false}
      />
      <Tabs defaultValue="posts" className="space-y-4 sm:space-y-6">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="posts" className="text-xs sm:text-sm">Blog Posts</TabsTrigger>
          <TabsTrigger value="categories" className="text-xs sm:text-sm">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <BlogsManagement
            initialBlogs={blogs.map((b: any) => ({
              ...b,
              publishedAt: b.publishedAt?.toISOString() || null,
              createdAt: b.createdAt.toISOString(),
              updatedAt: b.updatedAt.toISOString(),
            }))}
            categories={categories.map((c: any) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
            }))}
          />
        </TabsContent>
        <TabsContent value="categories">
          <BlogCategoriesManagement
            initialCategories={categories.map((c: any) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
              updatedAt: c.updatedAt.toISOString(),
            }))}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

