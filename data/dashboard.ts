import type {
  Region,
  StoreDistribution,
  ExpansionChartData,
  InsightCard,
  TimelineEntry,
  SocializationRow,
} from "@/types";
import type { AreaStat } from "./area-stats";
import { areaStats, kpiSummary } from "./area-stats";

type KPISummary = {
  totalAreas: number;
  totalStores: number;
  umkmAktif: number;
  saranaPromosiTerpasang: number;
  totalProducts: number;
  suppliersAktif: number;
};

// Static config for fields not derivable from real data (coordinates, PKS, trend, pipeline)
const AREA_CFG: Record<string, {
  id: string;
  name: string;
  shortName: string;
  coordinates: { x: number; y: number };
  pksStatus: "available" | "not_available";
  trend: "up" | "down" | "stable";
  trendValue: number;
  participants: number;
  mdProgress: number;
  activeItems: number;
  newStores: string[];
}> = {
  "PALU": {
    id: "palu", name: "Palu", shortName: "PLU",
    coordinates: { x: 52, y: 40 }, pksStatus: "available",
    trend: "up", trendValue: 12.4, participants: 156, mdProgress: 82, activeItems: 214,
    newStores: ["Palu Timur 3", "Palu Barat 7", "Palu Selatan 2"],
  },
  "DONGGALA": {
    id: "donggala", name: "Donggala", shortName: "DGL",
    coordinates: { x: 42, y: 34 }, pksStatus: "available",
    trend: "up", trendValue: 8.1, participants: 98, mdProgress: 74, activeItems: 147,
    newStores: ["Donggala Pusat 2", "Balaesang 1"],
  },
  "SIGI": {
    id: "sigi", name: "Sigi", shortName: "SGI",
    coordinates: { x: 50, y: 50 }, pksStatus: "available",
    trend: "up", trendValue: 5.3, participants: 72, mdProgress: 61, activeItems: 89,
    newStores: ["Sigi Biromaru 1"],
  },
  "PARIGI MOUTONG": {
    id: "parigi-moutong", name: "Parigi Moutong", shortName: "PMO",
    coordinates: { x: 64, y: 36 }, pksStatus: "available",
    trend: "stable", trendValue: 1.2, participants: 118, mdProgress: 78, activeItems: 176,
    newStores: ["Parigi 3", "Moutong 2"],
  },
  "POSO": {
    id: "poso", name: "Poso", shortName: "PSO",
    coordinates: { x: 68, y: 52 }, pksStatus: "not_available",
    trend: "down", trendValue: -2.1, participants: 84, mdProgress: 55, activeItems: 102,
    newStores: ["Poso Kota 1"],
  },
  "TOLI-TOLI": {
    id: "tolitoli", name: "Toli-Toli", shortName: "TTL",
    coordinates: { x: 44, y: 22 }, pksStatus: "available",
    trend: "stable", trendValue: 0.8, participants: 76, mdProgress: 68, activeItems: 121,
    newStores: ["Tolitoli 1"],
  },
  "BUOL": {
    id: "buol", name: "Buol", shortName: "BUL",
    coordinates: { x: 38, y: 16 }, pksStatus: "not_available",
    trend: "down", trendValue: -3.2, participants: 42, mdProgress: 35, activeItems: 48,
    newStores: [],
  },
  "BANGGAI": {
    id: "banggai", name: "Banggai", shortName: "BNG",
    coordinates: { x: 84, y: 46 }, pksStatus: "available",
    trend: "up", trendValue: 9.3, participants: 106, mdProgress: 79, activeItems: 158,
    newStores: ["Luwuk 2", "Batui 1"],
  },
  "PASANGKAYU": {
    id: "pasangkayu", name: "Pasangkayu", shortName: "PSK",
    coordinates: { x: 34, y: 62 }, pksStatus: "not_available",
    trend: "stable", trendValue: 0.5, participants: 38, mdProgress: 30, activeItems: 42,
    newStores: [],
  },
  "TOJO UNA-UNA": {
    id: "tojo-una-una", name: "Tojo Una-Una", shortName: "TJU",
    coordinates: { x: 76, y: 38 }, pksStatus: "not_available",
    trend: "down", trendValue: -1.5, participants: 34, mdProgress: 28, activeItems: 36,
    newStores: [],
  },
  "MAMUJU": {
    id: "mamuju", name: "Mamuju", shortName: "MMJ",
    coordinates: { x: 28, y: 58 }, pksStatus: "not_available",
    trend: "stable", trendValue: 0.3, participants: 28, mdProgress: 22, activeItems: 30,
    newStores: [],
  },
  "POHUWATO": {
    id: "pohuwato", name: "Pohuwato", shortName: "PHW",
    coordinates: { x: 22, y: 22 }, pksStatus: "not_available",
    trend: "stable", trendValue: 0.2, participants: 22, mdProgress: 18, activeItems: 24,
    newStores: [],
  },
};

