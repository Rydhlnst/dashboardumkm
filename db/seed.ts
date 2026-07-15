import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { stores as storesData } from "../data/stores";
import { umkmProducts as umkmData } from "../data/umkm";

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

  console.log("✨ Done!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
