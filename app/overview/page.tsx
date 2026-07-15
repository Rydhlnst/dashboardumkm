"use client";

import { stores } from "@/data/stores";
import { umkmProducts } from "@/data/umkm";
import { areaStats, kpiSummary } from "@/data/area-stats";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const AREA_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#06b6d4", "#84cc16", "#f43f5e", "#a855f7",
];

export default function OverviewPage() {
  const umkmCoverage = Math.round((kpiSummary.umkmAktif / kpiSummary.totalStores) * 100);
  const promosiCoverage = Math.round((kpiSummary.saranaPromosiTerpasang / kpiSummary.totalStores) * 100);

  const prodAktif = umkmProducts.filter((p) => p.keterangan === "AKTIF").length;
  const prodPolitis = umkmProducts.filter((p) => p.keterangan === "UMKM POLITIS").length;
  const prodTidakAktif = umkmProducts.filter((p) => p.keterangan === "TIDAK AKTIF").length;

  const chartData = areaStats.map((a, i) => ({
    area: a.area.split(" ").map((w) => w[0]).join("").slice(0, 4),
    fullArea: a.area,
    stores: a.totalStores,
    umkm: a.umkmAktif,
    color: AREA_COLORS[i % AREA_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ringkasan data toko dan UMKM Alfamidi Branch Palu
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Toko", value: kpiSummary.totalStores, sub: `${kpiSummary.totalAreas} wilayah` },
          { label: "UMKM Aktif", value: kpiSummary.umkmAktif, sub: `${umkmCoverage}% coverage` },
          { label: "Sarana Promosi", value: kpiSummary.saranaPromosiTerpasang, sub: `${promosiCoverage}% terpasang` },
          { label: "Total PLU", value: kpiSummary.totalProducts, sub: `${kpiSummary.suppliersAktif} supplier aktif` },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="pt-5 pb-4">
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
              <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coverage bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <p className="text-sm font-semibold">Coverage UMKM per Wilayah</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {areaStats.map((a) => (
              <div key={a.area} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground font-medium">{a.area}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {a.umkmAktif}/{a.totalStores} — {a.umkmCoverage}%
                  </span>
                </div>
                <Progress value={a.umkmCoverage} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <p className="text-sm font-semibold">Sarana Promosi per Wilayah</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {areaStats.map((a) => (
              <div key={a.area} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground font-medium">{a.area}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {a.saranaPromosi}/{a.totalStores} — {a.promosiCoverage}%
                  </span>
                </div>
                <Progress value={a.promosiCoverage} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bar chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <p className="text-sm font-semibold">Distribusi Toko & UMKM Aktif per Wilayah</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={2} barCategoryGap="30%">
              <XAxis
                dataKey="area"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ fontSize: 11, border: "1px solid var(--border)" }}
                formatter={(value, name) => [value, name === "stores" ? "Total Toko" : "UMKM Aktif"]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullArea ?? ""}
              />
              <Bar dataKey="stores" fill="#e2e8f0" name="stores" radius={[3, 3, 0, 0]} />
              <Bar dataKey="umkm" fill="#ef4444" name="umkm" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* PLU status breakdown */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Status PLU UMKM</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Aktif", value: prodAktif, className: "text-emerald-600" },
              { label: "UMKM Politis", value: prodPolitis, className: "text-amber-600" },
              { label: "Tidak Aktif", value: prodTidakAktif, className: "text-red-600" },
            ].map((item) => (
              <div key={item.label} className="text-center py-4 border border-border/40 rounded-lg">
                <p className={`text-2xl font-bold tabular-nums ${item.className}`}>{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
