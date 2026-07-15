"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { Sparkles, TrendingUp, TrendingDown, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { InsightCard } from "@/types";
import { cn } from "@/lib/utils";

const typeConfig = {
  best: { icon: Star, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
  worst: { icon: TrendingDown, bg: "bg-red-50", text: "text-red-700", border: "border-red-100" },
  highest: { icon: TrendingUp, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
  priority: { icon: Zap, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
};

interface InsightCardsProps {
  cards: InsightCard[];
}

export function InsightCards({ cards }: InsightCardsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 px-5 pt-5">
        <SectionHeader
          title="Executive Insights"
          description="Auto-generated highlights from current data"
          iconSlot={<Sparkles className="w-4 h-4 text-muted-foreground" />}
        />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {cards.map((card, i) => {
            const cfg = typeConfig[card.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200 hover:shadow-sm cursor-default",
                  cfg.bg, cfg.border
                )}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <Icon className={cn("w-4 h-4", cfg.text)} />
                  <span className={cn("text-[10px] font-semibold uppercase tracking-wide", cfg.text)}>
                    {card.title}
                  </span>
                </div>
                <p className={cn("text-lg font-bold mb-1", cfg.text)}>{card.value}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
