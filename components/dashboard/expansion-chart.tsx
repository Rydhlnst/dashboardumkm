"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ExpansionChartData } from "@/types";

interface ExpansionChartProps {
  data: ExpansionChartData[];
  total: number;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-md px-3 py-2">
        <p className="text-xs font-medium text-foreground">{payload[0].name}</p>
        <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>{payload[0].value}</p>
        <p className="text-[10px] text-muted-foreground">regions</p>
      </div>
    );
  }
  return null;
};

export function ExpansionChart({ data, total }: ExpansionChartProps) {
  return (
    <Card className="border-border/60 h-full">
      <CardHeader className="pb-2 px-5 pt-5">
        <SectionHeader
          title="Expansion Status"
          description="Distribution across all regions"
          iconSlot={<ChevronRight className="w-4 h-4 text-muted-foreground" />}
        />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex flex-col items-center">
          <div className="relative w-full" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-foreground">{total}</span>
              <span className="text-xs text-muted-foreground">Regions</span>
            </div>
          </div>

          <div className="w-full space-y-2 mt-2">
            {data.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{item.value}</span>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {Math.round((item.value / total) * 100)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
