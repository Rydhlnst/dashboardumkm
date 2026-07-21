"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { ExpansionBadge } from "./status-badge";
import { Map, X } from "lucide-react";
import type { Region } from "@/types";

const GEO_URL = "/geo/sulawesi.json";

// Real coordinates [lng, lat] for each region id — matches AREA_CFG ids
const REGION_COORDS: Record<string, [number, number]> = {
  palu: [119.8707, -0.8917],
  donggala: [119.7288, -0.6851],
  sigi: [119.9739, -1.4136],
  "parigi-moutong": [120.1747, -0.4707],
  poso: [120.7524, -1.3959],
  tolitoli: [120.7955, 1.0546],
  buol: [121.4306, 1.1085],
  banggai: [122.7975, -1.3006],
  pasangkayu: [119.3699, -1.2213],
  "tojo-una-una": [121.5416, -1.1899],
  mamuju: [118.8886, -2.6748],
  pohuwato: [121.5730, 0.7080],
};

const expansionFill = {
  open: "#10b981",
  conditional: "#f59e0b",
  closed: "#ef4444",
} as const;

interface TooltipState {
  region: Region;
  cx: number;
  cy: number;
}

interface SulawesiMapProps {
  regions: Region[];
}

export function SulawesiMap({ regions }: SulawesiMapProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [selected, setSelected] = useState<Region | null>(null);

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className="pb-3 px-5 pt-5">
        <SectionHeader
          title="Interactive Region Map — Sulawesi"
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
        <div
          className="relative w-full rounded-lg bg-gradient-to-br from-slate-50 to-slate-100"
          style={{ aspectRatio: "16/10" }}
          onMouseLeave={() => setTooltip(null)}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 2400,
              center: [121, -1.5],
            }}
            width={800}
            height={500}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: "#e2e8f0", stroke: "#94a3b8", strokeWidth: 0.5, outline: "none" },
                      hover: { fill: "#cbd5e1", outline: "none" },
                      pressed: { fill: "#cbd5e1", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {regions.map((region) => {
              const coord = REGION_COORDS[region.id];
              if (!coord) return null;
              const fill = expansionFill[region.expansionStatus];
              const isSelected = selected?.id === region.id;
              const isHovered = tooltip?.region.id === region.id;
              const r = isSelected ? 8 : 6;

              return (
                <Marker
                  key={region.id}
                  coordinates={coord}
                  onMouseEnter={() => setTooltip({ region, cx: coord[0], cy: coord[1] })}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => setSelected(selected?.id === region.id ? null : region)}
                  style={{ cursor: "pointer" } as React.CSSProperties}
                >
                  {(isSelected || isHovered) && (
                    <circle r={r + 5} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.5} />
                  )}
                  <circle r={r} fill={fill} stroke="white" strokeWidth={1.5} />
                  <text
                    y={r + 10}
                    textAnchor="middle"
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      fill: "#334155",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {region.shortName}
                  </text>
                </Marker>
              );
            })}
          </ComposableMap>

          {/* Tooltip — positioned via lng/lat converted to % of the map's bounding box.
              We use a rough linear mapping based on projection center/scale — good enough for hover popovers. */}
          <AnimatePresence>
            {tooltip && !selected && (
              <TooltipCard tooltip={tooltip} />
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
                    <p className="text-xs text-muted-foreground">Kabupaten/Kota — Sulawesi</p>
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

// Bounding box roughly matching projection center [121, -1.5] scale 2400 on 800×500 viewBox.
// Empirically derived so tooltip anchors near markers.
const BBOX = { minLng: 117.5, maxLng: 125, minLat: -4, maxLat: 2 };

function TooltipCard({ tooltip }: { tooltip: TooltipState }) {
  const leftPct = ((tooltip.cx - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 100;
  const topPct = ((BBOX.maxLat - tooltip.cy) / (BBOX.maxLat - BBOX.minLat)) * 100;
  return (
    <motion.div
      key="tooltip"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.12 }}
      className="absolute z-10 pointer-events-none"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
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
  );
}
