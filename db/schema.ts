import { pgTable, serial, integer, varchar, text } from "drizzle-orm/pg-core";

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

export type Store = typeof stores.$inferSelect;
export type UMKMProduct = typeof umkmProducts.$inferSelect;
