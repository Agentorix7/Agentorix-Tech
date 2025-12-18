"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, MousePointerClick, Users, FileText } from "lucide-react";

type AnalyticsData = {
  websiteVisits: {
    value: string;
    change: string;
    trend: "up" | "down";
  };
  newLeads: {
    value: string;
    change: string;
    trend: "up" | "down";
  };
  blogViews: {
    value: string;
    change: string;
    trend: "up" | "down";
  };
};

type AnalyticsCardsProps = {
  data: AnalyticsData;
};

export function AnalyticsCards({ data }: AnalyticsCardsProps) {
  const analytics = [
    {
      label: "Website Visits",
      value: data.websiteVisits.value,
      change: data.websiteVisits.change,
      trend: data.websiteVisits.trend,
      icon: MousePointerClick,
    },
    {
      label: "New Leads",
      value: data.newLeads.value,
      change: data.newLeads.change,
      trend: data.newLeads.trend,
      icon: Users,
    },
    {
      label: "Blog Views",
      value: data.blogViews.value,
      change: data.blogViews.change,
      trend: data.blogViews.trend,
      icon: FileText,
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-3 mb-6">
      {analytics.map((item) => {
        const Icon = item.icon;
        const isUp = item.trend === "up";
        return (
          <Card
            key={item.label}
            className="border border-border/60 bg-gradient-to-br from-background via-background to-primary/5 shadow-sm hover:shadow-md transition-shadow rounded-lg sm:rounded-2xl"
          >
            <CardContent className="p-3 sm:p-4 md:p-5 flex items-start justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold truncate">{item.value}</p>
                <div className="mt-1 sm:mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-emerald-500">
                  {isUp ? (
                    <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  ) : (
                    <ArrowDownRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-500" />
                  )}
                  <span className={isUp ? "" : "text-red-500"}>{item.change}</span>
                  <span className="text-muted-foreground ml-0.5 sm:ml-1 hidden xs:inline">vs last 7 days</span>
                  <span className="text-muted-foreground ml-0.5 sm:ml-1 xs:hidden">vs 7d</span>
                </div>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


