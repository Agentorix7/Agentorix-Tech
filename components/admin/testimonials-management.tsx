"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AdminModal } from "@/components/admin/admin-modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pencil, Plus, Trash2, MessageSquare, Star, X } from "lucide-react";
import { FileUploadField } from "@/components/admin/file-upload-field";
import Image from "next/image";

type TestimonialSummary = {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  portfolioId: string | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

type TestimonialFormState = {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  portfolioId: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number | null;
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

export function TestimonialsManagement({ initialTestimonials }: { initialTestimonials: TestimonialSummary[] }) {
  const [testimonials, setTestimonials] = useState<TestimonialSummary[]>(initialTestimonials);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<TestimonialSummary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () =>
      testimonials.filter((t) =>
        `${t.name} ${t.role} ${t.company} ${t.content}`.toLowerCase().includes(query.toLowerCase())
      ),
    [testimonials, query]
  );

  const handleDelete = async (id: string) => {
    const prev = testimonials;
    setTestimonials((list) => list.filter((t) => t.id !== id));
    try {
      await jsonFetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      toast.success("Testimonial deleted");
    } catch (err) {
      console.error(err);
      setTestimonials(prev);
      toast.error("Failed to delete testimonial");
    }
  };

  const handleCreate = async (data: Partial<TestimonialSummary>) => {
    setLoading(true);
    try {
      const created = await jsonFetch<TestimonialSummary>("/api/admin/testimonials", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setTestimonials((prev) => [created, ...prev]);
      toast.success("Testimonial created");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<TestimonialSummary>) => {
    setLoading(true);
    try {
      const updated = await jsonFetch<TestimonialSummary>(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toast.success("Testimonial updated");
      setEditTestimonial(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Testimonials</h2>
          <Badge variant="secondary" className="text-xs">{testimonials.length}</Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            placeholder="Search testimonials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-56 text-sm"
          />
          <Button size="sm" onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" /> <span className="text-xs sm:text-sm">Add Testimonial</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                    <Image
                      src={testimonial.image || "/icon.png"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
                      {testimonial.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                      {testimonial.role}
                    </p>
                    <p className="text-[10px] sm:text-xs text-primary font-medium truncate">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditTestimonial(testimonial)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:text-red-600"
                    onClick={() => setConfirmDeleteId(testimonial.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                      i < testimonial.rating
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-4 border-t border-border">
                {testimonial.isFeatured && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    Featured
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={testimonial.isActive ? "text-emerald-600 border-emerald-200" : "text-amber-600 border-amber-200"}
                >
                  {testimonial.isActive ? "Active" : "Inactive"}
                </Badge>
                {testimonial.displayOrder !== null && (
                  <Badge variant="outline" className="text-neutral-600 border-neutral-200">
                    Order: {testimonial.displayOrder}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="rounded-lg sm:rounded-2xl border border-dashed border-border/60 col-span-full">
            <CardContent className="py-8 sm:py-10 text-center text-xs sm:text-sm text-muted-foreground">
              No testimonials found. Add one to get started.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create modal */}
      <TestimonialModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={loading}
        title="Add Testimonial"
        icon={<MessageSquare className="h-4 w-4" />}
      />

      {/* Edit modal */}
      <TestimonialModal
        open={!!editTestimonial}
        onClose={() => setEditTestimonial(null)}
        onSubmit={(data) => {
          if (editTestimonial) {
            return handleUpdate(editTestimonial.id, data);
          }
        }}
        loading={loading}
        title="Edit Testimonial"
        initial={editTestimonial || undefined}
        icon={<MessageSquare className="h-4 w-4" />}
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
        title="Delete testimonial?"
        description="This will remove the testimonial from the site."
      />
    </div>
  );
}

function TestimonialModal({
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
  onSubmit: (data: Partial<TestimonialSummary>) => Promise<void> | void;
  loading: boolean;
  title: string;
  initial?: TestimonialSummary;
  icon?: React.ReactNode;
}) {
  const [form, setForm] = useState<TestimonialFormState>(() => ({
    name: initial?.name || "",
    role: initial?.role || "",
    company: initial?.company || "",
    image: initial?.image || "",
    content: initial?.content || "",
    rating: initial?.rating || 5,
    portfolioId: initial?.portfolioId || "",
    isFeatured: initial?.isFeatured ?? false,
    isActive: initial?.isActive ?? true,
    displayOrder: initial?.displayOrder ?? null,
  }));

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        role: initial.role || "",
        company: initial.company || "",
        image: initial.image || "",
        content: initial.content || "",
        rating: initial.rating || 5,
        portfolioId: initial.portfolioId || "",
        isFeatured: initial.isFeatured ?? false,
        isActive: initial.isActive ?? true,
        displayOrder: initial.displayOrder ?? null,
      });
    } else {
      setForm({
        name: "",
        role: "",
        company: "",
        image: "",
        content: "",
        rating: 5,
        portfolioId: "",
        isFeatured: false,
        isActive: true,
        displayOrder: null,
      });
    }
  }, [initial]);

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    if (!form.name || !form.role || !form.company || !form.content) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (form.rating < 1 || form.rating > 5) {
      toast.error("Rating must be between 1 and 5.");
      return;
    }

    try {
      const payload: any = {
        name: form.name,
        role: form.role,
        company: form.company,
        image: form.image,
        content: form.content,
        rating: Number(form.rating),
        portfolioId: form.portfolioId || null,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        displayOrder: form.displayOrder === null ? null : Number(form.displayOrder),
      };

      await onSubmit(payload);
    } catch (err: any) {
      toast.error(err?.message || "Invalid input");
    }
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      description="Manage testimonial details and settings."
      icon={icon}
      imageSrc={form.image}
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Sarah Johnson"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="role"
                required
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="CEO, TechStart Inc."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company">
              Company <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company"
              required
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              placeholder="E-commerce Platform"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">
              Testimonial Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              required
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="min-h-[100px]"
              placeholder={`${process.env.NEXT_PUBLIC_SITE_NAME} transformed our digital presence completely...`}
            />
          </div>
        </div>

        {/* Media & Rating */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Media & Rating</h3>
          <FileUploadField
            label="Profile Image"
            description="Upload a profile image for the testimonial author."
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            uploadUrl="/api/admin/uploads/team-member"
            onUploadingChange={setUploadingImage}
          />

          <div className="space-y-1.5">
            <Label htmlFor="rating">
              Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating }))}
                  className={`p-2 rounded-lg border transition-colors ${
                    form.rating >= rating
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      form.rating >= rating ? "fill-primary text-primary" : ""
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {form.rating} / 5
              </span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={form.displayOrder ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    displayOrder: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
                placeholder="Optional number (e.g., 1, 2, 3...)"
              />
            </div>
            <div className="flex items-center justify-between gap-4 pt-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="isFeatured"
                  checked={form.isFeatured}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, isFeatured: checked }))
                  }
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  Featured
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, isActive: checked }))
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading || uploadingImage}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading || uploadingImage}>
            {loading ? "Saving..." : initial ? "Update Testimonial" : "Create Testimonial"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

