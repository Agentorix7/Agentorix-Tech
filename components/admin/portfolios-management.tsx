"use client";

import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AdminModal } from "@/components/admin/admin-modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Plus, FolderGit2, X } from "lucide-react";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { IconPicker } from "@/components/admin/icon-picker";
import { PortfolioCard } from "@/components/ui/portfolio-card";

type PortfolioSummary = {
  id: string;
  slug: string;
  title: string;
  category: string;
  type: string | null;
  image: string;
  description: string;
  link: string | null;
  client: string | null;
  metrics: any;
  before: any;
  after: any;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

type Metric = {
  label: string;
  value: string;
  icon: string;
};

type BeforeAfterItem = {
  key: string;
  value: string;
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

export function PortfoliosManagement({ initialPortfolios }: { initialPortfolios: PortfolioSummary[] }) {
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>(initialPortfolios);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editPortfolio, setEditPortfolio] = useState<PortfolioSummary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () =>
      portfolios.filter((p) =>
        `${p.title} ${p.slug} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase())
      ),
    [portfolios, query]
  );

  const handleDelete = async (id: string) => {
    const prev = portfolios;
    setPortfolios((list) => list.filter((p) => p.id !== id));
    try {
      await jsonFetch(`/api/admin/portfolios/${id}`, { method: "DELETE" });
      toast.success("Portfolio deleted");
    } catch (err) {
      console.error(err);
      setPortfolios(prev);
      toast.error("Failed to delete portfolio");
    }
  };

  const handleCreate = async (data: Partial<PortfolioSummary>) => {
    setLoading(true);
    try {
      const created = await jsonFetch<PortfolioSummary>("/api/admin/portfolios", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setPortfolios((prev) => [created, ...prev]);
      toast.success("Portfolio created");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<PortfolioSummary>) => {
    setLoading(true);
    try {
      const updated = await jsonFetch<PortfolioSummary>(`/api/admin/portfolios/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setPortfolios((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success("Portfolio updated");
      setEditPortfolio(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Portfolios</h2>
          <Badge variant="secondary" className="text-xs">{portfolios.length}</Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            placeholder="Search portfolios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-56 text-sm"
          />
          <Button size="sm" onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" /> <span className="text-xs sm:text-sm">Add Portfolio</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((portfolio) => (
          <PortfolioCard
            key={portfolio.id}
            title={portfolio.title}
            category={portfolio.category}
            type={portfolio.type}
            image={portfolio.image}
            description={portfolio.description}
            slug={portfolio.slug}
            metrics={portfolio.metrics as any}
            before={portfolio.before as any}
            after={portfolio.after as any}
            link={portfolio.link}
            adminMode={true}
            onEdit={() => setEditPortfolio(portfolio)}
            onDelete={() => setConfirmDeleteId(portfolio.id)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-lg sm:rounded-2xl border border-dashed border-border/60 py-8 sm:py-10 text-center text-xs sm:text-sm text-muted-foreground">
            No portfolios found. Add one to get started.
          </div>
        )}
      </div>

      {/* Create modal */}
      <PortfolioModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={loading}
        title="Add Portfolio"
        icon={<FolderGit2 className="h-4 w-4" />}
      />

      {/* Edit modal */}
      <PortfolioModal
        open={!!editPortfolio}
        onClose={() => setEditPortfolio(null)}
        onSubmit={(data) => {
          if (editPortfolio) {
            return handleUpdate(editPortfolio.id, data);
          }
        }}
        loading={loading}
        title="Edit Portfolio"
        initial={editPortfolio || undefined}
        icon={<FolderGit2 className="h-4 w-4" />}
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
        title="Delete portfolio?"
        description="This will remove the portfolio from the site."
      />
    </div>
  );
}

function PortfolioModal({
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
  onSubmit: (data: Partial<PortfolioSummary>) => Promise<void> | void;
  loading: boolean;
  title: string;
  initial?: PortfolioSummary;
  icon?: React.ReactNode;
}) {
  const parseMetrics = (metrics: any): Metric | null => {
    if (!metrics) return null;
    if (typeof metrics === 'object' && metrics.label && metrics.value && metrics.icon) {
      return metrics as Metric;
    }
    return null;
  };

  const parseBeforeAfter = (data: any): BeforeAfterItem[] => {
    if (!data || typeof data !== 'object') return [];
    return Object.entries(data).map(([key, value]) => ({
      key,
      value: String(value),
    }));
  };

  const formatBeforeAfter = (items: BeforeAfterItem[]): Record<string, string> => {
    const result: Record<string, string> = {};
    items.forEach((item) => {
      if (item.key && item.value) {
        result[item.key] = item.value;
      }
    });
    return result;
  };

  const [form, setForm] = useState({
    slug: initial?.slug || "",
    title: initial?.title || "",
    category: initial?.category || "",
    type: initial?.type || "",
    image: initial?.image || "",
    description: initial?.description || "",
    link: initial?.link || "",
    client: initial?.client || "",
    metrics: parseMetrics(initial?.metrics),
    before: parseBeforeAfter(initial?.before),
    after: parseBeforeAfter(initial?.after),
    isFeatured: initial?.isFeatured ?? false,
    isActive: initial?.isActive ?? true,
    displayOrder: initial?.displayOrder ?? null,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        slug: initial.slug || "",
        title: initial.title || "",
        category: initial.category || "",
        type: initial.type || "",
        image: initial.image || "",
        description: initial.description || "",
        link: initial.link || "",
        client: initial.client || "",
        metrics: parseMetrics(initial.metrics),
        before: parseBeforeAfter(initial.before),
        after: parseBeforeAfter(initial.after),
        isFeatured: initial.isFeatured ?? false,
        isActive: initial.isActive ?? true,
        displayOrder: initial.displayOrder ?? null,
      });
    } else {
      setForm({
        slug: "",
        title: "",
        category: "",
        type: "",
        image: "",
        description: "",
        link: "",
        client: "",
        metrics: null,
        before: [],
        after: [],
        isFeatured: false,
        isActive: true,
        displayOrder: null,
      });
    }
  }, [initial]);

  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    try {
      const payload: any = {
        slug: form.slug,
        title: form.title,
        category: form.category,
        type: form.type || null,
        image: form.image,
        description: form.description,
        link: form.link || null,
        client: form.client || null,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        displayOrder: form.displayOrder === null ? null : Number(form.displayOrder),
      };

      payload.metrics = form.metrics ? form.metrics : null;
      payload.before = form.before.length > 0 ? formatBeforeAfter(form.before) : null;
      payload.after = form.after.length > 0 ? formatBeforeAfter(form.after) : null;

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
      description="Manage portfolio project details."
      icon={icon}
      imageSrc={form.image}
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
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
                placeholder="E-commerce Platform Transformation"
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
                placeholder="ecommerce-platform-transformation"
                disabled={!initial}
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier. Auto-generated for new portfolios.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                required
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="IT Projects"
              />
              <p className="text-xs text-muted-foreground">
                e.g., IT Projects, Marketing Campaigns, AI & Automation
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="type">
                Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="type"
                required
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                placeholder="Web Development"
              />
              <p className="text-xs text-muted-foreground">
                Shown as badge on portfolio card (e.g., Web Development, AI Solutions)
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client">Client Name</Label>
            <Input
              id="client"
              value={form.client}
              onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
              placeholder="ABC Inc."
            />
            <p className="text-xs text-muted-foreground">
              Name of the client for this project (optional)
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="min-h-[100px]"
              placeholder="Complete platform redesign with AI-powered recommendations..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link">Project Link (Optional)</Label>
            <Input
              id="link"
              type="url"
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Media & Settings</h3>
          <FileUploadField
            label="Portfolio Image"
            description="Upload an image for this portfolio project."
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            uploadUrl="/api/admin/uploads/portfolio-image"
            onUploadingChange={setUploadingImage}
          />

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
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, isFeatured: checked }))}
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  Featured
                </Label>
              </div>
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

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Key Metric</h3>
          <p className="text-xs text-muted-foreground">
            Add the main metric to showcase project results (e.g., Revenue Increase: 250%).
          </p>
          <Card className="p-4 space-y-3 border-border/60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Label</Label>
                <Input
                  value={form.metrics?.label || ""}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      metrics: {
                        label: e.target.value,
                        value: f.metrics?.value || "",
                        icon: f.metrics?.icon || "",
                      },
                    }));
                  }}
                  placeholder="Revenue Increase"
                />
              </div>
              <div className="space-y-1">
                <Label>Value</Label>
                <Input
                  value={form.metrics?.value || ""}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      metrics: {
                        label: f.metrics?.label || "",
                        value: e.target.value,
                        icon: f.metrics?.icon || "",
                      },
                    }));
                  }}
                  placeholder="250%"
                />
              </div>
            </div>
            <div className="space-y-1">
              <IconPicker
                label="Icon"
                description="Select a Lucide icon for this metric."
                value={form.metrics?.icon || ""}
                onChange={(iconName) => {
                  setForm((f) => ({
                    ...f,
                    metrics: {
                      label: f.metrics?.label || "",
                      value: f.metrics?.value || "",
                      icon: iconName,
                    },
                  }));
                }}
              />
            </div>
            {form.metrics && (form.metrics.label || form.metrics.value || form.metrics.icon) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setForm((f) => ({ ...f, metrics: null }))}
              >
                <X className="h-4 w-4 mr-1" /> Clear Metric
              </Button>
            )}
          </Card>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-base font-semibold text-foreground">Before & After Metrics</h3>
          <p className="text-xs text-muted-foreground">
            Add before and after metrics to showcase project improvements (e.g., revenue: $500K → $1.75M).
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-red-600">Before</h4>
              {form.before.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item.key}
                    onChange={(e) => {
                      const newBefore = [...form.before];
                      newBefore[index].key = e.target.value;
                      setForm((f) => ({ ...f, before: newBefore }));
                    }}
                    placeholder="Metric name (e.g., revenue)"
                    className="flex-1"
                  />
                  <Input
                    value={item.value}
                    onChange={(e) => {
                      const newBefore = [...form.before];
                      newBefore[index].value = e.target.value;
                      setForm((f) => ({ ...f, before: newBefore }));
                    }}
                    placeholder="Value (e.g., $500K)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newBefore = [...form.before];
                      newBefore.splice(index, 1);
                      setForm((f) => ({ ...f, before: newBefore }));
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
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    before: [...f.before, { key: "", value: "" }],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Before Metric
              </Button>
            </div>

            {/* After Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-primary">After</h4>
              {form.after.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item.key}
                    onChange={(e) => {
                      const newAfter = [...form.after];
                      newAfter[index].key = e.target.value;
                      setForm((f) => ({ ...f, after: newAfter }));
                    }}
                    placeholder="Metric name (e.g., revenue)"
                    className="flex-1"
                  />
                  <Input
                    value={item.value}
                    onChange={(e) => {
                      const newAfter = [...form.after];
                      newAfter[index].value = e.target.value;
                      setForm((f) => ({ ...f, after: newAfter }));
                    }}
                    placeholder="Value (e.g., $1.75M)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newAfter = [...form.after];
                      newAfter.splice(index, 1);
                      setForm((f) => ({ ...f, after: newAfter }));
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
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    after: [...f.after, { key: "", value: "" }],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add After Metric
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading || uploadingImage}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading || uploadingImage}>
            {loading ? "Saving..." : initial ? "Update Portfolio" : "Create Portfolio"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

