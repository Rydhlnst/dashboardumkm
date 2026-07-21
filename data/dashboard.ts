import type {
  Region,
  StoreDistribution,
  ExpansionChartData,
  InsightCard,
  TimelineEntry,
  SocializationRow,
  ExpansionStatus,
  PKSStatus,
} from "@/types";
import type { AreaStat } from "./area-stats";
import { areaStats, kpiSummary } from "./area-stats";
import type { AreaSetting } from "@/db/schema";

type AreaSettingLike = {
  area: string;
  expansionStatus: ExpansionStatus;
  pksStatus: PKSStatus;
  timelineStatus: "planned" | "in_progress" | "completed";
  targetDate: string;
  newStores: string[];
  lat?: number | null;
  lng?: number | null;
  shortName?: string | null;
  trend?: "up" | "down" | "stable" | null;
  trendValue?: number | null;
  participants?: number | null;
  mdProgress?: number | null;
  activeItems?: number | null;
};

type KPISummary = {
  totalAreas: number;
  totalStores: number;
  umkmAktif: number;
  saranaPromosiTerpasang: number;
  totalProducts: number;
  suppliersAktif: number;
};

// Static seed defaults — used only when the DB row is missing values (fresh install).
// Once area_settings has values, DB always wins.
export const AREA_CFG: Record<string, {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
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
    lat: -0.8917, lng: 119.8707, pksStatus: "available",
    trend: "up", trendValue: 12.4, participants: 156, mdProgress: 82, activeItems: 214,
    newStores: ["Palu Timur 3", "Palu Barat 7", "Palu Selatan 2"],
  },
  "DONGGALA": {
    id: "donggala", name: "Donggala", shortName: "DGL",
    lat: -0.6851, lng: 119.7288, pksStatus: "available",
    trend: "up", trendValue: 8.1, participants: 98, mdProgress: 74, activeItems: 147,
    newStores: ["Donggala Pusat 2", "Balaesang 1"],
  },
  "SIGI": {
    id: "sigi", name: "Sigi", shortName: "SGI",
    lat: -1.4136, lng: 119.9739, pksStatus: "available",
    trend: "up", trendValue: 5.3, participants: 72, mdProgress: 61, activeItems: 89,
    newStores: ["Sigi Biromaru 1"],
  },
  "PARIGI MOUTONG": {
    id: "parigi-moutong", name: "Parigi Moutong", shortName: "PMO",
    lat: -0.4707, lng: 120.1747, pksStatus: "available",
    trend: "stable", trendValue: 1.2, participants: 118, mdProgress: 78, activeItems: 176,
    newStores: ["Parigi 3", "Moutong 2"],
  },
  "POSO": {
    id: "poso", name: "Poso", shortName: "PSO",
    lat: -1.3959, lng: 120.7524, pksStatus: "not_available",
    trend: "down", trendValue: -2.1, participants: 84, mdProgress: 55, activeItems: 102,
    newStores: ["Poso Kota 1"],
  },
  "TOLI-TOLI": {
    id: "tolitoli", name: "Toli-Toli", shortName: "TTL",
    lat: 1.0546, lng: 120.7955, pksStatus: "available",
    trend: "stable", trendValue: 0.8, participants: 76, mdProgress: 68, activeItems: 121,
    newStores: ["Tolitoli 1"],
  },
  "BUOL": {
    id: "buol", name: "Buol", shortName: "BUL",
    lat: 1.1085, lng: 121.4306, pksStatus: "not_available",
    trend: "down", trendValue: -3.2, participants: 42, mdProgress: 35, activeItems: 48,
    newStores: [],
  },
  "BANGGAI": {
    id: "banggai", name: "Banggai", shortName: "BNG",
    lat: -1.3006, lng: 122.7975, pksStatus: "available",
    trend: "up", trendValue: 9.3, participants: 106, mdProgress: 79, activeItems: 158,
    newStores: ["Luwuk 2", "Batui 1"],
  },
  "PASANGKAYU": {
    id: "pasangkayu", name: "Pasangkayu", shortName: "PSK",
    lat: -1.2213, lng: 119.3699, pksStatus: "not_available",
    trend: "stable", trendValue: 0.5, participants: 38, mdProgress: 30, activeItems: 42,
    newStores: [],
  },
  "TOJO UNA-UNA": {
    id: "tojo-una-una", name: "Tojo Una-Una", shortName: "TJU",
    lat: -1.1899, lng: 121.5416, pksStatus: "not_available",
    trend: "down", trendValue: -1.5, participants: 34, mdProgress: 28, activeItems: 36,
    newStores: [],
  },
  "MAMUJU": {
    id: "mamuju", name: "Mamuju", shortName: "MMJ",
    lat: -2.6748, lng: 118.8886, pksStatus: "not_available",
    trend: "stable", trendValue: 0.3, participants: 28, mdProgress: 22, activeItems: 30,
    newStores: [],
  },
  "POHUWATO": {
    id: "pohuwato", name: "Pohuwato", shortName: "PHW",
    lat: 0.7080, lng: 121.5730, pksStatus: "not_available",
    trend: "stable", trendValue: 0.2, participants: 22, mdProgress: 18, activeItems: 24,
    newStores: [],
  },
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Build regions from real data, merging DB area_settings.
// Iterates the UNION of areas seen in stats and settings, so DB-only regions
// (zero stores) still appear on the map.
export function buildRegions(
  stats: AreaStat[],
  settings: AreaSettingLike[] = []
): Region[] {
  const statByArea = new Map(stats.map((s) => [s.area, s]));
  const settingByArea = new Map(settings.map((s) => [s.area, s]));
  const allAreas = new Set<string>([...statByArea.keys(), ...settingByArea.keys()]);
  const result: Region[] = [];
  for (const area of allAreas) {
    const stat = statByArea.get(area) ?? {
      area,
      totalStores: 0,
      umkmAktif: 0,
      saranaPromosi: 0,
      umkmCoverage: 0,
      promosiCoverage: 0,
    };
    const cfg = AREA_CFG[area] ?? {
      id: slugify(area),
      name: titleCase(area),
      shortName: area.slice(0, 3).toUpperCase(),
      lat: 0,
      lng: 0,
      pksStatus: "not_available" as const,
      trend: "stable" as const,
      trendValue: 0,
      participants: 0,
      mdProgress: 0,
      activeItems: 0,
      newStores: [] as string[],
    };
    const setting = settingByArea.get(area);
    const expansionStatus: ExpansionStatus = setting?.expansionStatus ?? "closed";
    const pksStatus: PKSStatus = setting?.pksStatus ?? cfg.pksStatus;
    const newStores = setting?.newStores?.length ? setting.newStores : cfg.newStores;
    // Treat 0 as "unset" for numeric fields — DB defaults are 0 on fresh columns.
    const pick = <T>(v: T | null | undefined, fallback: T): T =>
      v === null || v === undefined ? fallback : v;
    const pickNonZero = (v: number | null | undefined, fallback: number): number =>
      v === null || v === undefined || v === 0 ? fallback : v;
    result.push({
      id: cfg.id,
      name: cfg.name,
      shortName: pick(setting?.shortName, cfg.shortName) || cfg.shortName,
      storeCount: stat.totalStores,
      activeUMKM: stat.umkmAktif,
      promotionInstalled: stat.saranaPromosi,
      promotionTotal: stat.totalStores,
      expansionStatus,
      pksStatus,
      lat: pickNonZero(setting?.lat, cfg.lat),
      lng: pickNonZero(setting?.lng, cfg.lng),
      trend: pick(setting?.trend, cfg.trend),
      trendValue: pick(setting?.trendValue, cfg.trendValue),
      participants: pickNonZero(setting?.participants, cfg.participants),
      mdProgress: pickNonZero(setting?.mdProgress, cfg.mdProgress),
      activeItems: pickNonZero(setting?.activeItems, cfg.activeItems),
      newStores,
    });
  }
  return result;
}

export function buildTimeline(
  stats: AreaStat[],
  settings: AreaSettingLike[]
): TimelineEntry[] {
  const statByArea = new Map(stats.map((s) => [s.area, s]));
  const allAreas = new Set<string>([...statByArea.keys(), ...settings.map((s) => s.area)]);
  const result: TimelineEntry[] = [];
  for (const area of allAreas) {
    const setting = settings.find((s) => s.area === area);
    if (!setting) continue;
    const cfg = AREA_CFG[area];
    const fallbackNewStores = cfg?.newStores ?? [];
    result.push({
      regionId: cfg?.id ?? slugify(area),
      regionName: cfg?.name ?? titleCase(area),
      newStores: setting.newStores?.length ? setting.newStores : fallbackNewStores,
      targetDate: setting.targetDate || "—",
      status: setting.timelineStatus,
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
export function buildDashboardData(
  stats: AreaStat[],
  kpi: KPISummary,
  settings: AreaSettingLike[] = []
) {
  const builtRegions = buildRegions(stats, settings);
  const builtTimeline = settings.length ? buildTimeline(stats, settings) : expansionTimeline;

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
    expansionTimeline: builtTimeline,
  };
}

export type { AreaSetting };
