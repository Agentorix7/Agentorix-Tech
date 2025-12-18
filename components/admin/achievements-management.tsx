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
import { Pencil, Plus, Trash2, Award, X } from "lucide-react";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { IconPicker } from "@/components/admin/icon-picker";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

type AchievementCertificationSummary = {
  id: string;
  type: "ACHIEVEMENT" | "CERTIFICATION";
  // Achievement fields
  icon: string | null;
  title: string | null;
  organization: string | null;
  year: string | null;
  description: string | null;
  image: string | null;
  // Certification fields
  name: string | null;
  status: string | null;
  logo: string | null;
  // Common fields
  displayOrder: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type AchievementCertificationFormState = {
  type: "ACHIEVEMENT" | "CERTIFICATION";
  // Achievement fields
  icon: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  image: string;
  // Certification fields
  name: string;
  status: string;
  logo: string;
  // Common fields
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

export function AchievementsManagement({ initialAchievements }: { initialAchievements: AchievementCertificationSummary[] }) {
  const [achievements, setAchievements] = useState<AchievementCertificationSummary[]>(initialAchievements);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "ACHIEVEMENT" | "CERTIFICATION">("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [editAchievement, setEditAchievement] = useState<AchievementCertificationSummary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    let result = achievements;
    
    if (typeFilter !== "ALL") {
      result = result.filter((a) => a.type === typeFilter);
    }
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter((a) => {
        if (a.type === "ACHIEVEMENT") {
          return (
            (a.title?.toLowerCase().includes(lowerQuery) || false) ||
            (a.organization?.toLowerCase().includes(lowerQuery) || false) ||
            (a.description?.toLowerCase().includes(lowerQuery) || false) ||
            (a.year?.toLowerCase().includes(lowerQuery) || false)
          );
        } else {
          return (
            (a.name?.toLowerCase().includes(lowerQuery) || false) ||
            (a.status?.toLowerCase().includes(lowerQuery) || false)
          );
        }
      });
    }
    
    return result;
  }, [achievements, query, typeFilter]);

  const handleDelete = async (id: string) => {
    const prev = achievements;
    setAchievements((list) => list.filter((a) => a.id !== id));
    try {
      await jsonFetch(`/api/admin/achievements/${id}`, { method: "DELETE" });
      toast.success("Item deleted");
    } catch (err) {
      console.error(err);
      setAchievements(prev);
      toast.error("Failed to delete item");
    }
  };

  const handleCreate = async (data: Partial<AchievementCertificationSummary>) => {
    setLoading(true);
    try {
      const created = await jsonFetch<AchievementCertificationSummary>("/api/admin/achievements", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setAchievements((prev) => [created, ...prev]);
      toast.success("Item created");
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<AchievementCertificationSummary>) => {
    setLoading(true);
    try {
      const updated = await jsonFetch<AchievementCertificationSummary>(`/api/admin/achievements/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setAchievements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      toast.success("Item updated");
      setEditAchievement(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  const achievementsList = filtered.filter((a) => a.type === "ACHIEVEMENT");
  const certificationsList = filtered.filter((a) => a.type === "CERTIFICATION");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Achievements & Certifications</h2>
          <Badge variant="secondary" className="text-xs">{achievements.length}</Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
            <SelectTrigger className="h-9 w-full sm:w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="ACHIEVEMENT">Achievements</SelectItem>
              <SelectItem value="CERTIFICATION">Certifications</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-56 text-sm"
          />
          <Button size="sm" onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1" /> <span className="text-xs sm:text-sm">Add Item</span>
          </Button>
        </div>
      </div>

      {/* Achievements Section */}
      {typeFilter === "ALL" || typeFilter === "ACHIEVEMENT" ? (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold">Achievements ({achievementsList.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {achievementsList.map((achievement) => {
              const IconComponent = achievement.icon
                ? (LucideIcons as any)[achievement.icon] || Award
                : Award;
              
              return (
                <Card
                  key={achievement.id}
                  className="rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
                            {achievement.title || "Untitled"}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                            {achievement.organization || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEditAchievement(achievement)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => setConfirmDeleteId(achievement.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {achievement.year && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {achievement.year}
                      </Badge>
                    )}

                    {achievement.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                        {achievement.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-4 border-t border-border">
                      <Badge
                        variant="outline"
                        className={achievement.isActive ? "text-emerald-600 border-emerald-200" : "text-amber-600 border-amber-200"}
                      >
                        {achievement.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {achievement.displayOrder !== null && (
                        <Badge variant="outline" className="text-neutral-600 border-neutral-200">
                          Order: {achievement.displayOrder}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Certifications Section */}
      {typeFilter === "ALL" || typeFilter === "CERTIFICATION" ? (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold">Certifications ({certificationsList.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {certificationsList.map((certification) => (
              <Card
                key={certification.id}
                className="rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white border border-border/50 flex items-center justify-center shrink-0">
                        {certification.logo ? (
                          <Image
                            src={certification.logo}
                            alt={certification.name || "Certification"}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
                          {certification.name || "Untitled"}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {certification.status || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditAchievement(certification)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        onClick={() => setConfirmDeleteId(certification.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-4 border-t border-border">
                    <Badge
                      variant="outline"
                      className={certification.isActive ? "text-emerald-600 border-emerald-200" : "text-amber-600 border-amber-200"}
                    >
                      {certification.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {certification.displayOrder !== null && (
                      <Badge variant="outline" className="text-neutral-600 border-neutral-200">
                        Order: {certification.displayOrder}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {filtered.length === 0 && (
        <Card className="rounded-lg sm:rounded-2xl border border-dashed border-border/60 col-span-full">
          <CardContent className="py-8 sm:py-10 text-center text-xs sm:text-sm text-muted-foreground">
            No items found. Add one to get started.
          </CardContent>
        </Card>
      )}

      {/* Create modal */}
      <AchievementModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={loading}
        title="Add Achievement/Certification"
        icon={<Award className="h-4 w-4" />}
      />

      {/* Edit modal */}
      <AchievementModal
        open={!!editAchievement}
        onClose={() => setEditAchievement(null)}
        onSubmit={(data) => {
          if (editAchievement) {
            return handleUpdate(editAchievement.id, data);
          }
        }}
        loading={loading}
        title="Edit Achievement/Certification"
        initial={editAchievement || undefined}
        icon={<Award className="h-4 w-4" />}
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
        title="Delete item?"
        description="This will remove the item from the site."
      />
    </div>
  );
}

function AchievementModal({
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
  onSubmit: (data: Partial<AchievementCertificationSummary>) => Promise<void> | void;
  loading: boolean;
  title: string;
  initial?: AchievementCertificationSummary;
  icon?: React.ReactNode;
}) {
  const [form, setForm] = useState<AchievementCertificationFormState>(() => {
    if (initial) {
      return {
        type: initial.type,
        icon: initial.icon || "",
        title: initial.title || "",
        organization: initial.organization || "",
        year: initial.year || "",
        description: initial.description || "",
        image: initial.image || "",
        name: initial.name || "",
        status: initial.status || "",
        logo: initial.logo || "",
        displayOrder: initial.displayOrder ?? null,
        isActive: initial.isActive ?? true,
      };
    }
    return {
      type: "ACHIEVEMENT",
      icon: "",
      title: "",
      organization: "",
      year: "",
      description: "",
      image: "",
      name: "",
      status: "",
      logo: "",
      displayOrder: null,
      isActive: true,
    };
  });

  // Reset form when modal opens or initial changes
  useEffect(() => {
    if (!open) return;
    
    if (initial) {
      const newForm = {
        type: initial.type,
        icon: initial.icon || "",
        title: initial.title || "",
        organization: initial.organization || "",
        year: initial.year || "",
        description: initial.description || "",
        image: initial.image || "",
        name: initial.name || "",
        status: initial.status || "",
        logo: initial.logo || "",
        displayOrder: initial.displayOrder ?? null,
        isActive: initial.isActive ?? true,
      };
      setForm(newForm);
    } else {
      setForm({
        type: "ACHIEVEMENT",
        icon: "",
        title: "",
        organization: "",
        year: "",
        description: "",
        image: "",
        name: "",
        status: "",
        logo: "",
        displayOrder: null,
        isActive: true,
      });
    }
  }, [open, initial]);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage || uploadingLogo) {
      toast.error("Please wait for the uploads to finish.");
      return;
    }

    if (form.type === "ACHIEVEMENT" && !form.title) {
      toast.error("Title is required for achievements.");
      return;
    }

    if (form.type === "CERTIFICATION" && !form.name) {
      toast.error("Name is required for certifications.");
      return;
    }

    try {
      const payload: any = {
        type: form.type,
        displayOrder: form.displayOrder === null ? null : Number(form.displayOrder),
        isActive: form.isActive,
      };

      if (form.type === "ACHIEVEMENT") {
        payload.icon = form.icon || null;
        payload.title = form.title;
        payload.organization = form.organization || null;
        payload.year = form.year || null;
        payload.description = form.description || null;
        payload.image = form.image || null;
      } else {
        payload.name = form.name;
        payload.status = form.status || null;
        payload.logo = form.logo || null;
      }

      await onSubmit(payload);
    } catch (err: any) {
      toast.error(err?.message || "Invalid input");
    }
  };

  // Debug: Log form type to verify it's set correctly
  if (process.env.NODE_ENV === 'development' && open && initial) {
    console.log('AchievementModal - form.type:', form.type, 'initial.type:', initial.type);
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      description="Manage achievements and certifications."
      icon={icon}
      imageSrc={form.type === "ACHIEVEMENT" ? form.image : form.logo || undefined}
    >
      <form key={`${initial?.id || "new"}-${form.type}`} onSubmit={handleSubmit} className="space-y-6 text-sm">
        {/* Type Selection */}
        <div className="space-y-1.5">
          <Label htmlFor="type">
            Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={form.type}
            onValueChange={(value) => setForm((f) => ({ ...f, type: value as "ACHIEVEMENT" | "CERTIFICATION" }))}
            disabled={!!initial}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACHIEVEMENT">Achievement</SelectItem>
              <SelectItem value="CERTIFICATION">Certification</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {initial ? "Type cannot be changed after creation." : "Select whether this is an achievement or certification."}
          </p>
        </div>

        {/* Achievement Fields */}
        {form.type === "ACHIEVEMENT" && (
          <>
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-base font-semibold text-foreground">Achievement Details</h3>
              <div className="space-y-1.5">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Best Digital Agency 2023"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={form.organization}
                    onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                    placeholder="Tech Excellence Awards"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    placeholder="2023"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="min-h-[80px]"
                  placeholder="Recognized for outstanding innovation..."
                />
              </div>

              <IconPicker
                label="Icon"
                description="Select an icon for this achievement."
                value={form.icon}
                onChange={(iconName) => setForm((f) => ({ ...f, icon: iconName }))}
              />

              <FileUploadField
                label="Achievement Image"
                description="Upload an image for this achievement."
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                uploadUrl="/api/admin/uploads/portfolio-image"
                onUploadingChange={setUploadingImage}
              />
            </div>
          </>
        )}

        {/* Certification Fields */}
        {form.type === "CERTIFICATION" && (
          <>
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-base font-semibold text-foreground">Certification Details</h3>
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="ISO 27001"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  placeholder="Certified, Partner, etc."
                />
              </div>

              <FileUploadField
                label="Certification Logo"
                description="Upload a logo for this certification."
                value={form.logo}
                onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
                uploadUrl="/api/admin/uploads/portfolio-image"
                onUploadingChange={setUploadingLogo}
              />
            </div>
          </>
        )}

        {/* Common Settings */}
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
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading || uploadingImage || uploadingLogo}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading || uploadingImage || uploadingLogo}>
            {loading ? "Saving..." : initial ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

