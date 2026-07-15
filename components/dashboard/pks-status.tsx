"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { PKSBadge } from "./status-badge";
import { Handshake, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Region } from "@/types";

interface PKSStatusPanelProps {
  regions: Region[];
}

export function PKSStatusPanel({ regions }: PKSStatusPanelProps) {
  const available = regions.filter((r) => r.pksStatus === "available").length;
  const notAvailable = regions.filter((r) => r.pksStatus === "not_available").length;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 px-5 pt-5">
        <SectionHeader
          title="PKS / MoU Status"
          description="Partnership agreements per region"
          iconSlot={<Handshake className="w-4 h-4 text-muted-foreground" />}
          action={
            <div className="flex items-center gap-3 text-xs">
              <span className="text-emerald-600 font-medium">{available} Available</span>
              <span className="text-muted-foreground">{notAvailable} Pending</span>
            </div>
          }
        />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {regions.map((region, i) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              {region.pksStatus === "available" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{region.name}</p>
                <PKSBadge status={region.pksStatus} />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
