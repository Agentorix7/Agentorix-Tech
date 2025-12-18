"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ImageUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type FileUploadFieldProps = {
  label?: string;
  description?: string;
  value?: string;
  onChange: (url: string) => void;
  uploadUrl: string;
  accept?: string;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
  className?: string;
};

export function FileUploadField({
  label,
  description,
  value,
  onChange,
  uploadUrl,
  accept = "image/*",
  disabled,
  onUploadingChange,
  className,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSelectFile = () => {
    if (disabled || uploading) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    onUploadingChange?.(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const data = await res.json();
      const url = data.url as string;
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      // reset input so selecting same file again re-triggers change
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label>{label}</Label>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={handleSelectFile}
        disabled={disabled || uploading}
        className={cn(
          "relative flex w-full items-center gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-3 text-left transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50",
          (disabled || uploading) && "opacity-70 cursor-not-allowed"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImageUp className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 space-y-0.5">
          <p className="text-sm font-medium">
            {uploading
              ? "Uploading image..."
              : value
              ? "Change image"
              : "Upload image to replace the current one"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {value
              ? "Upload a different image to replace the current one."
              : "Supported formats: JPG, PNG, WEBP. Max size depends on ImageKit plan."}
          </p>
        </div>
        {value && !uploading && (
          <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border/60 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </button>
      {description && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}
    </div>
  );
}


