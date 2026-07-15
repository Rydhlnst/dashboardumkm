"use client";

import { useState, useMemo } from "react";
import { stores } from "@/data/stores";
import { areaStats } from "@/data/area-stats";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";

const AREAS = ["Semua", ...Array.from(new Set(stores.map((s) => s.area))).sort()];

export default function ExpansionPage() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("Semua");

  const belumUMKM = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter((s) => {
      if (s.umkm === "Aktif") return false;
      if (areaFilter !== "Semua" && s.area !== areaFilter) return false;
      if (q && !s.nama.toLowerCase().includes(q) && !s.kode.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, areaFilter]);

  const totalBelum = stores.filter((s) => s.umkm === "Belum").length;
  const totalAktif = stores.filter((s) => s.umkm === "Aktif").length;
  const overallPct = Math.round((totalAktif / stores.length) * 100);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Ekspansi UMKM</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Toko yang belum memiliki mitra UMKM aktif — potensi ekspansi
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold tabular-nums text-amber-600">{totalBelum}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Toko Belum UMKM</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold tabular-nums text-emerald-600">{totalAktif}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Sudah Aktif UMKM</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold tabular-nums">{overallPct}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Coverage UMKM</p>
          </CardContent>
        </Card>
      </div>

      {/* Opportunity per area */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Peluang Ekspansi per Wilayah</p>
          <p className="text-xs text-muted-foreground">Toko belum UMKM yang dapat dijangkau</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {areaStats
            .filter((a) => a.totalStores - a.umkmAktif > 0)
            .sort((a, b) => (b.totalStores - b.umkmAktif) - (a.totalStores - a.umkmAktif))
            .map((a) => {
              const gap = a.totalStores - a.umkmAktif;
              return (
                <div key={a.area} className="flex items-center gap-3">
                  <div className="w-36 shrink-0">
                    <p className="text-xs font-medium text-foreground">{a.area}</p>
                    <p className="text-[10px] text-muted-foreground">{gap} toko tersedia</p>
                  </div>
                  <div className="flex-1">
                    <Progress value={a.umkmCoverage} className="h-1.5" />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">
                    {a.umkmCoverage}%
                  </span>
                </div>
              );
            })}
        </CardContent>
      </Card>

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
        <span className="text-xs text-muted-foreground">{belumUMKM.length} toko potensial</span>
      </div>

      {/* Table of stores without UMKM */}
      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead className="w-16">Kode</TableHead>
              <TableHead>Nama Toko</TableHead>
              <TableHead className="hidden md:table-cell">Wilayah</TableHead>
              <TableHead className="hidden lg:table-cell">Kecamatan</TableHead>
              <TableHead className="hidden xl:table-cell">Kabupaten</TableHead>
              <TableHead className="hidden xl:table-cell">AC</TableHead>
              <TableHead className="text-center hidden sm:table-cell">Sarana Promosi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {belumUMKM.map((s) => (
              <TableRow key={s.kode} className="hover:bg-muted/40 border-b border-border/30">
                <TableCell className="font-mono text-[11px] text-muted-foreground">{s.kode}</TableCell>
                <TableCell>
                  <p className="text-xs font-medium">{s.nama}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{s.kelurahan}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs">{s.area}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{s.kecamatan}</TableCell>
                <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{s.kabupaten}</TableCell>
                <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{s.namaAC}</TableCell>
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
        {belumUMKM.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Semua toko di wilayah ini sudah memiliki UMKM aktif.
          </div>
        )}
      </Card>
    </div>
  );
}
