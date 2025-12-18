"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AdminModal } from "@/components/admin/admin-modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pencil, Plus, Trash2, Settings, X, PlusCircle } from "lucide-react";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { IconPicker } from "@/components/admin/icon-picker";
import { ServiceCard } from "@/components/ui/service-card";

type ServiceSummary = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  image: string;
  icon: string;
  isMainService: boolean;
  isActive: boolean;
  displayOrder: number | null;
  sections?: any;
  features?: any;
  benefits?: any;
  useCases?: any;
  caseStudies?: any;
  pricing?: any;
  cta?: any;
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

export function ServicesManagement({ initialServices }: { initialServices: ServiceSummary[] }) {
  const [services, setServices] = useState<ServiceSummary[]>(initialServices);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editService, setEditService] = useState<ServiceSummary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () =>
      services.filter((s) =>
        `${s.title} ${s.slug} ${s.shortDescription}`.toLowerCase().includes(query.toLowerCase())
      ),
    [services, query]
  );

  const handleDelete = async (id: string) => {
    const prev = services;
    setServices((list) => list.filter((s) => s.id !== id));
    try {
      await jsonFetch(`/api/admin/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
    } catch (err) {
      console.error(err);
      setServices(prev);
      toast.error("Failed to delete service");
    }
  };

  const handleCreate = async (data: Partial<ServiceSummary>) => {
    setLoading(true);
    try {
      const created = await jsonFetch<ServiceSummary>("/api/admin/services", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setServices((prev) => [created, ...prev]);
      toast.success("Service created");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<ServiceSummary>) => {
    setLoading(true);
    try {
      const updated = await jsonFetch<ServiceSummary>(`/api/admin/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      toast.success("Service updated");
      setEditService(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Services</h2>
          <Badge variant="secondary" className="text-xs">{services.length}</Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            placeholder="Search services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-56 text-sm"
          />
          <Button size="sm" onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" /> <span className="text-xs sm:text-sm">Add service</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.shortDescription}
            image={service.image}
            icon={service.icon}
            slug={service.slug}
            adminMode={true}
            onEdit={() => setEditService(service)}
            onDelete={() => setConfirmDeleteId(service.id)}
          />
        ))}

        {filtered.length === 0 && (
          <Card className="rounded-lg sm:rounded-2xl border border-dashed border-border/60 col-span-full">
            <CardContent className="py-8 sm:py-10 text-center text-xs sm:text-sm text-muted-foreground">
              No services found. Add one to get started.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create modal */}
      <ServiceModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={loading}
        title="Add service"
        icon={<Settings className="h-4 w-4" />}
      />

      {/* Edit modal */}
      <ServiceModal
        open={!!editService}
        onClose={() => setEditService(null)}
        onSubmit={(data) => {
          if (editService) {
            return handleUpdate(editService.id, data);
          }
        }}
        loading={loading}
        title="Edit service"
        initial={editService || undefined}
        icon={<Settings className="h-4 w-4" />}
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
        title="Delete service?"
        description="This will remove the service from the site."
      />
    </div>
  );
}

type Section = { title: string; content: string; items: string[] };
type CaseStudy = { title: string; description: string; results: string[] };
type Pricing = { title: string; description: string };

