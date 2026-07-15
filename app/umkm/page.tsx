"use client";

import { useState, useMemo } from "react";
import { umkmProducts, type ProductStatus } from "@/data/umkm";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const WILAYAHS = ["Semua", ...Array.from(new Set(umkmProducts.map((p) => p.wilayah))).sort()];
const STATUS_LABEL: Record<ProductStatus, string> = {
  AKTIF: "Aktif",
  "UMKM POLITIS": "Politis",
  "TIDAK AKTIF": "Tidak Aktif",
};

export default function UMKMPage() {
  const [search, setSearch] = useState("");
  const [wilayahFilter, setWilayahFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState<"Semua" | ProductStatus>("Semua");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return umkmProducts.filter((p) => {
      if (wilayahFilter !== "Semua" && p.wilayah !== wilayahFilter) return false;
      if (statusFilter !== "Semua" && p.keterangan !== statusFilter) return false;
      if (q && !p.namaSupp.toLowerCase().includes(q) && !p.namaProduk.toLowerCase().includes(q) && !p.kodeSupp.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, wilayahFilter, statusFilter]);

  const suppliersInView = new Set(filtered.map((p) => p.kodeSupp)).size;

  const statAktif = umkmProducts.filter((p) => p.keterangan === "AKTIF").length;
  const statPolitis = umkmProducts.filter((p) => p.keterangan === "UMKM POLITIS").length;
  const statTidakAktif = umkmProducts.filter((p) => p.keterangan === "TIDAK AKTIF").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">UMKM</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Daftar produk & supplier UMKM yang terdaftar di sistem
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total PLU", value: umkmProducts.length },
          { label: "PLU Aktif", value: statAktif, color: "text-emerald-600" },
          { label: "UMKM Politis", value: statPolitis, color: "text-amber-600" },
          { label: "Tidak Aktif", value: statTidakAktif, color: "text-red-600" },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="pt-4 pb-3">
              <p className={`text-2xl font-bold tabular-nums ${s.color ?? ""}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cari supplier atau produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <select
          value={wilayahFilter}
          onChange={(e) => setWilayahFilter(e.target.value)}
          className="h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
        >
          {WILAYAHS.map((w) => <option key={w}>{w}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "Semua" | ProductStatus)}
          className="h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
        >
          <option value="Semua">Semua Status</option>
          <option value="AKTIF">Aktif</option>
          <option value="UMKM POLITIS">UMKM Politis</option>
          <option value="TIDAK AKTIF">Tidak Aktif</option>
        </select>
        <span className="text-xs text-muted-foreground">
          {filtered.length} PLU · {suppliersInView} supplier
        </span>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead className="w-20">Kode Supp</TableHead>
              <TableHead>Nama Supplier</TableHead>
              <TableHead className="hidden sm:table-cell">PLU</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead className="hidden md:table-cell">Wilayah</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={`${p.kodeSupp}-${p.plu}`} className="hover:bg-muted/40 border-b border-border/30">
                <TableCell className="font-mono text-[11px] text-muted-foreground">{p.kodeSupp}</TableCell>
                <TableCell className="text-xs font-medium">{p.namaSupp}</TableCell>
                <TableCell className="hidden sm:table-cell font-mono text-[11px] text-muted-foreground">{p.plu}</TableCell>
                <TableCell className="text-xs">{p.namaProduk}</TableCell>
                <TableCell className="hidden md:table-cell text-xs">{p.wilayah}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className={
                      p.keterangan === "AKTIF"
                        ? "bg-emerald-100 text-emerald-700 border-0 text-[10px] h-4 px-1.5"
                        : p.keterangan === "UMKM POLITIS"
                        ? "bg-amber-100 text-amber-700 border-0 text-[10px] h-4 px-1.5"
                        : "bg-red-100 text-red-700 border-0 text-[10px] h-4 px-1.5"
                    }
                  >
                    {STATUS_LABEL[p.keterangan]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Tidak ada data yang sesuai filter.
          </div>
        )}
      </Card>
    </div>
  );
}
