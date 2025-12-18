"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const traffic = [
  { label: "Organic Search", value: 48, color: "bg-emerald-500" },
  { label: "Paid Campaigns", value: 22, color: "bg-sky-500" },
  { label: "Social Media", value: 18, color: "bg-violet-500" },
  { label: "Referrals", value: 12, color: "bg-amber-500" },
];

export function TrafficOverview() {
  return (
    <Card className="border border-border/60 bg-background/80 shadow-sm rounded-lg sm:rounded-2xl">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-sm sm:text-base md:text-lg">
          Traffic & lead sources
        </CardTitle>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
          Distribution of website sessions and leads across key acquisition
          channels for the last 7 days.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="flex h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-muted">
          {traffic.map((item) => (
            <div
              key={item.label}
              className={`${item.color} h-full`}
              style={{ width: `${item.value}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs">
          {traffic.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ${item.color} shrink-0`}
              />
              <div className="space-y-0.5 min-w-0">
                <p className="font-medium leading-none truncate">{item.label}</p>
                <p className="text-[9px] sm:text-[11px] text-muted-foreground">
                  {item.value}% of total traffic
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


