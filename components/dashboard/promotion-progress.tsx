"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { Progress } from "@/components/ui/progress";
import { Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import type { Region } from "@/types";

interface PromotionProgressProps {
  regions: Region[];
}

export function PromotionProgress({ regions }: PromotionProgressProps) {
  const sorted = [...regions].sort(
    (a, b) =>
      b.promotionInstalled / b.promotionTotal - a.promotionInstalled / a.promotionTotal
  );

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 px-5 pt-5">
        <SectionHeader
          title="Promotion Coverage"
          description="Stores with promotion materials installed"
          iconSlot={<Megaphone className="w-4 h-4 text-muted-foreground" />}
        />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {sorted.map((region, i) => {
            const pct = Math.round((region.promotionInstalled / region.promotionTotal) * 100);
            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{region.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">
                      {region.promotionInstalled}/{region.promotionTotal}
                    </span>
                    <span
                      className={
                        pct >= 90
                          ? "text-emerald-600 font-semibold"
                          : pct >= 70
                          ? "text-amber-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={pct}
                  className="h-1.5"
                />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
