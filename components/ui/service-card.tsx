"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;
  icon?: string;
  slug: string;
  link?: string;
  // Admin mode props
  adminMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ServiceCard({
  title,
  description,
  image,
  icon,
  slug,
  link,
  adminMode = false,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  const IconComponent = icon
    ? (LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
    : null;

  const serviceLink = link || `/services/${slug}`;

  return (
    <div className="group relative overflow-visible rounded-xl sm:rounded-2xl bg-white border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col">
      {/* Image - Always Visible */}
      <div className="relative h-64 w-full overflow-hidden rounded-t-xl sm:rounded-t-2xl">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            {IconComponent ? (
              <IconComponent className="h-16 w-16 text-muted-foreground" />
            ) : (
              <span className="text-muted-foreground">No image</span>
            )}
          </div>
        )}
      </div>

      {/* Icon - Centered and overlapping image/content */}
      {IconComponent && (
        <div className="absolute top-56 left-1/2 -translate-x-1/2 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        </div>
      )}

      {/* Content */}
      <div className="p-6 pt-10 sm:pt-12 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-6 flex-1 leading-relaxed">
          {description}
        </p>

        {/* Action Buttons */}
        {adminMode ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-500 hover:text-red-600 hover:border-red-500"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        ) : (
          <Link href={serviceLink}>
            <Button
              className="w-full bg-primary text-white hover:bg-primary/90 transition-colors"
              size="lg"
            >
              View Service
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

