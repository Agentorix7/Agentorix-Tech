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
import { Pencil, Plus, Trash2, Building2, X } from "lucide-react";
import { FileUploadField } from "@/components/admin/file-upload-field";
import Image from "next/image";

type IndustrySummary = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  services: any; // JSON: { painPoints: string[], solutions: string[], caseStudy: { title: string, result: string, description: string } }
  displayOrder: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type IndustryFormState = {
  slug: string;
  name: string;
  description: string;
  image: string;
  painPoints: string[];
  solutions: string[];
  caseStudy: {
    title: string;
    result: string;
    description: string;
  };
  displayOrder: number | null;
  isActive: boolean;
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

function parseServices(services: any): {
  painPoints: string[];
  solutions: string[];
  caseStudy: { title: string; result: string; description: string };
} {
  if (!services || typeof services !== "object") {
    return {
      painPoints: [],
      solutions: [],
      caseStudy: { title: "", result: "", description: "" },
    };
  }
  return {
    painPoints: Array.isArray(services.painPoints) ? services.painPoints : [],
    solutions: Array.isArray(services.solutions) ? services.solutions : [],
    caseStudy: services.caseStudy && typeof services.caseStudy === "object"
      ? {
          title: services.caseStudy.title || "",
          result: services.caseStudy.result || "",
          description: services.caseStudy.description || "",
        }
      : { title: "", result: "", description: "" },
  };
}

export function IndustriesManagement({ initialIndustries }: { initialIndustries: IndustrySummary[] }) {
  const [industries, setIndustries] = useState<IndustrySummary[]>(initialIndustries);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editIndustry, setEditIndustry] = useState<IndustrySummary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () =>
      industries.filter((i) =>
        `${i.name} ${i.slug} ${i.description || ""}`.toLowerCase().includes(query.toLowerCase())
      ),
    [industries, query]
  );

  const handleDelete = async (id: string) => {
    const prev = industries;
    setIndustries((list) => list.filter((i) => i.id !== id));
    try {
      await jsonFetch(`/api/admin/industries/${id}`, { method: "DELETE" });
      toast.success("Industry deleted");
    } catch (err) {
      console.error(err);
      setIndustries(prev);
      toast.error("Failed to delete industry");
    }
  };

  const handleCreate = async (data: Partial<IndustrySummary>) => {
    setLoading(true);
    try {
      const created = await jsonFetch<IndustrySummary>("/api/admin/industries", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setIndustries((prev) => [created, ...prev]);
      toast.success("Industry created");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create industry");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<IndustrySummary>) => {
    setLoading(true);
    try {
      const updated = await jsonFetch<IndustrySummary>(`/api/admin/industries/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setIndustries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      toast.success("Industry updated");
      setEditIndustry(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update industry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Industries</h2>
          <Badge variant="secondary" className="text-xs">{industries.length}</Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            placeholder="Search industries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-56 text-sm"
          />
          <Button size="sm" onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" /> <span className="text-xs sm:text-sm">Add Industry</span>
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="rounded-lg sm:rounded-2xl border border-dashed border-border/60">
          <CardContent className="py-8 sm:py-10 text-center text-xs sm:text-sm text-muted-foreground">
            No industries found. Add one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((industry) => (
            <Card
              key={industry.id}
              className="group relative p-0 m-0 gap-0 overflow-hidden rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
            >
              {industry.image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={industry.image}
                    alt={industry.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 truncate">{industry.name}</h3>
                    {industry.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {industry.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {industry.isActive ? (
                      <Badge variant="default" className="text-[10px] sm:text-xs">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">Inactive</Badge>
                    )}
                    {industry.displayOrder !== null && (
                      <Badge variant="outline" className="text-[10px] sm:text-xs">
                        Order: {industry.displayOrder}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      onClick={() => setEditIndustry(industry)}
                    >
                      <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-600"
                      onClick={() => setConfirmDeleteId(industry.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create modal */}
      <IndustryModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={loading}
        title="Add Industry"
        icon={<Building2 className="h-4 w-4" />}
      />

      {/* Edit modal */}
      <IndustryModal
        open={!!editIndustry}
        onClose={() => setEditIndustry(null)}
        onSubmit={(data) => {
          if (editIndustry) {
            return handleUpdate(editIndustry.id, data);
          }
        }}
        loading={loading}
        title="Edit Industry"
        initial={editIndustry || undefined}
        icon={<Building2 className="h-4 w-4" />}
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
        title="Delete industry?"
        description="This will remove the industry from the site."
      />
    </div>
  );
}

function IndustryModal({
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
  onSubmit: (data: Partial<IndustrySummary>) => Promise<void> | void;
  loading: boolean;
  title: string;
  initial?: IndustrySummary;
  icon?: React.ReactNode;
}) {
  const servicesData = initial ? parseServices(initial.services) : {
    painPoints: [],
    solutions: [],
    caseStudy: { title: "", result: "", description: "" },
  };

  const [form, setForm] = useState<IndustryFormState>(() => {
    if (initial) {
      return {
        slug: initial.slug || "",
        name: initial.name || "",
        description: initial.description || "",
        image: initial.image || "",
        painPoints: servicesData.painPoints,
        solutions: servicesData.solutions,
        caseStudy: servicesData.caseStudy,
        displayOrder: initial.displayOrder ?? null,
        isActive: initial.isActive ?? true,
      };
    }
    return {
      slug: "",
      name: "",
      description: "",
      image: "",
      painPoints: [],
      solutions: [],
      caseStudy: { title: "", result: "", description: "" },
      displayOrder: null,
      isActive: true,
    };
  });

  useEffect(() => {
    if (!open) return;

    if (initial) {
      const servicesData = parseServices(initial.services);
      setForm({
        slug: initial.slug || "",
        name: initial.name || "",
        description: initial.description || "",
        image: initial.image || "",
        painPoints: servicesData.painPoints,
        solutions: servicesData.solutions,
        caseStudy: servicesData.caseStudy,
        displayOrder: initial.displayOrder ?? null,
        isActive: initial.isActive ?? true,
      });
    } else {
      setForm({
        slug: "",
        name: "",
        description: "",
        image: "",
        painPoints: [],
        solutions: [],
        caseStudy: { title: "", result: "", description: "" },
        displayOrder: null,
        isActive: true,
      });
    }
  }, [open, initial]);

  const [uploadingImage, setUploadingImage] = useState(false);

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
    if (uploadingImage) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    if (!form.name || !form.slug) {
      toast.error("Name and slug are required.");
      return;
    }

    try {
      const payload: any = {
        slug: form.slug,
        name: form.name,
        description: form.description || null,
        image: form.image || null,
        services: {
          painPoints: form.painPoints.filter((p) => p.trim() !== ""),
          solutions: form.solutions.filter((s) => s.trim() !== ""),
          caseStudy: form.caseStudy,
        },
        displayOrder: form.displayOrder === null ? null : Number(form.displayOrder),
        isActive: form.isActive,
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
      description="Manage industry details and services."
      icon={icon}
      imageSrc={form.image || undefined}
    >
      <form key={initial?.id || "new"} onSubmit={handleSubmit} className="space-y-6 text-sm">
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
                onChange={handleNameChange}
                placeholder="E-commerce"
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
                placeholder="e-commerce"
                disabled={!initial}
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated for new industries. URL-friendly identifier.
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
              placeholder="Brief description of this industry..."
            />
          </div>

          <FileUploadField
            label="Industry Image"
            description="Upload an image for this industry."
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            uploadUrl="/api/admin/uploads/portfolio-image"
            onUploadingChange={setUploadingImage}
          />
        </div>

        {/* Pain Points */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Pain Points</h3>
          <p className="text-xs text-muted-foreground">
            List common pain points for this industry.
          </p>
          {form.painPoints.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={point}
                onChange={(e) => {
                  const newPoints = [...form.painPoints];
                  newPoints[index] = e.target.value;
                  setForm((f) => ({ ...f, painPoints: newPoints }));
                }}
                placeholder="Pain point description"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newPoints = [...form.painPoints];
                  newPoints.splice(index, 1);
                  setForm((f) => ({ ...f, painPoints: newPoints }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setForm((f) => ({ ...f, painPoints: [...f.painPoints, ""] }))}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Pain Point
          </Button>
        </div>

        {/* Solutions */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Solutions</h3>
          <p className="text-xs text-muted-foreground">
            List solutions we provide for this industry.
          </p>
          {form.solutions.map((solution, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={solution}
                onChange={(e) => {
                  const newSolutions = [...form.solutions];
                  newSolutions[index] = e.target.value;
                  setForm((f) => ({ ...f, solutions: newSolutions }));
                }}
                placeholder="Solution description"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newSolutions = [...form.solutions];
                  newSolutions.splice(index, 1);
                  setForm((f) => ({ ...f, solutions: newSolutions }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setForm((f) => ({ ...f, solutions: [...f.solutions, ""] }))}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Solution
          </Button>
        </div>

        {/* Case Study */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Case Study</h3>
          <div className="space-y-1.5">
            <Label htmlFor="caseStudyTitle">Case Study Title</Label>
            <Input
              id="caseStudyTitle"
              value={form.caseStudy.title}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  caseStudy: { ...f.caseStudy, title: e.target.value },
                }))
              }
              placeholder="ABC Inc. E-commerce Platform"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="caseStudyResult">Result</Label>
            <Input
              id="caseStudyResult"
              value={form.caseStudy.result}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  caseStudy: { ...f.caseStudy, result: e.target.value },
                }))
              }
              placeholder="250% revenue increase in 6 months"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="caseStudyDescription">Description</Label>
            <Textarea
              id="caseStudyDescription"
              value={form.caseStudy.description}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  caseStudy: { ...f.caseStudy, description: e.target.value },
                }))
              }
              className="min-h-[80px]"
              placeholder="Complete platform redesign with AI recommendations..."
            />
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
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
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
            {loading ? "Saving..." : initial ? "Update Industry" : "Create Industry"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

