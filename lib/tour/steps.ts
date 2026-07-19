import type { Step } from "react-joyride";

export interface AutofillValue {
  selector: string;
  value: string;
  kind: "input" | "select";
}

export interface TourConfig {
  key: string;
  steps: Step[];
  autofill?: Record<number, AutofillValue>;
  verify?: Record<string, string>;
}

const baseStepDefaults: Partial<Step> = {
  spotlightPadding: 6,
  showProgress: true,
  buttons: ["back", "skip", "primary"],
  overlayClickAction: false,
  primaryColor: "#dc2626",
  textColor: "#111",
  zIndex: 10000,
  arrowColor: "#fff",
};

export const TOURS: Record<string, TourConfig> = {
  dashboard: {
    key: "dashboard",
    steps: [
      {
        ...baseStepDefaults,
        target: '[data-tour="sidebar-nav"]',
        title: "Navigasi Utama",
        content:
          "Semua halaman dashboard bisa diakses dari sidebar ini: Overview, Wilayah, UMKM, PKS, Toko, Promosi, sampai Laporan.",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="topbar-tour"]',
        title: "Tombol Tutorial",
        content:
          "Kamu bisa mengaktif/mematikan tutorial kapan saja dari tombol ini. Preferensi akan tersimpan otomatis.",
        placement: "bottom",
      },
    ],
  },

  umkm: {
    key: "umkm",
    steps: [
      {
        ...baseStepDefaults,
        target: '[data-tour="umkm-stats"]',
        title: "Ringkasan UMKM",
        content:
          "Ringkasan total PLU, PLU aktif, UMKM politis, dan yang tidak aktif ditampilkan di sini.",
        placement: "bottom",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="umkm-search"]',
        title: "Pencarian",
        content:
          "Cari supplier atau produk dengan cepat. Kolom mendukung pencarian berdasarkan nama supplier, kode, atau nama produk.",
        placement: "bottom",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="umkm-filters"]',
        title: "Filter Wilayah & Status",
        content: "Persempit hasil dengan filter wilayah dan status PLU.",
        placement: "bottom",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="umkm-add"]',
        title: "Tambah PLU Baru",
        content:
          "Klik tombol ini untuk menambah PLU baru. Selanjutnya kita akan lihat cara mengisi formnya.",
        placement: "left",
      },
    ],
  },

  "umkm-new": {
    key: "umkm-new",
    steps: [
      {
        ...baseStepDefaults,
        target: '[data-tour="form-wilayah"]',
        title: "1. Pilih Wilayah",
        content:
          "Pilih wilayah supplier. Tutorial akan mengisi otomatis untuk demonstrasi.",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="form-kodeSupp"]',
        title: "2. Kode Supplier",
        content: "Isi kode unik supplier, contoh: SUP-DEMO.",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="form-namaSupp"]',
        title: "3. Nama Supplier",
        content: "Masukkan nama lengkap supplier.",
        placement: "top",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="form-plu"]',
        title: "4. PLU",
        content: "Kode PLU produk (numerik).",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="form-totalPlu"]',
        title: "5. Total PLU",
        content: "Total PLU yang dimiliki supplier ini.",
        placement: "left",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="form-namaProduk"]',
        title: "6. Nama Produk",
        content: "Nama produk UMKM.",
        placement: "top",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="form-keterangan"]',
        title: "7. Status",
        content: "Pilih status produk: Aktif, UMKM Politis, atau Tidak Aktif.",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="form-verify"]',
        title: "8. Verifikasi Data",
        content:
          "Semua field sudah terisi. Pastikan data tampil benar sebelum disimpan.",
        placement: "top",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="form-submit"]',
        title: "9. Simpan",
        content:
          "Klik tombol ini untuk menyimpan PLU baru ke database. Selesai!",
        placement: "top",
      },
    ],
    autofill: {
      0: { selector: '[data-tour="form-wilayah"] select', value: "PALU", kind: "select" },
      1: { selector: '[data-tour="form-kodeSupp"] input', value: "SUP-DEMO", kind: "input" },
      2: { selector: '[data-tour="form-namaSupp"] input', value: "Supplier Demo Tutorial", kind: "input" },
      3: { selector: '[data-tour="form-plu"] input', value: "99999", kind: "input" },
      4: { selector: '[data-tour="form-totalPlu"] input', value: "5", kind: "input" },
      5: { selector: '[data-tour="form-namaProduk"] input', value: "Produk Demo UMKM", kind: "input" },
      6: { selector: '[data-tour="form-keterangan"] select', value: "AKTIF", kind: "select" },
    },
    verify: {
      wilayah: "PALU",
      kodeSupp: "SUP-DEMO",
      namaSupp: "Supplier Demo Tutorial",
      plu: "99999",
      totalPlu: "5",
      namaProduk: "Produk Demo UMKM",
      keterangan: "AKTIF",
    },
  },

  store: {
    key: "store",
    steps: [
      {
        ...baseStepDefaults,
        target: '[data-tour="store-stats"]',
        title: "Ringkasan Toko",
        content: "Ringkasan jumlah toko, toko aktif UMKM, dan sarana promosi terpasang.",
        placement: "bottom",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="store-search"]',
        title: "Pencarian Toko",
        content: "Cari toko berdasarkan kode, nama, atau alamat.",
        placement: "bottom",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="store-add"]',
        title: "Tambah Toko",
        content: "Klik untuk menambah toko baru.",
        placement: "left",
      },
    ],
  },

  "store-new": {
    key: "store-new",
    steps: [
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-kode"]',
        title: "1. Kode Toko",
        content: "Isi kode toko unik.",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-nama"]',
        title: "2. Nama Toko",
        content: "Nama lengkap toko.",
        placement: "top",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-alamat"]',
        title: "3. Alamat",
        content: "Alamat lengkap toko.",
        placement: "top",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-kelurahan"]',
        title: "4. Kelurahan",
        content: "Nama kelurahan.",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-kecamatan"]',
        title: "5. Kecamatan",
        content: "Nama kecamatan.",
        placement: "left",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-kabupaten"]',
        title: "6. Kabupaten/Kota",
        content: "Nama kabupaten/kota.",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-area"]',
        title: "7. Area",
        content: "Pilih area operasional.",
        placement: "left",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-namaAC"]',
        title: "8. Area Coordinator",
        content: "Nama AC yang bertanggung jawab.",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-namaAM"]',
        title: "9. Area Manager",
        content: "Nama AM yang bertanggung jawab.",
        placement: "left",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-umkm"]',
        title: "10. Status UMKM",
        content: "Apakah toko sudah menjalankan program UMKM.",
        placement: "right",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-saranaPromosi"]',
        title: "11. Sarana Promosi",
        content: "Status sarana promosi UMKM di toko.",
        placement: "left",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-verify"]',
        title: "12. Verifikasi Data",
        content: "Semua field sudah terisi. Pastikan data benar.",
        placement: "top",
      },
      {
        ...baseStepDefaults,
        target: '[data-tour="sform-submit"]',
        title: "13. Simpan",
        content: "Klik untuk menyimpan toko baru.",
        placement: "top",
      },
    ],
    autofill: {
      0: { selector: '[data-tour="sform-kode"] input', value: "ALF-DEMO", kind: "input" },
      1: { selector: '[data-tour="sform-nama"] input', value: "Alfamidi Demo Palu", kind: "input" },
      2: { selector: '[data-tour="sform-alamat"] input', value: "Jl. Demo Tutorial No. 1", kind: "input" },
      3: { selector: '[data-tour="sform-kelurahan"] input', value: "Kelurahan Demo", kind: "input" },
      4: { selector: '[data-tour="sform-kecamatan"] input', value: "Kecamatan Demo", kind: "input" },
      5: { selector: '[data-tour="sform-kabupaten"] input', value: "Palu", kind: "input" },
      6: { selector: '[data-tour="sform-area"] select', value: "PALU", kind: "select" },
      7: { selector: '[data-tour="sform-namaAC"] input', value: "Budi Coordinator", kind: "input" },
      8: { selector: '[data-tour="sform-namaAM"] input', value: "Siti Manager", kind: "input" },
      9: { selector: '[data-tour="sform-umkm"] select', value: "Aktif", kind: "select" },
      10: { selector: '[data-tour="sform-saranaPromosi"] select', value: "Terpasang", kind: "select" },
    },
    verify: {
      kode: "ALF-DEMO",
      nama: "Alfamidi Demo Palu",
      alamat: "Jl. Demo Tutorial No. 1",
      kelurahan: "Kelurahan Demo",
      kecamatan: "Kecamatan Demo",
      kabupaten: "Palu",
      area: "PALU",
      namaAC: "Budi Coordinator",
      namaAM: "Siti Manager",
      umkm: "Aktif",
      saranaPromosi: "Terpasang",
    },
  },
};

export function tourKeyForPath(pathname: string): string | null {
  if (pathname === "/" || pathname === "") return "dashboard";
  if (pathname.startsWith("/umkm/new")) return "umkm-new";
  if (pathname.startsWith("/umkm")) return "umkm";
  if (pathname.startsWith("/store/new")) return "store-new";
  if (pathname.startsWith("/store")) return "store";
  return "dashboard";
}
