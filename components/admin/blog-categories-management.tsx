"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { AdminModal } from "@/components/admin/admin-modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pencil, Plus, Trash2, FolderTree, X } from "lucide-react";

type BlogCategorySummary = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
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

export function BlogCategoriesManagement({ initialCategories }: { initialCategories: BlogCategorySummary[] }) {
  const [categories, setCategories] = useState<BlogCategorySummary[]>(initialCategories);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editCategory, setEditCategory] = useState<BlogCategorySummary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () =>
      categories.filter((c) =>
        `${c.name} ${c.slug} ${c.description || ""}`.toLowerCase().includes(query.toLowerCase())
      ),
    [categories, query]
  );

  const handleDelete = async (id: string) => {
    const prev = categories;
    setCategories((list) => list.filter((c) => c.id !== id));
    try {
      await jsonFetch(`/api/admin/blog-categories/${id}`, { method: "DELETE" });
      toast.success("Category deleted");
    } catch (err: any) {
      console.error(err);
      setCategories(prev);
      toast.error(err?.message || "Failed to delete category");
    }
  };

  const handleCreate = async (data: Partial<BlogCategorySummary>) => {
    setLoading(true);
    try {
      const created = await jsonFetch<BlogCategorySummary>("/api/admin/blog-categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setCategories((prev) => [created, ...prev]);
      toast.success("Category created");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<BlogCategorySummary>) => {
    setLoading(true);
    try {
      const updated = await jsonFetch<BlogCategorySummary>(`/api/admin/blog-categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      toast.success("Category updated");
      setEditCategory(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Blog Categories</h2>
          <Badge variant="secondary" className="text-xs">{categories.length}</Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            placeholder="Search categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-56 text-sm"
          />
          <Button size="sm" onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" /> <span className="text-xs sm:text-sm">Add Category</span>
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="rounded-lg sm:rounded-2xl border border-dashed border-border/60">
          <CardContent className="py-8 sm:py-10 text-center text-xs sm:text-sm text-muted-foreground">
            No categories found. Add one to get started.
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-lg sm:rounded-2xl border border-border shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px] sm:w-[200px]">Name</TableHead>
                  <TableHead className="min-w-[100px]">Slug</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium text-sm">{category.name}</TableCell>
                    <TableCell>
                      <code className="text-[10px] sm:text-xs bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                        /{category.slug}
                      </code>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm text-muted-foreground">
                      {category.description || (
                        <span className="text-muted-foreground/50 italic">No description</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => setEditCategory(category)}
                        >
                          <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setConfirmDeleteId(category.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create modal */}
      <CategoryModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={loading}
        title="Add Category"
        icon={<FolderTree className="h-4 w-4" />}
      />

      {/* Edit modal */}
      <CategoryModal
        open={!!editCategory}
        onClose={() => setEditCategory(null)}
        onSubmit={(data) => {
          if (editCategory) {
            return handleUpdate(editCategory.id, data);
          }
        }}
        loading={loading}
        title="Edit Category"
        initial={editCategory || undefined}
        icon={<FolderTree className="h-4 w-4" />}
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
        title="Delete category?"
        description="This will remove the category. Make sure no blogs are using this category."
      />
    </div>
  );
}

function CategoryModal({
  open,
  onClose,
  onSubmit,
  loading,
  title,
  initial,
  icon,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BlogCategorySummary>) => Promise<void> | void;
  loading: boolean;
  title: string;
  initial?: BlogCategorySummary;
  icon?: React.ReactNode;
}) {
  const [form, setForm] = useState({
    slug: initial?.slug || "",
    name: initial?.name || "",
    description: initial?.description || "",
  });

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        slug: initial.slug || "",
        name: initial.name || "",
        description: initial.description || "",
      });
    } else {
      setForm({
        slug: "",
        name: "",
        description: "",
      });
    }
  }, [open, initial]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setForm((f) => ({ ...f, name: newName }));
    if (!initial) {
      setForm((f) => ({ ...f, slug: generateSlug(newName) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Name and slug are required.");
      return;
    }

    try {
      await onSubmit({
        slug: form.slug,
        name: form.name,
        description: form.description || null,
      });
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
      description="Manage blog category details."
      icon={icon}
    >
      <form key={initial?.id || "new"} onSubmit={handleSubmit} className="space-y-6 text-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={handleNameChange}
                placeholder="AI & Automation"
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
                placeholder="ai-automation"
                disabled={!initial}
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated for new categories. URL-friendly identifier.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="min-h-[80px]"
              placeholder="Brief description of this category..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Saving..." : initial ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

