"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { ExpansionBadge } from "./status-badge";
import { Map, X } from "lucide-react";
import type { Region } from "@/types";
import { cn } from "@/lib/utils";

interface TooltipState {
  region: Region;
  x: number;
  y: number;
}

const expansionColor = {
  open: { dot: "fill-emerald-500", ring: "stroke-emerald-400", bg: "bg-emerald-50 border-emerald-200" },
  conditional: { dot: "fill-amber-500", ring: "stroke-amber-400", bg: "bg-amber-50 border-amber-200" },
  closed: { dot: "fill-red-500", ring: "stroke-red-400", bg: "bg-red-50 border-red-200" },
};

interface SulawesiMapProps {
  regions: Region[];
}

export function SulawesiMap({ regions }: SulawesiMapProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [selected, setSelected] = useState<Region | null>(null);

  const handleMouseEnter = (region: Region, e: React.MouseEvent<SVGCircleElement>) => {
    const svgEl = (e.target as SVGCircleElement).closest("svg");
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    setTooltip({ region, x: region.coordinates.x, y: region.coordinates.y });
  };

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className="pb-3 px-5 pt-5">
        <SectionHeader
          title="Interactive Region Map — Sulawesi Tengah"
          description="12 kabupaten/kota — hover to preview, click to select"
          iconSlot={<Map className="w-4 h-4 text-muted-foreground" />}
          action={
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Open</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Conditional</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Closed</span>
            </div>
          }
        />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <svg
            viewBox="0 0 100 65"
            className="w-full h-full"
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Stylized Sulawesi outline */}
            <defs>
              <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.08" />
              </filter>
            </defs>
            <rect width="100" height="65" fill="url(#mapBg)" rx="1" />

            {/* Simplified Sulawesi shape */}
            <path
              d="M38 14 L44 12 L50 14 L54 18 L58 20 L62 22 L66 24 L70 26 L74 30 L78 34 L80 40 L82 46 L84 50 L86 52 L88 56 L86 60 L82 62 L78 58 L76 54 L74 50 L72 46 L70 42 L68 38 L66 34 L64 30 L60 28 L56 26 L52 26 L50 28 L50 32 L52 36 L54 42 L56 48 L56 54 L54 58 L50 60 L46 58 L44 54 L44 48 L44 42 L42 38 L40 34 L38 30 L36 26 L34 22 L36 18 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="0.3"
              filter="url(#shadow)"
            />
            {/* Northern arm */}
            <path
              d="M44 12 L42 10 L40 8 L38 7 L36 8 L34 10 L32 12 L30 14 L32 16 L36 14 L40 12 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="0.3"
            />
            {/* Island indicators for Banggai Kepulauan and Banggai Laut */}
            <ellipse cx="91" cy="54" rx="3" ry="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.3" />
            <ellipse cx="89" cy="60" rx="2.5" ry="1.5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.3" />

            {/* Grid lines */}
            {[20, 40, 60, 80].map((x) => (
              <line key={`vl-${x}`} x1={x} y1="0" x2={x} y2="65" stroke="#e2e8f0" strokeWidth="0.2" strokeDasharray="1,2" />
            ))}
            {[20, 40].map((y) => (
              <line key={`hl-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#e2e8f0" strokeWidth="0.2" strokeDasharray="1,2" />
            ))}

            {/* Region dots */}
            {regions.map((region) => {
              const colors = expansionColor[region.expansionStatus];
              const isSelected = selected?.id === region.id;
              const isHovered = tooltip?.region.id === region.id;

              return (
                <g key={region.id}>
                  {(isSelected || isHovered) && (
                    <circle
                      cx={region.coordinates.x}
                      cy={region.coordinates.y}
                      r="4.5"
                      className={colors.ring}
                      fill="none"
                      strokeWidth="0.8"
                      opacity="0.6"
                    />
                  )}
                  <circle
                    cx={region.coordinates.x}
                    cy={region.coordinates.y}
                    r={isSelected ? "3.2" : "2.4"}
                    className={cn(colors.dot, "cursor-pointer transition-all duration-150")}
                    strokeWidth={isSelected ? "0.8" : "0"}
                    stroke="white"
                    onMouseEnter={(e) => handleMouseEnter(region, e)}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => setSelected(selected?.id === region.id ? null : region)}
                  />
                  <text
                    x={region.coordinates.x}
                    y={region.coordinates.y + 5.5}
                    textAnchor="middle"
                    fontSize="2.8"
                    fill="#475569"
                    className="pointer-events-none select-none font-medium"
                  >
                    {region.shortName}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          <AnimatePresence>
            {tooltip && !selected && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute z-10 pointer-events-none"
                style={{
                  left: `${tooltip.x}%`,
                  top: `${tooltip.y}%`,
                  transform: "translate(-50%, -130%)",
                }}
              >
                <div className="bg-white border border-border rounded-xl shadow-lg p-3 min-w-[160px]">
                  <p className="font-semibold text-sm text-foreground mb-1.5">{tooltip.region.name}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between gap-4">
                      <span>Stores</span>
                      <span className="font-medium text-foreground">{tooltip.region.storeCount}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Active UMKM</span>
                      <span className="font-medium text-foreground">{tooltip.region.activeUMKM}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Promotion</span>
                      <span className="font-medium text-foreground">{tooltip.region.promotionInstalled}/{tooltip.region.promotionTotal}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border">
                    <ExpansionBadge status={tooltip.region.expansionStatus} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected Region Detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{selected.name}</h3>
                      <ExpansionBadge status={selected.expansionStatus} />
                    </div>
                    <p className="text-xs text-muted-foreground">Kabupaten/Kota — Sulawesi Tengah</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {[
                    { label: "Stores", value: selected.storeCount },
                    { label: "Active UMKM", value: selected.activeUMKM },
                    { label: "Promotion", value: `${selected.promotionInstalled}/${selected.promotionTotal}` },
                    { label: "Participants", value: selected.participants },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <p className="text-base font-bold text-foreground">{item.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
