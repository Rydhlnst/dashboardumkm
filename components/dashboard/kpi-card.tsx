"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  iconSlot: ReactNode;
  trend?: number;
  trendLabel?: string;
  iconBg?: string;
  delay?: number;
}

export function KPICard({
  title,
  value,
  description,
  iconSlot,
  trend,
  trendLabel,
  iconBg = "bg-red-50",
  delay = 0,
}: KPICardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card className="group hover:shadow-md transition-all duration-200 border-border/60 cursor-default overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
              <p className="text-3xl font-bold text-foreground leading-none tracking-tight">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
            </div>
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
              iconBg
            )}>
              {iconSlot}
            </div>
          </div>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                isPositive ? "text-emerald-600" : isNegative ? "text-red-500" : "text-muted-foreground"
              )}>
                <TrendIcon className="w-3 h-3" />
                <span>{isPositive ? "+" : ""}{trend}%</span>
              </div>
              <span className="text-xs text-muted-foreground">{trendLabel ?? "vs last quarter"}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