// Build regions from real data, merging static config for non-derivable fields
export function buildRegions(stats: AreaStat[]): Region[] {
  const result: Region[] = [];
  for (const stat of stats) {
    const cfg = AREA_CFG[stat.area];
    if (!cfg) continue;
    const umkmPct = stat.umkmCoverage;
    const expansionStatus =
      umkmPct >= 70 ? ("open" as const)
      : umkmPct >= 30 ? ("conditional" as const)
      : ("closed" as const);
    result.push({
      id: cfg.id,
      name: cfg.name,
      shortName: cfg.shortName,
      storeCount: stat.totalStores,
      activeUMKM: stat.umkmAktif,
      promotionInstalled: stat.saranaPromosi,
      promotionTotal: stat.totalStores,
      expansionStatus,
      pksStatus: cfg.pksStatus,
      coordinates: cfg.coordinates,
      trend: cfg.trend,
      trendValue: cfg.trendValue,
      participants: cfg.participants,
      mdProgress: cfg.mdProgress,
      activeItems: cfg.activeItems,
      newStores: cfg.newStores,
    });
  }
  return result;
}

export const regions: Region[] = buildRegions(areaStats);

export const storeDistribution: StoreDistribution[] = [...regions]
  .sort((a, b) => b.storeCount - a.storeCount)
  .map((r) => ({
    region: r.name,
    count: r.storeCount,
    percentage: Math.round((r.storeCount / kpiSummary.totalStores) * 100),
  }));

export const expansionChartData: ExpansionChartData[] = [
  { name: "Open", value: regions.filter((r) => r.expansionStatus === "open").length, color: "#16a34a" },
  { name: "Conditional", value: regions.filter((r) => r.expansionStatus === "conditional").length, color: "#d97706" },
  { name: "Closed", value: regions.filter((r) => r.expansionStatus === "closed").length, color: "#dc2626" },
];

export const umkmChartData = regions.map((r) => ({
  region: r.shortName,
  active: r.activeUMKM,
  inactive: r.storeCount - r.activeUMKM,
}));

// Insight cards computed from real data
const byUMKM = [...regions].sort((a, b) => b.activeUMKM - a.activeUMKM);
const byStore = [...regions].sort((a, b) => b.storeCount - a.storeCount);
const byLowest = [...regions].sort((a, b) => a.mdProgress - b.mdProgress);
const byExpansion = [...regions].sort(
  (a, b) => (a.storeCount - a.activeUMKM) - (b.storeCount - b.activeUMKM)
).reverse();

export const insightCards: InsightCard[] = [
  {
    id: "most-active",
    title: "Most Active Region",
    value: byUMKM[0]?.name ?? "–",
    description: `Highest UMKM count — ${byUMKM[0]?.activeUMKM} toko aktif this quarter`,
    type: "best",
    region: byUMKM[0]?.id ?? "",
  },
  {
    id: "lowest-dev",
    title: "Lowest Development",
    value: byLowest[0]?.name ?? "–",
    description: `Only ${byLowest[0]?.mdProgress}% MD progress — needs immediate attention`,
    type: "worst",
    region: byLowest[0]?.id ?? "",
  },
  {
    id: "highest-store",
    title: "Highest Store Count",
    value: byStore[0]?.name ?? "–",
    description: `${byStore[0]?.storeCount} stores with ${Math.round((byStore[0]?.promotionInstalled / byStore[0]?.storeCount) * 100)}% promotion coverage`,
    type: "highest",
    region: byStore[0]?.id ?? "",
  },
  {
    id: "priority-expansion",
    title: "Priority Expansion",
    value: byExpansion[0]?.name ?? "–",
    description: `${byExpansion[0]?.storeCount - byExpansion[0]?.activeUMKM} toko belum UMKM — peluang ekspansi terbesar`,
    type: "priority",
    region: byExpansion[0]?.id ?? "",
  },
];

