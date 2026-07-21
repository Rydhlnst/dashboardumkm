import { db } from "./index";
import { stores, umkmProducts, areaSettings } from "./schema";
import { eq, sql, count, max } from "drizzle-orm";
import type {
  StoreInput,
  UMKMProductInput,
  AreaSettingInput,
} from "@/lib/validations";

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

export async function getStoreById(id: number) {
  const [row] = await db.select().from(stores).where(eq(stores.id, id));
  return row ?? null;
}

export async function createStore(data: StoreInput) {
  const [{ maxNo }] = await db.select({ maxNo: max(stores.no) }).from(stores);
  const no = (maxNo ?? 0) + 1;
  const [row] = await db.insert(stores).values({ no, ...data }).returning();
  return row;
}

export async function updateStore(id: number, data: StoreInput) {
  const [row] = await db.update(stores).set(data).where(eq(stores.id, id)).returning();
  return row;
}

export async function deleteStore(id: number) {
  await db.delete(stores).where(eq(stores.id, id));
}

export async function getUMKMProductById(id: number) {
  const [row] = await db.select().from(umkmProducts).where(eq(umkmProducts.id, id));
  return row ?? null;
}

export async function createUMKMProduct(data: UMKMProductInput) {
  const [{ maxNo }] = await db.select({ maxNo: max(umkmProducts.no) }).from(umkmProducts);
  const no = (maxNo ?? 0) + 1;
  const [row] = await db.insert(umkmProducts).values({ no, ...data }).returning();
  return row;
}

export async function updateUMKMProduct(id: number, data: UMKMProductInput) {
  const [row] = await db.update(umkmProducts).set(data).where(eq(umkmProducts.id, id)).returning();
  return row;
}

export async function deleteUMKMProduct(id: number) {
  await db.delete(umkmProducts).where(eq(umkmProducts.id, id));
}

export async function getAreaSettings() {
  return db.select().from(areaSettings).orderBy(areaSettings.area);
}

export async function updateAreaSetting(area: string, data: AreaSettingInput) {
  const [row] = await db
    .update(areaSettings)
    .set(data)
    .where(eq(areaSettings.area, area))
    .returning();
  return row;
}

export async function deleteAreaSetting(area: string) {
  await db.delete(areaSettings).where(eq(areaSettings.area, area));
}

export async function upsertAreaSetting(area: string, data: AreaSettingInput) {
  const existing = await db
    .select()
    .from(areaSettings)
    .where(eq(areaSettings.area, area));
  if (existing.length) {
    return updateAreaSetting(area, data);
  }
  const [row] = await db
    .insert(areaSettings)
    .values({ area, ...data })
    .returning();
  return row;
}

export async function updateStorePromosi(
  id: number,
  status: "Terpasang" | "Belum"
) {
  const [row] = await db
    .update(stores)
    .set({ saranaPromosi: status })
    .where(eq(stores.id, id))
    .returning();
  return row;
}
