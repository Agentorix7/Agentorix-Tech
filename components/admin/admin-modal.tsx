"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import Image from "next/image";

export function AdminModal({
  open,
  onClose,
  title,
  icon,
  imageSrc,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  imageSrc?: string;
  description?: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl border-border bg-background flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {imageSrc ? (
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Image
                    src={imageSrc}
                    alt={title}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </span>
              ) : (
                icon && (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {icon}
                  </span>
                )
              )}
              <CardTitle className="text-base md:text-lg">
                {title}
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
            >
              ×
            </Button>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto flex-1">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}


