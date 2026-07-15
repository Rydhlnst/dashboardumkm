import { stores } from "./stores";
import { umkmProducts } from "./umkm";

export interface AreaStat {
  area: string;
  totalStores: number;
  umkmAktif: number;
  saranaPromosi: number;
  umkmCoverage: number;
  promosiCoverage: number;
}

export const areaStats: AreaStat[] = (() => {
  const map = new Map<string, { totalStores: number; umkmAktif: number; saranaPromosi: number }>();
  for (const s of stores) {
    if (!map.has(s.area)) map.set(s.area, { totalStores: 0, umkmAktif: 0, saranaPromosi: 0 });
    const stat = map.get(s.area)!;
    stat.totalStores++;
    if (s.umkm === "Aktif") stat.umkmAktif++;
    if (s.saranaPromosi === "Terpasang") stat.saranaPromosi++;
  }
  return Array.from(map.entries())
    .map(([area, stat]) => ({
      area,
      ...stat,
      umkmCoverage: Math.round((stat.umkmAktif / stat.totalStores) * 100),
      promosiCoverage: Math.round((stat.saranaPromosi / stat.totalStores) * 100),
    }))
    .sort((a, b) => b.totalStores - a.totalStores);
})();

export const kpiSummary = {
  totalAreas: areaStats.length,
  totalStores: stores.length,
  umkmAktif: stores.filter((s) => s.umkm === "Aktif").length,
  saranaPromosiTerpasang: stores.filter((s) => s.saranaPromosi === "Terpasang").length,
  totalProducts: umkmProducts.length,
  suppliersAktif: new Set(
    umkmProducts.filter((p) => p.keterangan === "AKTIF").map((p) => p.kodeSupp)
  ).size,
};