export const expansionTimeline: TimelineEntry[] = [
  {
    regionId: "palu",
    regionName: "Palu",
    newStores: ["Palu Timur 3", "Palu Barat 7", "Palu Selatan 2"],
    targetDate: "Q3 2025",
    status: "in_progress",
  },
  {
    regionId: "parigi-moutong",
    regionName: "Parigi Moutong",
    newStores: ["Parigi 3", "Moutong 2"],
    targetDate: "Q3 2025",
    status: "in_progress",
  },
  {
    regionId: "donggala",
    regionName: "Donggala",
    newStores: ["Donggala Pusat 2", "Balaesang 1"],
    targetDate: "Q4 2025",
    status: "planned",
  },
  {
    regionId: "banggai",
    regionName: "Banggai",
    newStores: ["Luwuk 2", "Batui 1"],
    targetDate: "Q4 2025",
    status: "planned",
  },
  {
    regionId: "poso",
    regionName: "Poso",
    newStores: ["Poso Kota 1"],
    targetDate: "Q1 2026",
    status: "planned",
  },
  {
    regionId: "tolitoli",
    regionName: "Toli-Toli",
    newStores: ["Tolitoli 1"],
    targetDate: "Q1 2026",
    status: "planned",
  },
  {
    regionId: "sigi",
    regionName: "Sigi",
    newStores: ["Sigi Biromaru 1"],
    targetDate: "Q2 2026",
    status: "planned",
  },
];

export const socializationData: SocializationRow[] = regions.map((r) => ({
  id: r.id,
  region: r.name,
  participants: r.participants,
  mdProgress: r.mdProgress,
  activeUMKM: r.activeUMKM,
  activeItems: r.activeItems,
}));

// Monthly trend anchored to real totals at Jul
export const monthlyTrendData = [
  { month: "Jan", stores: Math.round(kpiSummary.totalStores * 0.87), umkm: Math.round(kpiSummary.umkmAktif * 0.72) },
  { month: "Feb", stores: Math.round(kpiSummary.totalStores * 0.89), umkm: Math.round(kpiSummary.umkmAktif * 0.76) },
  { month: "Mar", stores: Math.round(kpiSummary.totalStores * 0.91), umkm: Math.round(kpiSummary.umkmAktif * 0.80) },
  { month: "Apr", stores: Math.round(kpiSummary.totalStores * 0.93), umkm: Math.round(kpiSummary.umkmAktif * 0.85) },
  { month: "May", stores: Math.round(kpiSummary.totalStores * 0.95), umkm: Math.round(kpiSummary.umkmAktif * 0.89) },
  { month: "Jun", stores: Math.round(kpiSummary.totalStores * 0.98), umkm: Math.round(kpiSummary.umkmAktif * 0.94) },
  { month: "Jul", stores: kpiSummary.totalStores, umkm: kpiSummary.umkmAktif },
];

