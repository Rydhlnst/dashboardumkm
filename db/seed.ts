import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { stores as storesData } from "../data/stores";
import { umkmProducts as umkmData } from "../data/umkm";

// Fixed classification from Alfamidi brief (Hijau/Kuning/Merah).
const AREA_SETTINGS_SEED: Array<{
  area: string;
  expansionStatus: "open" | "conditional" | "closed";
  pksStatus: "available" | "not_available";
  timelineStatus: "planned" | "in_progress" | "completed";
  targetDate: string;
  newStores: string[];
}> = [
  { area: "DONGGALA",       expansionStatus: "open",        pksStatus: "available",     timelineStatus: "planned",     targetDate: "Q4 2025", newStores: ["Donggala Pusat 2", "Balaesang 1"] },
  { area: "PARIGI MOUTONG", expansionStatus: "open",        pksStatus: "available",     timelineStatus: "in_progress", targetDate: "Q3 2025", newStores: ["Parigi 3", "Moutong 2"] },
  { area: "BUOL",           expansionStatus: "open",        pksStatus: "not_available", timelineStatus: "planned",     targetDate: "Q2 2026", newStores: [] },
  { area: "TOLI-TOLI",      expansionStatus: "open",        pksStatus: "available",     timelineStatus: "planned",     targetDate: "Q1 2026", newStores: ["Tolitoli 1"] },
  { area: "POHUWATO",       expansionStatus: "open",        pksStatus: "not_available", timelineStatus: "planned",     targetDate: "Q2 2026", newStores: [] },
  { area: "TOJO UNA-UNA",   expansionStatus: "open",        pksStatus: "not_available", timelineStatus: "planned",     targetDate: "Q2 2026", newStores: [] },
  { area: "BANGGAI",        expansionStatus: "open",        pksStatus: "available",     timelineStatus: "planned",     targetDate: "Q4 2025", newStores: ["Luwuk 2", "Batui 1"] },
  { area: "PALU",           expansionStatus: "conditional", pksStatus: "available",     timelineStatus: "in_progress", targetDate: "Q3 2025", newStores: ["Palu Timur 3", "Palu Barat 7", "Palu Selatan 2"] },
  { area: "SIGI",           expansionStatus: "conditional", pksStatus: "available",     timelineStatus: "planned",     targetDate: "Q2 2026", newStores: ["Sigi Biromaru 1"] },
  { area: "PASANGKAYU",     expansionStatus: "conditional", pksStatus: "not_available", timelineStatus: "planned",     targetDate: "Q2 2026", newStores: [] },
  { area: "POSO",           expansionStatus: "closed",      pksStatus: "not_available", timelineStatus: "planned",     targetDate: "Q1 2026", newStores: ["Poso Kota 1"] },
  { area: "MAMUJU",         expansionStatus: "closed",      pksStatus: "not_available", timelineStatus: "planned",     targetDate: "Q2 2026", newStores: [] },
];

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set in environment");

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding stores...");
  await db.delete(schema.stores);
  await db.insert(schema.stores).values(
    storesData.map((s) => ({
      no: s.no,
      kode: s.kode,
      nama: s.nama,
      alamat: s.alamat,
      kelurahan: s.kelurahan,
      kecamatan: s.kecamatan,
      kabupaten: s.kabupaten,
      area: s.area,
      namaAC: s.namaAC,
      namaAM: s.namaAM,
      umkm: s.umkm,
      saranaPromosi: s.saranaPromosi,
    }))
  );
  console.log(`✅ Seeded ${storesData.length} stores`);

  console.log("🌱 Seeding UMKM products...");
  await db.delete(schema.umkmProducts);
  await db.insert(schema.umkmProducts).values(
    umkmData.map((p) => ({
      no: p.no,
      wilayah: p.wilayah,
      kodeSupp: p.kodeSupp,
      namaSupp: p.namaSupp,
      plu: p.plu,
      namaProduk: p.namaProduk,
      totalPlu: p.totalPlu,
      keterangan: p.keterangan,
    }))
  );
  console.log(`✅ Seeded ${umkmData.length} UMKM products`);

  console.log("🌱 Seeding area settings...");
  await db.delete(schema.areaSettings);
  await db.insert(schema.areaSettings).values(
    AREA_SETTINGS_SEED.map((s) => ({
      area: s.area,
      expansionStatus: s.expansionStatus,
      pksStatus: s.pksStatus,
      timelineStatus: s.timelineStatus,
      targetDate: s.targetDate,
      newStores: s.newStores,
      notes: "",
    }))
  );
  console.log(`✅ Seeded ${AREA_SETTINGS_SEED.length} area settings`);

  console.log("✨ Done!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