function ServiceModal({
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
  onSubmit: (data: Partial<ServiceSummary>) => Promise<void> | void;
  loading: boolean;
  title: string;
  initial?: ServiceSummary;
  icon?: React.ReactNode;
}) {
  // Parse initial data
  const parseArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return [];
  };

  const parseSections = (val: any): Section[] => {
    if (!val || !Array.isArray(val)) return [];
    return val.map((s: any) => ({
      title: s.title || "",
      content: s.content || "",
      items: Array.isArray(s.items) ? s.items : [],
    }));
  };

  const parseCaseStudies = (val: any): CaseStudy[] => {
    if (!val || !Array.isArray(val)) return [];
    return val.map((cs: any) => ({
      title: cs.title || "",
      description: cs.description || "",
      results: Array.isArray(cs.results) ? cs.results : [],
    }));
  };

  const parsePricing = (val: any): Pricing | null => {
    if (!val || typeof val !== "object") return null;
    return {
      title: val.title || "",
      description: val.description || "",
    };
  };

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  const [form, setForm] = useState({
    slug: initial?.slug || "",
    title: initial?.title || "",
    shortDescription: initial?.shortDescription || "",
    overview: initial?.overview || "",
    image: initial?.image || "",
    icon: initial?.icon || "",
    displayOrder: initial?.displayOrder ?? null,
    isMainService: initial?.isMainService ?? false,
    isActive: initial?.isActive ?? true,
    sections: parseSections(initial?.sections),
    features: parseArray(initial?.features),
    benefits: parseArray(initial?.benefits),
    useCases: parseArray(initial?.useCases),
    caseStudies: parseCaseStudies(initial?.caseStudies),
    pricing: parsePricing(initial?.pricing),
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Update form when initial changes (for edit mode)
  useEffect(() => {
    if (initial) {
      setForm({
        slug: initial.slug || "",
        title: initial.title || "",
        shortDescription: initial.shortDescription || "",
        overview: initial.overview || "",
        image: initial.image || "",
        icon: initial.icon || "",
        displayOrder: initial.displayOrder ?? null,
        isMainService: initial.isMainService ?? false,
        isActive: initial.isActive ?? true,
        sections: parseSections(initial.sections),
        features: parseArray(initial.features),
        benefits: parseArray(initial.benefits),
        useCases: parseArray(initial.useCases),
        caseStudies: parseCaseStudies(initial.caseStudies),
        pricing: parsePricing(initial.pricing),
      });
    } else {
      // Reset form for create mode
      setForm({
        slug: "",
        title: "",
        shortDescription: "",
        overview: "",
        image: "",
        icon: "",
        displayOrder: null,
        isMainService: false,
        isActive: true,
        sections: [],
        features: [],
        benefits: [],
        useCases: [],
        caseStudies: [],
        pricing: null,
      });
    }
  }, [initial]);

  // Auto-generate slug from title (only when creating new service)
  useEffect(() => {
    if (!initial && form.title) {
      const newSlug = generateSlug(form.title);
      setForm((f) => ({ ...f, slug: newSlug }));
    }
  }, [form.title, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        slug: form.slug,
        title: form.title,
        shortDescription: form.shortDescription,
        overview: form.overview,
        image: form.image,
        icon: form.icon,
        displayOrder: form.displayOrder === null || form.displayOrder === undefined ? null : Number(form.displayOrder),
        isMainService: form.isMainService,
        isActive: form.isActive,
      };

      // Convert structured data to JSON
      payload.sections = form.sections.length > 0 ? form.sections : null;
      payload.features = form.features.length > 0 ? form.features : null;
      payload.benefits = form.benefits.length > 0 ? form.benefits : null;
      payload.useCases = form.useCases.length > 0 ? form.useCases : null;
      payload.caseStudies = form.caseStudies.length > 0 ? form.caseStudies : null;
      payload.pricing = form.pricing ? form.pricing : null;

      await onSubmit(payload);
    } catch (err: any) {
      toast.error(err?.message || "Invalid input");
    }
  };

  // Helper functions for dynamic arrays
  const addSection = () => {
    setForm((f) => ({
      ...f,
      sections: [...f.sections, { title: "", content: "", items: [] }],
    }));
  };

  const updateSection = (index: number, field: keyof Section, value: string | string[]) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const removeSection = (index: number) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.filter((_, i) => i !== index),
    }));
  };

  const addSectionItem = (sectionIndex: number) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s, i) =>
        i === sectionIndex ? { ...s, items: [...s.items, ""] } : s
      ),
    }));
  };

  const updateSectionItem = (sectionIndex: number, itemIndex: number, value: string) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s, i) =>
        i === sectionIndex
          ? { ...s, items: s.items.map((item, idx) => (idx === itemIndex ? value : item)) }
          : s
      ),
    }));
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s, i) =>
        i === sectionIndex ? { ...s, items: s.items.filter((_, idx) => idx !== itemIndex) } : s
      ),
    }));
  };

  const addArrayItem = (field: "features" | "benefits" | "useCases") => {
    setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  };

  const updateArrayItem = (field: "features" | "benefits" | "useCases", index: number, value: string) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeArrayItem = (field: "features" | "benefits" | "useCases", index: number) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].filter((_, i) => i !== index),
    }));
  };

  const addCaseStudy = () => {
    setForm((f) => ({
      ...f,
      caseStudies: [...f.caseStudies, { title: "", description: "", results: [] }],
    }));
  };

  const updateCaseStudy = (index: number, field: keyof CaseStudy, value: string | string[]) => {
    setForm((f) => ({
      ...f,
      caseStudies: f.caseStudies.map((cs, i) =>
        i === index ? { ...cs, [field]: value } : cs
      ),
    }));
  };

  const removeCaseStudy = (index: number) => {
    setForm((f) => ({
      ...f,
      caseStudies: f.caseStudies.filter((_, i) => i !== index),
    }));
  };

  const addCaseStudyResult = (caseStudyIndex: number) => {
    setForm((f) => ({
      ...f,
      caseStudies: f.caseStudies.map((cs, i) =>
        i === caseStudyIndex ? { ...cs, results: [...cs.results, ""] } : cs
      ),
    }));
  };

  const updateCaseStudyResult = (caseStudyIndex: number, resultIndex: number, value: string) => {
    setForm((f) => ({
      ...f,
      caseStudies: f.caseStudies.map((cs, i) =>
        i === caseStudyIndex
          ? { ...cs, results: cs.results.map((r, idx) => (idx === resultIndex ? value : r)) }
          : cs
      ),
    }));
  };

  const removeCaseStudyResult = (caseStudyIndex: number, resultIndex: number) => {
    setForm((f) => ({
      ...f,
      caseStudies: f.caseStudies.map((cs, i) =>
        i === caseStudyIndex ? { ...cs, results: cs.results.filter((_, idx) => idx !== resultIndex) } : cs
      ),
    }));
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      description="Manage service details and structured content."
      icon={icon}
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                required
                value={form.slug}
                disabled={!initial} // Disable when creating new (auto-generated)
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="ai-consulting"
                className={!initial ? "bg-muted cursor-not-allowed" : ""}
              />
              <p className="text-xs text-muted-foreground">
                {initial
                  ? "URL-friendly identifier (can be edited)"
                  : "Auto-generated from title (lowercase, hyphens only)"}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }));
                  // Auto-generate slug only when creating new service
                  if (!initial) {
                    const newSlug = generateSlug(e.target.value);
                    setForm((f) => ({ ...f, slug: newSlug }));
                  }
                }}
                placeholder="AI Consulting Services"
              />
              <p className="text-xs text-muted-foreground">
                Display name for the service {!initial && "(slug will be auto-generated)"}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="shortDescription">
              Short Description <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shortDescription"
              required
              value={form.shortDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, shortDescription: e.target.value }))
              }
              placeholder="Expert AI consulting to transform your business operations"
            />
            <p className="text-xs text-muted-foreground">
              Brief summary shown on service cards (max 150 characters)
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="overview">
              Overview <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="overview"
              required
              value={form.overview}
              onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
              className="min-h-[100px]"
              placeholder="Provide a comprehensive overview of the service, including what it offers, who it's for, and key benefits..."
            />
            <p className="text-xs text-muted-foreground">
              Detailed description of the service
            </p>
          </div>
        </div>

        {/* Media & Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadField
            label="Service Image"
            description="Upload service image to ImageKit"
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            uploadUrl="/api/admin/uploads/service-image"
            onUploadingChange={setUploadingImage}
          />
          <IconPicker
            label="Icon"
            description="Select an icon from lucide-react library"
            value={form.icon}
            onChange={(iconName) => setForm((f) => ({ ...f, icon: iconName }))}
          />
        </div>

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
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first (leave empty for default)
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 pt-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isMainService"
                checked={form.isMainService}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, isMainService: checked }))
                }
              />
              <Label htmlFor="isMainService" className="cursor-pointer">
                Main service
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

        {/* Structured Content - User-Friendly Fields */}
        <div className="space-y-6 pt-4 border-t border-border">
          <p className="text-sm font-medium">Structured Content</p>

          {/* Sections */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Sections</Label>
            </div>
            {form.sections.map((section, idx) => (
              <Card key={idx} className="p-4 space-y-3 border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Section {idx + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSection(idx)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) => updateSection(idx, "title", e.target.value)}
                />
                <Textarea
                  placeholder="Section Content"
                  value={section.content}
                  onChange={(e) => updateSection(idx, "content", e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Items</Label>
                  </div>
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex gap-2">
                      <Input
                        placeholder={`Item ${itemIdx + 1}`}
                        value={item}
                        onChange={(e) => updateSectionItem(idx, itemIdx, e.target.value)}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSectionItem(idx, itemIdx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={() => addSectionItem(idx)}>
                      <Plus className="h-3 w-3 mr-1" /> Add Item
                    </Button>
                </div>
              </Card>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addSection}>
              <PlusCircle className="h-4 w-4 mr-1" /> Add Section
            </Button>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Features</Label>
            </div>
            {form.features.map((feature, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  placeholder={`Feature ${idx + 1}`}
                  value={feature}
                  onChange={(e) => updateArrayItem("features", idx, e.target.value)}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("features", idx)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("features")}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Feature
              </Button>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Benefits</Label>
            </div>
            {form.benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  placeholder={`Benefit ${idx + 1}`}
                  value={benefit}
                  onChange={(e) => updateArrayItem("benefits", idx, e.target.value)}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("benefits", idx)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("benefits")}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Benefit
              </Button>
          </div>

          {/* Use Cases */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Use Cases</Label>
            </div>
            {form.useCases.map((useCase, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  placeholder={`Use Case ${idx + 1}`}
                  value={useCase}
                  onChange={(e) => updateArrayItem("useCases", idx, e.target.value)}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("useCases", idx)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("useCases")}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Use Case
              </Button>
          </div>

          {/* Case Studies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Case Studies</Label>
            </div>
            {form.caseStudies.map((caseStudy, idx) => (
              <Card key={idx} className="p-4 space-y-3 border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Case Study {idx + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeCaseStudy(idx)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Case Study Title"
                  value={caseStudy.title}
                  onChange={(e) => updateCaseStudy(idx, "title", e.target.value)}
                />
                <Textarea
                  placeholder="Case Study Description"
                  value={caseStudy.description}
                  onChange={(e) => updateCaseStudy(idx, "description", e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Results</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={() => addCaseStudyResult(idx)}>
                      <Plus className="h-3 w-3 mr-1" /> Add Result
                    </Button>
                  </div>
                  {caseStudy.results.map((result, resultIdx) => (
                    <div key={resultIdx} className="flex gap-2">
                      <Input
                        placeholder={`Result ${resultIdx + 1}`}
                        value={result}
                        onChange={(e) => updateCaseStudyResult(idx, resultIdx, e.target.value)}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeCaseStudyResult(idx, resultIdx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addCaseStudy}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Case Study
              </Button>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <Label>Pricing</Label>
            <Input
              placeholder="Pricing Title"
              value={form.pricing?.title || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  pricing: { ...(f.pricing || { title: "", description: "" }), title: e.target.value },
                }))
              }
            />
            <Textarea
              placeholder="Pricing Description"
              value={form.pricing?.description || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  pricing: { ...(f.pricing || { title: "", description: "" }), description: e.target.value },
                }))
              }
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading || uploadingImage}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading || uploadingImage}>
            {loading ? "Saving..." : initial ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

