import { db } from "./index";
import { stores, umkmProducts } from "./schema";
import { eq, sql, count } from "drizzle-orm";

export async function getStores() {
  return db.select().from(stores).orderBy(stores.no);
}

export async function getUMKMProducts() {
  return db.select().from(umkmProducts).orderBy(umkmProducts.no);
}

export async function getAreaStats() {
  const rows = await db
    .select({
      area: stores.area,
      totalStores: count(stores.id),
      umkmAktif: sql<number>`count(case when ${stores.umkm} = 'Aktif' then 1 end)::int`,
      saranaPromosi: sql<number>`count(case when ${stores.saranaPromosi} = 'Terpasang' then 1 end)::int`,
    })
    .from(stores)
    .groupBy(stores.area)
    .orderBy(sql`count(${stores.id}) desc`);

  return rows.map((r) => ({
    area: r.area,
    totalStores: Number(r.totalStores),
    umkmAktif: Number(r.umkmAktif),
    saranaPromosi: Number(r.saranaPromosi),
    umkmCoverage: Math.round((Number(r.umkmAktif) / Number(r.totalStores)) * 100),
    promosiCoverage: Math.round((Number(r.saranaPromosi) / Number(r.totalStores)) * 100),
  }));
}

export async function getKPISummary() {
  const [storeStats] = await db
    .select({
      totalStores: count(stores.id),
      umkmAktif: sql<number>`count(case when ${stores.umkm} = 'Aktif' then 1 end)::int`,
      saranaPromosiTerpasang: sql<number>`count(case when ${stores.saranaPromosi} = 'Terpasang' then 1 end)::int`,
      totalAreas: sql<number>`count(distinct ${stores.area})::int`,
    })
    .from(stores);

  const [productStats] = await db
    .select({
      totalProducts: count(umkmProducts.id),
      suppliersAktif: sql<number>`count(distinct case when ${umkmProducts.keterangan} = 'AKTIF' then ${umkmProducts.kodeSupp} end)::int`,
    })
    .from(umkmProducts);

  return {
    totalAreas: Number(storeStats.totalAreas),
    totalStores: Number(storeStats.totalStores),
    umkmAktif: Number(storeStats.umkmAktif),
    saranaPromosiTerpasang: Number(storeStats.saranaPromosiTerpasang),
    totalProducts: Number(productStats.totalProducts),
    suppliersAktif: Number(productStats.suppliersAktif),
  };
}

export async function getStoresByArea(area: string) {
  return db.select().from(stores).where(eq(stores.area, area)).orderBy(stores.no);
}
