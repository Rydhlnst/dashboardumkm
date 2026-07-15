"use client";

import { useState, useMemo } from "react";
import { stores, type UMKMStatus, type PromotionStatus } from "@/data/stores";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const AREAS = ["Semua", ...Array.from(new Set(stores.map((s) => s.area))).sort()];

export default function StorePage() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("Semua");
  const [umkmFilter, setUmkmFilter] = useState<"Semua" | UMKMStatus>("Semua");
  const [promoFilter, setPromoFilter] = useState<"Semua" | PromotionStatus>("Semua");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter((s) => {
      if (areaFilter !== "Semua" && s.area !== areaFilter) return false;
      if (umkmFilter !== "Semua" && s.umkm !== umkmFilter) return false;
      if (promoFilter !== "Semua" && s.saranaPromosi !== promoFilter) return false;
      if (q && !s.nama.toLowerCase().includes(q) && !s.kode.toLowerCase().includes(q) && !s.alamat.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, areaFilter, umkmFilter, promoFilter]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Toko</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {stores.length} toko terdaftar di seluruh wilayah
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Toko", value: stores.length },
          { label: "UMKM Aktif", value: stores.filter((s) => s.umkm === "Aktif").length },
          { label: "Belum UMKM", value: stores.filter((s) => s.umkm === "Belum").length },
          { label: "Sarana Terpasang", value: stores.filter((s) => s.saranaPromosi === "Terpasang").length },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold tabular-nums">{s.value}</p>
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
            placeholder="Cari nama atau kode toko..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
        >
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select
          value={umkmFilter}
          onChange={(e) => setUmkmFilter(e.target.value as "Semua" | UMKMStatus)}
          className="h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
        >
          <option>Semua</option>
          <option value="Aktif">UMKM Aktif</option>
          <option value="Belum">Belum UMKM</option>
        </select>
        <select
          value={promoFilter}
          onChange={(e) => setPromoFilter(e.target.value as "Semua" | PromotionStatus)}
          className="h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
        >
          <option>Semua</option>
          <option value="Terpasang">Promosi Terpasang</option>
          <option value="Belum">Belum Promosi</option>
        </select>
        <span className="text-xs text-muted-foreground">{filtered.length} hasil</span>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead className="w-16">Kode</TableHead>
              <TableHead>Nama Toko</TableHead>
              <TableHead className="hidden md:table-cell">Wilayah</TableHead>
              <TableHead className="hidden lg:table-cell">Kecamatan</TableHead>
              <TableHead className="hidden xl:table-cell">AC</TableHead>
              <TableHead className="text-center">UMKM</TableHead>
              <TableHead className="text-center hidden sm:table-cell">Promosi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.kode} className="hover:bg-muted/40 border-b border-border/30">
                <TableCell className="font-mono text-[11px] text-muted-foreground">{s.kode}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-xs">{s.nama}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block line-clamp-1">{s.kecamatan}, {s.kabupaten}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs">{s.area}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{s.kecamatan}</TableCell>
                <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{s.namaAC}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={s.umkm === "Aktif" ? "default" : "secondary"}
                    className={
                      s.umkm === "Aktif"
                        ? "bg-emerald-100 text-emerald-700 border-0 text-[10px] h-4 px-1.5"
                        : "text-[10px] h-4 px-1.5"
                    }
                  >
                    {s.umkm}
                  </Badge>
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">
                  <Badge
                    variant={s.saranaPromosi === "Terpasang" ? "default" : "secondary"}
                    className={
                      s.saranaPromosi === "Terpasang"
                        ? "bg-blue-100 text-blue-700 border-0 text-[10px] h-4 px-1.5"
                        : "text-[10px] h-4 px-1.5"
                    }
                  >
                    {s.saranaPromosi}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Tidak ada toko yang sesuai filter.
          </div>
        )}
      </Card>
    </div>
  );
}
