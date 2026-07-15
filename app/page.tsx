"use client";

import { Map, Store, Users, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { SulawesiMap } from "@/components/dashboard/sulawesi-map";
import { ExpansionChart } from "@/components/dashboard/expansion-chart";
import { StoreDistributionChart } from "@/components/dashboard/store-distribution-chart";
import { ActiveUMKMChart } from "@/components/dashboard/active-umkm-chart";
import { PromotionProgress } from "@/components/dashboard/promotion-progress";
import { PKSStatusPanel } from "@/components/dashboard/pks-status";
import { ExpansionTimeline } from "@/components/dashboard/expansion-timeline";
import { SocializationTable } from "@/components/dashboard/socialization-table";
import { InsightCards } from "@/components/dashboard/insight-cards";
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart";
import {
  regions,
  storeDistribution,
  expansionChartData,
  umkmChartData,
  insightCards,
  expansionTimeline,
  socializationData,
  monthlyTrendData,
} from "@/data/dashboard";
import { kpiSummary } from "@/data/area-stats";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Dashboard UMKM</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitoring perkembangan UMKM Alfamidi Branch Palu
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Area"
          value={kpiSummary.totalAreas}
          description="Wilayah yang tercakup"
          iconSlot={<Map className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          delay={0}
        />
        <KPICard
          title="Total Toko"
          value={kpiSummary.totalStores}
          description="Toko Alfamidi aktif"
          iconSlot={<Store className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          delay={0.06}
        />
        <KPICard
          title="UMKM Aktif"
          value={kpiSummary.umkmAktif}
          description="Toko dengan mitra UMKM aktif"
          iconSlot={<Users className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          delay={0.12}
        />
        <KPICard
          title="Sarana Promosi"
          value={kpiSummary.saranaPromosiTerpasang}
          description="Toko dengan promosi terpasang"
          iconSlot={<TrendingUp className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          delay={0.18}
        />
      </div>

      {/* Map + Expansion Status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <SulawesiMap regions={regions} />
        </div>
        <div className="flex flex-col gap-4">
          <ExpansionChart data={expansionChartData} total={regions.length} />
          <StoreDistributionChart data={storeDistribution.slice(0, 6)} />
        </div>
      </div>

      {/* Monthly Trend + UMKM Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyTrendChart data={monthlyTrendData} />
        <ActiveUMKMChart data={umkmChartData} />
      </div>

      {/* Promotion Progress */}
      <PromotionProgress regions={regions} />

      {/* PKS / MoU Status */}
      <PKSStatusPanel regions={regions} />

      {/* Expansion Timeline */}
      <ExpansionTimeline data={expansionTimeline} />

      {/* Socialization Table */}
      <SocializationTable data={socializationData} />

      {/* Executive Insights */}
      <InsightCards cards={insightCards} />
    </div>
  );
}