// Builder for dashboard home when DB data is available
export function buildDashboardData(stats: AreaStat[], kpi: KPISummary) {
  const builtRegions = buildRegions(stats);

  const builtStoreDistribution: StoreDistribution[] = [...builtRegions]
    .sort((a, b) => b.storeCount - a.storeCount)
    .map((r) => ({
      region: r.name,
      count: r.storeCount,
      percentage: Math.round((r.storeCount / kpi.totalStores) * 100),
    }));

  const builtExpansionChartData: ExpansionChartData[] = [
    { name: "Open", value: builtRegions.filter((r) => r.expansionStatus === "open").length, color: "#16a34a" },
    { name: "Conditional", value: builtRegions.filter((r) => r.expansionStatus === "conditional").length, color: "#d97706" },
    { name: "Closed", value: builtRegions.filter((r) => r.expansionStatus === "closed").length, color: "#dc2626" },
  ];

  const builtUmkmChartData = builtRegions.map((r) => ({
    region: r.shortName,
    active: r.activeUMKM,
    inactive: r.storeCount - r.activeUMKM,
  }));

  const byUMKM = [...builtRegions].sort((a, b) => b.activeUMKM - a.activeUMKM);
  const byStore = [...builtRegions].sort((a, b) => b.storeCount - a.storeCount);
  const byLowest = [...builtRegions].sort((a, b) => a.mdProgress - b.mdProgress);
  const byExpansion = [...builtRegions].sort(
    (a, b) => (a.storeCount - a.activeUMKM) - (b.storeCount - b.activeUMKM)
  ).reverse();

  const builtInsightCards: InsightCard[] = [
    {
      id: "most-active",
      title: "Most Active Region",
      value: byUMKM[0]?.name ?? "–",
      description: `Highest UMKM count — ${byUMKM[0]?.activeUMKM} toko aktif this quarter`,
      type: "best",
      region: byUMKM[0]?.id ?? "",
    },
    {
      id: "lowest-dev",
      title: "Lowest Development",
      value: byLowest[0]?.name ?? "–",
      description: `Only ${byLowest[0]?.mdProgress}% MD progress — needs immediate attention`,
      type: "worst",
      region: byLowest[0]?.id ?? "",
    },
    {
      id: "highest-store",
      title: "Highest Store Count",
      value: byStore[0]?.name ?? "–",
      description: `${byStore[0]?.storeCount} stores with ${Math.round((byStore[0]?.promotionInstalled / byStore[0]?.storeCount) * 100)}% promotion coverage`,
      type: "highest",
      region: byStore[0]?.id ?? "",
    },
    {
      id: "priority-expansion",
      title: "Priority Expansion",
      value: byExpansion[0]?.name ?? "–",
      description: `${byExpansion[0]?.storeCount - byExpansion[0]?.activeUMKM} toko belum UMKM — peluang ekspansi terbesar`,
      type: "priority",
      region: byExpansion[0]?.id ?? "",
    },
  ];

  const builtSocializationData: SocializationRow[] = builtRegions.map((r) => ({
    id: r.id,
    region: r.name,
    participants: r.participants,
    mdProgress: r.mdProgress,
    activeUMKM: r.activeUMKM,
    activeItems: r.activeItems,
  }));

  const builtMonthlyTrendData = [
    { month: "Jan", stores: Math.round(kpi.totalStores * 0.87), umkm: Math.round(kpi.umkmAktif * 0.72) },
    { month: "Feb", stores: Math.round(kpi.totalStores * 0.89), umkm: Math.round(kpi.umkmAktif * 0.76) },
    { month: "Mar", stores: Math.round(kpi.totalStores * 0.91), umkm: Math.round(kpi.umkmAktif * 0.80) },
    { month: "Apr", stores: Math.round(kpi.totalStores * 0.93), umkm: Math.round(kpi.umkmAktif * 0.85) },
    { month: "May", stores: Math.round(kpi.totalStores * 0.95), umkm: Math.round(kpi.umkmAktif * 0.89) },
    { month: "Jun", stores: Math.round(kpi.totalStores * 0.98), umkm: Math.round(kpi.umkmAktif * 0.94) },
    { month: "Jul", stores: kpi.totalStores, umkm: kpi.umkmAktif },
  ];

  return {
    regions: builtRegions,
    storeDistribution: builtStoreDistribution,
    expansionChartData: builtExpansionChartData,
    umkmChartData: builtUmkmChartData,
    insightCards: builtInsightCards,
    socializationData: builtSocializationData,
    monthlyTrendData: builtMonthlyTrendData,
    expansionTimeline,
  };
}
