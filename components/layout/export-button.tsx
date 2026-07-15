"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { stores } from "@/data/stores";
import { umkmProducts } from "@/data/umkm";
import { areaStats } from "@/data/area-stats";

function toCSV(headers: string[], rows: (string | number)[][]): string {
  const escape = (v: string | number) => {
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  return [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
}

function download(filename: string, csv: string) {
  const bom = "﻿"; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButton() {
  const pathname = usePathname();

  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10);

    if (pathname === "/store") {
      const csv = toCSV(
        ["No", "Kode", "Nama", "Alamat", "Kelurahan", "Kecamatan", "Kabupaten", "Area", "AC", "AM", "UMKM", "Sarana Promosi"],
        stores.map((s) => [s.no, s.kode, s.nama, s.alamat, s.kelurahan, s.kecamatan, s.kabupaten, s.area, s.namaAC, s.namaAM, s.umkm, s.saranaPromosi])
      );
      download(`toko-alfamidi-${date}.csv`, csv);
      return;
    }

    if (pathname === "/umkm") {
      const csv = toCSV(
        ["No", "Wilayah", "Kode Supplier", "Nama Supplier", "PLU", "Nama Produk", "Total PLU", "Status"],
        umkmProducts.map((p) => [p.no, p.wilayah, p.kodeSupp, p.namaSupp, p.plu, p.namaProduk, p.totalPlu, p.keterangan])
      );
      download(`umkm-produk-${date}.csv`, csv);
      return;
    }

    if (pathname === "/expansion") {
      const belum = stores.filter((s) => s.umkm === "Belum");
      const csv = toCSV(
        ["Kode", "Nama", "Wilayah", "Kecamatan", "Kabupaten", "AC", "Sarana Promosi"],
        belum.map((s) => [s.kode, s.nama, s.area, s.kecamatan, s.kabupaten, s.namaAC, s.saranaPromosi])
      );
      download(`ekspansi-umkm-${date}.csv`, csv);
      return;
    }

    if (pathname === "/promotion") {
      const csv = toCSV(
        ["Kode", "Nama", "Wilayah", "Kecamatan", "AM", "UMKM", "Sarana Promosi"],
        stores.map((s) => [s.kode, s.nama, s.area, s.kecamatan, s.namaAM, s.umkm, s.saranaPromosi])
      );
      download(`sarana-promosi-${date}.csv`, csv);
      return;
    }

    if (pathname === "/pks") {
      const csv = toCSV(
        ["Kode", "Nama", "Wilayah", "Kecamatan", "AC", "AM", "UMKM", "Sarana Promosi"],
        stores.map((s) => [s.kode, s.nama, s.area, s.kecamatan, s.namaAC, s.namaAM, s.umkm, s.saranaPromosi])
      );
      download(`pks-mou-${date}.csv`, csv);
      return;
    }

    if (pathname === "/reports" || pathname === "/overview") {
      const csv = toCSV(
        ["Wilayah", "Total Toko", "UMKM Aktif", "Belum UMKM", "Sarana Promosi", "Coverage UMKM %", "Coverage Promosi %"],
        areaStats.map((a) => [
          a.area, a.totalStores, a.umkmAktif,
          a.totalStores - a.umkmAktif, a.saranaPromosi,
          a.umkmCoverage, a.promosiCoverage,
        ])
      );
      download(`rekap-wilayah-${date}.csv`, csv);
      return;
    }

    // Default: ringkasan wilayah
    const csv = toCSV(
      ["Wilayah", "Total Toko", "UMKM Aktif", "Sarana Promosi", "Coverage %"],
      areaStats.map((a) => [a.area, a.totalStores, a.umkmAktif, a.saranaPromosi, a.umkmCoverage])
    );
    download(`dashboard-summary-${date}.csv`, csv);
  };

  return (
    <Button
      size="sm"
      className="h-8 gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white"
      onClick={handleExport}
    >
      <Download className="w-3 h-3" />
      Export
    </Button>
  );
}
