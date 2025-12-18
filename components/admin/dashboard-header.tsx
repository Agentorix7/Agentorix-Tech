"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function DashboardHeader({ title, description, healthStatus }: { title: string, description: string, healthStatus: boolean }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-end md:justify-between mb-4 sm:mb-6">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">
          {description}
        </p>
      </div>
      {healthStatus && (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 rounded-full border border-primary/20 bg-primary/5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm text-primary shrink-0"
        )}
      >
        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="hidden sm:inline">Systems healthy · Live analytics snapshot</span>
          <span className="sm:hidden">Systems healthy</span>
        </motion.div>
      )}
    </div>
  );
}


