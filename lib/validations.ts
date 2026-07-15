import { z } from "zod/v4";

export const StoreSchema = z.object({
  kode: z.string().min(1, "Kode wajib diisi").max(20, "Kode maks 20 karakter"),
  nama: z.string().min(1, "Nama toko wajib diisi").max(255),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  kelurahan: z.string().min(1, "Kelurahan wajib diisi").max(255),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi").max(255),
  kabupaten: z.string().min(1, "Kabupaten wajib diisi").max(255),
  area: z.string().min(1, "Area wajib diisi").max(100),
  namaAC: z.string().min(1, "Nama AC wajib diisi").max(255),
  namaAM: z.string().min(1, "Nama AM wajib diisi").max(255),
  umkm: z.enum(["Aktif", "Belum"]),
  saranaPromosi: z.enum(["Terpasang", "Belum"]),
});

export const UMKMProductSchema = z.object({
  wilayah: z.string().min(1, "Wilayah wajib diisi").max(100),
  kodeSupp: z.string().min(1, "Kode supplier wajib diisi").max(50),
  namaSupp: z.string().min(1, "Nama supplier wajib diisi").max(255),
  plu: z.coerce.number().int("PLU harus berupa angka").positive("PLU harus positif"),
  namaProduk: z.string().min(1, "Nama produk wajib diisi").max(255),
  totalPlu: z.coerce.number().int("Total PLU harus berupa angka").nonnegative("Tidak boleh negatif"),
  keterangan: z.enum(["AKTIF", "UMKM POLITIS", "TIDAK AKTIF"]),
});

export type StoreInput = z.infer<typeof StoreSchema>;
export type UMKMProductInput = z.infer<typeof UMKMProductSchema>;
