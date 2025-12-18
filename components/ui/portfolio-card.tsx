"use client";

import Image from "next/image";
import { BarChart3 } from "lucide-react";
import * as LucideIcons from "lucide-react";

type PortfolioCardProps = {
  title: string;
  category: string;
  type?: string | null;
  image: string;
  description: string;
  slug: string;
  metrics?: {
    label: string;
    value: string;
    icon: string;
  } | null;
  before?: Record<string, string> | null;
  after?: Record<string, string> | null;
  link?: string | null;
  // Admin mode props
  adminMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function PortfolioCard({
  title,
  category,
  type,
  image,
  description,
  slug,
  metrics,
  before,
  after,
  link,
  adminMode = false,
  onEdit,
  onDelete,
}: PortfolioCardProps) {
  const MetricIcon = metrics?.icon
    ? (LucideIcons[metrics.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
    : null;

  // const portfolioLink = link || `/portfolio/${slug}`;

  const cardContent = (
    <div className="group rounded-2xl bg-white border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col overflow-hidden h-full">
      {/* Image */}
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badge */}
        {type && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium shadow-md">
              {type}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 bg-white flex flex-col flex-1">
        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {description}
        </p>

        {/* Metrics */}
        {metrics && MetricIcon && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <MetricIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-3xl font-bold text-primary mb-0.5">
                {metrics.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {metrics.label}
              </div>
            </div>
          </div>
        )}

        {/* Before/After */}
        {(before || after) && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-primary shrink-0" />
              <h4 className="text-sm font-semibold text-foreground">Before & After</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {before && Object.keys(before).length > 0 && (
                <div>
                  <div className="text-red-500 font-semibold mb-1">Before</div>
                  {Object.entries(before).map(([key, value]) => (
                    <div key={key} className="text-muted-foreground mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </div>
                  ))}
                </div>
              )}
              {after && Object.keys(after).length > 0 && (
                <div>
                  <div className="text-primary font-semibold mb-1">After</div>
                  {Object.entries(after).map(([key, value]) => (
                    <div key={key} className="text-muted-foreground mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Actions */}
        {adminMode && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit?.();
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete?.();
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (adminMode) {
    return cardContent;
  }

  return (
    <>
      {cardContent}
    </>
  );
}

