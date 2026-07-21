import { pgTable, serial, integer, varchar, text, json, doublePrecision } from "drizzle-orm/pg-core";

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  no: integer("no").notNull(),
  kode: varchar("kode", { length: 20 }).notNull(),
  nama: varchar("nama", { length: 255 }).notNull(),
  alamat: text("alamat").notNull(),
  kelurahan: varchar("kelurahan", { length: 255 }).notNull(),
  kecamatan: varchar("kecamatan", { length: 255 }).notNull(),
  kabupaten: varchar("kabupaten", { length: 255 }).notNull(),
  area: varchar("area", { length: 100 }).notNull(),
  namaAC: varchar("nama_ac", { length: 255 }).notNull(),
  namaAM: varchar("nama_am", { length: 255 }).notNull(),
  umkm: varchar("umkm", { length: 10 }).notNull().$type<"Aktif" | "Belum">(),
  saranaPromosi: varchar("sarana_promosi", { length: 20 }).notNull().$type<"Terpasang" | "Belum">(),
});

export const umkmProducts = pgTable("umkm_products", {
  id: serial("id").primaryKey(),
  no: integer("no").notNull(),
  wilayah: varchar("wilayah", { length: 100 }).notNull(),
  kodeSupp: varchar("kode_supp", { length: 50 }).notNull(),
  namaSupp: varchar("nama_supp", { length: 255 }).notNull(),
  plu: integer("plu").notNull(),
  namaProduk: varchar("nama_produk", { length: 255 }).notNull(),
  totalPlu: integer("total_plu").notNull(),
  keterangan: varchar("keterangan", { length: 50 }).notNull().$type<"AKTIF" | "UMKM POLITIS" | "TIDAK AKTIF">(),
});

export const areaSettings = pgTable("area_settings", {
  id: serial("id").primaryKey(),
  area: varchar("area", { length: 100 }).notNull().unique(),
  expansionStatus: varchar("expansion_status", { length: 20 })
    .notNull()
    .$type<"open" | "conditional" | "closed">()
    .default("closed"),
  pksStatus: varchar("pks_status", { length: 20 })
    .notNull()
    .$type<"available" | "not_available">()
    .default("not_available"),
  timelineStatus: varchar("timeline_status", { length: 20 })
    .notNull()
    .$type<"planned" | "in_progress" | "completed">()
    .default("planned"),
  targetDate: varchar("target_date", { length: 30 }).notNull().default(""),
  newStores: json("new_stores").$type<string[]>().notNull().default([]),
  notes: text("notes").notNull().default(""),
  lat: doublePrecision("lat").notNull().default(0),
  lng: doublePrecision("lng").notNull().default(0),
  shortName: varchar("short_name", { length: 20 }).notNull().default(""),
  trend: varchar("trend", { length: 10 })
    .notNull()
    .$type<"up" | "down" | "stable">()
    .default("stable"),
  trendValue: doublePrecision("trend_value").notNull().default(0),
  participants: integer("participants").notNull().default(0),
  mdProgress: integer("md_progress").notNull().default(0),
  activeItems: integer("active_items").notNull().default(0),
});

export type Store = typeof stores.$inferSelect;
export type UMKMProduct = typeof umkmProducts.$inferSelect;
export type AreaSetting = typeof areaSettings.$inferSelect;
