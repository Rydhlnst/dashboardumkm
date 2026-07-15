"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import type { StoreDistribution } from "@/types";

interface StoreDistributionChartProps {
  data: StoreDistribution[];
}

export function StoreDistributionChart({ data }: StoreDistributionChartProps) {
  const max = Math.max(...data.map((d) => d.count));

  return (
    <Card className="border-border/60 h-full">
      <CardHeader className="pb-2 px-5 pt-5">
        <SectionHeader
          title="Store Distribution"
          description="Per-region store count"
          iconSlot={<BarChart2 className="w-4 h-4 text-muted-foreground" />}
        />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-2.5">
          {data.map((item, i) => (
            <div key={item.region} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate max-w-[120px]">{item.region}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{item.count}</span>
                  <span className="text-muted-foreground w-7 text-right">{item.percentage}%</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
