"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, FilePenLine, MessageCircle, UserPlus } from "lucide-react";

type ActivityItem = {
  type: "lead" | "blog" | "contact";
  title: string;
  meta: string;
  link: string;
};

type RecentActivityProps = {
  activities: ActivityItem[];
};

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "lead":
        return UserPlus;
      case "blog":
        return FilePenLine;
      case "contact":
        return MessageCircle;
      default:
        return Activity;
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="border border-border/60 bg-background/80 shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </span>
            <CardTitle className="text-base md:text-lg">Recent activity</CardTitle>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated live
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-background/80 shadow-sm rounded-lg sm:rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
          </span>
          <CardTitle className="text-sm sm:text-base md:text-lg">Recent activity</CardTitle>
        </div>
        <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-muted-foreground">
          <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span className="hidden xs:inline">Updated live</span>
          <span className="xs:hidden">Live</span>
        </span>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {activities.map((item, index) => {
          const Icon = getIcon(item.type);
          return (
            <Link
              key={index}
              href={item.link}
              className="flex items-start gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-border/60 bg-muted/40 px-2 sm:px-3 py-2 sm:py-2.5 hover:bg-muted/70 hover:border-primary/50 transition cursor-pointer"
            >
              <div className="mt-0.5 shrink-0">
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-2">{item.title}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.meta}</p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}


