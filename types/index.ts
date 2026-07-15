export type ExpansionStatus = "open" | "conditional" | "closed";
export type PKSStatus = "available" | "not_available";
export type RegionTrend = "up" | "down" | "stable";

export interface Region {
  id: string;
  name: string;
  shortName: string;
  storeCount: number;
  activeUMKM: number;
  expansionStatus: ExpansionStatus;
  promotionInstalled: number;
  promotionTotal: number;
  pksStatus: PKSStatus;
  coordinates: { x: number; y: number };
  trend: RegionTrend;
  trendValue: number;
  participants: number;
  mdProgress: number;
  activeItems: number;
  newStores: string[];
}

export interface KPIData {
  totalArea: number;
  totalStore: number;
  activeUMKM: number;
  expansionOpen: number;
  trends: {
    totalStore: number;
    activeUMKM: number;
    expansionOpen: number;
  };
}

export interface StoreDistribution {
  region: string;
  count: number;
  percentage: number;
}

export interface UMKMChartData {
  region: string;
  active: number;
  inactive: number;
}

export interface ExpansionChartData {
  name: string;
  value: number;
  color: string;
}

export interface InsightCard {
  id: string;
  title: string;
  value: string;
  description: string;
  type: "best" | "worst" | "highest" | "priority";
  region: string;
}

export interface TimelineEntry {
  regionId: string;
  regionName: string;
  newStores: string[];
  targetDate: string;
  status: "completed" | "in_progress" | "planned";
}

export interface SocializationRow {
  id: string;
  region: string;
  participants: number;
  mdProgress: number;
  activeUMKM: number;
  activeItems: number;
}
