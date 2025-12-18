"use client";

import { AdminModal } from "./admin-modal";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  icon,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return (
    <AdminModal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      icon={icon}
    >
      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </AdminModal>
  );
}


