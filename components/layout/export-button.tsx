"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

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
  const bom = "﻿";
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
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const date = new Date().toISOString().slice(0, 10);

    try {
      if (pathname === "/store" || pathname === "/expansion" || pathname === "/pks" || pathname === "/promotion") {
        const res = await fetch("/api/export/stores");
        const stores = await res.json();

        if (pathname === "/store") {
          const csv = toCSV(
            ["No", "Kode", "Nama", "Alamat", "Kelurahan", "Kecamatan", "Kabupaten", "Area", "AC", "AM", "UMKM", "Sarana Promosi"],
            stores.map((s: Record<string, unknown>) => [s.no, s.kode, s.nama, s.alamat, s.kelurahan, s.kecamatan, s.kabupaten, s.area, s.namaAC, s.namaAM, s.umkm, s.saranaPromosi])
          );
          download(`toko-alfamidi-${date}.csv`, csv);
        } else if (pathname === "/expansion") {
          const belum = stores.filter((s: Record<string, unknown>) => s.umkm === "Belum");
          const csv = toCSV(
            ["Kode", "Nama", "Wilayah", "Kecamatan", "Kabupaten", "AC", "Sarana Promosi"],
            belum.map((s: Record<string, unknown>) => [s.kode, s.nama, s.area, s.kecamatan, s.kabupaten, s.namaAC, s.saranaPromosi])
          );
          download(`ekspansi-umkm-${date}.csv`, csv);
        } else if (pathname === "/promotion") {
          const csv = toCSV(
            ["Kode", "Nama", "Wilayah", "Kecamatan", "AM", "UMKM", "Sarana Promosi"],
            stores.map((s: Record<string, unknown>) => [s.kode, s.nama, s.area, s.kecamatan, s.namaAM, s.umkm, s.saranaPromosi])
          );
          download(`sarana-promosi-${date}.csv`, csv);
        } else if (pathname === "/pks") {
          const csv = toCSV(
            ["Kode", "Nama", "Wilayah", "Kecamatan", "AC", "AM", "UMKM", "Sarana Promosi"],
            stores.map((s: Record<string, unknown>) => [s.kode, s.nama, s.area, s.kecamatan, s.namaAC, s.namaAM, s.umkm, s.saranaPromosi])
          );
          download(`pks-mou-${date}.csv`, csv);
        }
        return;
      }

      if (pathname === "/umkm") {
        const res = await fetch("/api/export/umkm");
        const products = await res.json();
        const csv = toCSV(
          ["No", "Wilayah", "Kode Supplier", "Nama Supplier", "PLU", "Nama Produk", "Total PLU", "Status"],
          products.map((p: Record<string, unknown>) => [p.no, p.wilayah, p.kodeSupp, p.namaSupp, p.plu, p.namaProduk, p.totalPlu, p.keterangan])
        );
        download(`umkm-produk-${date}.csv`, csv);
        return;
      }

      if (pathname === "/reports" || pathname === "/overview" || pathname === "/") {
        const res = await fetch("/api/export/stores");
        const stores = await res.json();
        const areaMap = new Map<string, { total: number; umkm: number; promo: number }>();
        for (const s of stores) {
          const a = areaMap.get(s.area) ?? { total: 0, umkm: 0, promo: 0 };
          a.total++;
          if (s.umkm === "Aktif") a.umkm++;
          if (s.saranaPromosi === "Terpasang") a.promo++;
          areaMap.set(s.area, a);
        }
        const csv = toCSV(
          ["Wilayah", "Total Toko", "UMKM Aktif", "Belum UMKM", "Sarana Promosi", "Coverage UMKM %", "Coverage Promosi %"],
          Array.from(areaMap.entries()).map(([area, v]) => [
            area, v.total, v.umkm, v.total - v.umkm, v.promo,
            Math.round((v.umkm / v.total) * 100),
            Math.round((v.promo / v.total) * 100),
          ])
        );
        download(`rekap-wilayah-${date}.csv`, csv);
        return;
      }

      // Default fallback
      const res = await fetch("/api/export/stores");
      const stores = await res.json();
      const csv = toCSV(
        ["Kode", "Nama", "Area", "UMKM", "Sarana Promosi"],
        stores.map((s: Record<string, unknown>) => [s.kode, s.nama, s.area, s.umkm, s.saranaPromosi])
      );
      download(`dashboard-summary-${date}.csv`, csv);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      className="h-8 gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
      Export
    </Button>
  );
}
