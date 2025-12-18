"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AdminModal } from "@/components/admin/admin-modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pencil, Plus, Trash2, FileText, X, Calendar } from "lucide-react";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import Image from "next/image";
import Link from "next/link";

type BlogCategory = {
  id: string;
  slug: string;
  name: string;
};

type BlogSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  image: string;
  categoryId: string;
  category: BlogCategory;
  authorUserId: string | null;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  tags: string[];
  publishedAt: string | null;
  readTime: number;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type BlogFormState = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  image: string;
  categoryId: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  isPublished: boolean;
};

async function jsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as T;
  }
}

export function BlogsManagement({
  initialBlogs,
  categories,
}: {
  initialBlogs: BlogSummary[];
  categories: BlogCategory[];
}) {
  const [blogs, setBlogs] = useState<BlogSummary[]>(initialBlogs);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editBlog, setEditBlog] = useState<BlogSummary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    let result = blogs;

    if (categoryFilter !== "all") {
      result = result.filter((b) => b.categoryId === categoryFilter);
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(lowerQuery) ||
          b.excerpt.toLowerCase().includes(lowerQuery) ||
          b.slug.toLowerCase().includes(lowerQuery) ||
          b.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    return result;
  }, [blogs, query, categoryFilter]);

  const handleDelete = async (id: string) => {
    const prev = blogs;
    setBlogs((list) => list.filter((b) => b.id !== id));
    try {
      await jsonFetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      toast.success("Blog deleted");
    } catch (err) {
      console.error(err);
      setBlogs(prev);
      toast.error("Failed to delete blog");
    }
  };

  const handleCreate = async (data: Partial<BlogSummary>) => {
    setLoading(true);
    try {
      const created = await jsonFetch<BlogSummary>("/api/admin/blogs", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setBlogs((prev) => [created, ...prev]);
      toast.success("Blog created");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<BlogSummary>) => {
    setLoading(true);
    try {
      const updated = await jsonFetch<BlogSummary>(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setBlogs((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast.success("Blog updated");
      setEditBlog(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Blog Posts</h2>
          <Badge variant="secondary" className="text-xs">{blogs.length}</Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-full sm:w-40 text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search blogs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-56 text-sm"
          />
          <Button size="sm" onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" /> <span className="text-xs sm:text-sm">Add Blog</span>
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="rounded-lg sm:rounded-2xl border border-dashed border-border/60">
          <CardContent className="py-8 sm:py-10 text-center text-xs sm:text-sm text-muted-foreground">
            No blogs found. Add one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((blog) => (
            <Card
              key={blog.id}
              className="group p-0 m-0 gap-0 relative overflow-hidden rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 bg-card"
            >
              {/* Image with overlay */}
              {blog.image ? (
                <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Badges overlay on image */}
                  {/* <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm">
                      {blog.category.name}
                    </Badge>
                    {blog.featured && (
                      <Badge variant="default" className="text-xs bg-primary/90 backdrop-blur-sm">
                        Featured
                      </Badge>
                    )}
                    {blog.isPublished ? (
                      <Badge className="text-xs bg-green-500/90 backdrop-blur-sm text-white">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-muted/90 backdrop-blur-sm">
                        Draft
                      </Badge>
                    )}
                  </div> */}
                </div>
              ) : (
                <div className="relative h-56 w-full bg-muted rounded-t-2xl flex items-center justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title */}
                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                          : "Not published"}
                      </span>
                    </div>
                    <span className="text-muted-foreground/60">•</span>
                    <span>{blog.readTime} min read</span>
                  </div>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs font-normal">
                          +{blog.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2"
                      onClick={() => setEditBlog(blog)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="text-xs">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setConfirmDeleteId(blog.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="text-xs">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create modal */}
      <BlogModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={loading}
        title="Add Blog Post"
        categories={categories}
        icon={<FileText className="h-4 w-4" />}
      />

      {/* Edit modal */}
      <BlogModal
        open={!!editBlog}
        onClose={() => setEditBlog(null)}
        onSubmit={(data) => {
          if (editBlog) {
            return handleUpdate(editBlog.id, data);
          }
        }}
        loading={loading}
        title="Edit Blog Post"
        initial={editBlog || undefined}
        categories={categories}
        icon={<FileText className="h-4 w-4" />}
      />

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            const id = confirmDeleteId;
            setConfirmDeleteId(null);
            void handleDelete(id);
          }
        }}
        title="Delete blog post?"
        description="This will permanently delete the blog post."
      />
    </div>
  );
}

function BlogModal({
  open,
  onClose,
  onSubmit,
  loading,
  title,
  initial,
  categories,
  icon,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BlogSummary>) => Promise<void> | void;
  loading: boolean;
  title: string;
  initial?: BlogSummary;
  categories: BlogCategory[];
  icon?: React.ReactNode;
}) {
  const [form, setForm] = useState<BlogFormState>(() => {
    if (initial) {
      return {
        slug: initial.slug || "",
        title: initial.title || "",
        excerpt: initial.excerpt || "",
        content: initial.content || "",
        image: initial.image || "",
        categoryId: initial.categoryId || categories[0]?.id || "",
        tags: initial.tags || [],
        readTime: initial.readTime || 5,
        featured: initial.featured ?? false,
        isPublished: initial.isPublished ?? false,
      };
    }
    return {
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      image: "",
      categoryId: categories[0]?.id || "",
      tags: [],
      readTime: 5,
      featured: false,
      isPublished: false,
    };
  });

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        slug: initial.slug || "",
        title: initial.title || "",
        excerpt: initial.excerpt || "",
        content: initial.content || "",
        image: initial.image || "",
        categoryId: initial.categoryId || categories[0]?.id || "",
        tags: initial.tags || [],
        readTime: initial.readTime || 5,
        featured: initial.featured ?? false,
        isPublished: initial.isPublished ?? false,
      });
    } else {
      setForm({
        slug: "",
        title: "",
        excerpt: "",
        content: "",
        image: "",
        categoryId: categories[0]?.id || "",
        tags: [],
        readTime: 5,
        featured: false,
        isPublished: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial?.id]);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [newTag, setNewTag] = useState("");

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setForm((f) => ({ ...f, title: newTitle }));
    if (!initial) {
      setForm((f) => ({ ...f, slug: generateSlug(newTitle) }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm((f) => ({ ...f, tags: [...f.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      toast.error("Please wait for the image upload to finish.");
      return;
    }

    // Validation
    if (!form.title?.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.slug?.trim()) {
      toast.error("Slug is required.");
      return;
    }
    if (!form.excerpt?.trim()) {
      toast.error("Excerpt is required.");
      return;
    }
    if (!form.content?.trim()) {
      toast.error("Content is required.");
      return;
    }
    if (!form.categoryId) {
      toast.error("Please select a category.");
      return;
    }

    try {
      // Auto-set publishedAt to current date if publishing
      const publishedAt = form.isPublished ? new Date().toISOString() : null;

      const payload: any = {
        slug: form.slug,
        title: form.title,
        excerpt: form.excerpt,
        content: form.content, // Markdown content
        image: form.image || "",
        categoryId: form.categoryId,
        authorUserId: null,
        authorName: process.env.NEXT_PUBLIC_SITE_NAME || "", // Company name
        authorAvatar: "",
        authorRole: "Company",
        tags: form.tags,
        publishedAt: publishedAt,
        readTime: form.readTime,
        featured: form.featured,
        isPublished: form.isPublished,
      };

      await onSubmit(payload);
    } catch (err: any) {
      toast.error(err?.message || "Invalid input");
    }
  };

  if (!open) return null;

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      description="Create and manage blog posts with markdown content."
      icon={icon}
      imageSrc={form.image || undefined}
    >
      <form key={initial?.id || "new"} onSubmit={handleSubmit} className="space-y-6 text-sm">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={handleTitleChange}
                placeholder="The Future of AI in Business"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="future-of-ai-in-business"
                disabled={!initial}
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated for new posts. URL-friendly identifier.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="excerpt">
              Excerpt <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="excerpt"
              required
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              className="min-h-[80px]"
              placeholder="Brief summary of the blog post..."
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground">
              {form.excerpt.length}/300 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="categoryId">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.categoryId}
                onValueChange={(value) => setForm((f) => ({ ...f, categoryId: value }))}
              >
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="readTime">Read Time (minutes)</Label>
              <Input
                id="readTime"
                type="number"
                min="1"
                value={form.readTime}
                onChange={(e) => setForm((f) => ({ ...f, readTime: Number(e.target.value) }))}
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">
                Auto-calculated from content length
              </p>
            </div>
          </div>

          <FileUploadField
            label="Blog Image"
            description="Upload a blog image for this blog post."
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            uploadUrl="/api/admin/uploads/portfolio-image"
            onUploadingChange={setUploadingImage}
          />
        </div>

        {/* Content */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Content</h3>
          <MarkdownEditor
            value={form.content}
            onChange={(value) => setForm((f) => ({ ...f, content: value }))}
            label="Blog Content"
            required
            placeholder={`Write your blog post content here...`}
          />
        </div>

        {/* Tags */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Tags</h3>
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag and press Enter"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Publishing Settings */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Publishing Settings</h3>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, featured: checked }))}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isPublished"
                checked={form.isPublished}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, isPublished: checked }))}
              />
              <Label htmlFor="isPublished" className="cursor-pointer">
                Published
              </Label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {form.isPublished
              ? "Publish date will be automatically set to the current date when you save."
              : "Enable 'Published' to automatically set the publish date to today."}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading || uploadingImage}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading || uploadingImage}>
            {loading ? "Saving..." : initial ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

