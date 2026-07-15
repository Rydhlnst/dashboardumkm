"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Store } from "lucide-react";
import type { TimelineEntry } from "@/types";
import { cn } from "@/lib/utils";

interface ExpansionTimelineProps {
  data: TimelineEntry[];
}

const statusConfig = {
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  in_progress: { label: "In Progress", className: "bg-blue-50 text-blue-700 border-blue-200" },
  planned: { label: "Planned", className: "bg-muted text-muted-foreground border-border" },
};

export function ExpansionTimeline({ data }: ExpansionTimelineProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 px-5 pt-5">
        <SectionHeader
          title="Expansion Timeline"
          description="Planned and active new store openings"
          iconSlot={<CalendarDays className="w-4 h-4 text-muted-foreground" />}
        />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Accordion type="multiple" className="space-y-1">
          {data.map((entry) => {
            const cfg = statusConfig[entry.status];
            return (
              <AccordionItem
                key={entry.regionId}
                value={entry.regionId}
                className="border border-border/60 rounded-xl px-4 data-[state=open]:bg-muted/20 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-3 text-sm">
                  <div className="flex items-center gap-3 flex-1 mr-3">
                    <span className="font-medium text-foreground">{entry.regionName}</span>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] h-5 px-2", cfg.className)}
                    >
                      {cfg.label}
                    </Badge>
                    <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {entry.targetDate}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3 pt-0">
                  {entry.newStores.length > 0 ? (
                    <div className="space-y-1.5">
                      {entry.newStores.map((store) => (
                        <div key={store} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Store className="w-3 h-3 flex-shrink-0" />
                          <span>{store}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No new stores planned.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
