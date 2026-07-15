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

export default function PromotionPage() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Terpasang" | "Belum">("Semua");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter((s) => {
      if (areaFilter !== "Semua" && s.area !== areaFilter) return false;
      if (statusFilter !== "Semua" && s.saranaPromosi !== statusFilter) return false;
      if (q && !s.nama.toLowerCase().includes(q) && !s.kode.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, areaFilter, statusFilter]);

  const totalTerpasang = stores.filter((s) => s.saranaPromosi === "Terpasang").length;
  const totalBelum = stores.filter((s) => s.saranaPromosi === "Belum").length;
  const overallPct = Math.round((totalTerpasang / stores.length) * 100);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Sarana Promosi</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Status pemasangan sarana promosi di setiap toko
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold tabular-nums text-emerald-600">{totalTerpasang}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Terpasang</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold tabular-nums text-amber-600">{totalBelum}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Belum Terpasang</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold tabular-nums">{overallPct}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Coverage Keseluruhan</p>
          </CardContent>
        </Card>
      </div>

      {/* Per area breakdown */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Progress per Wilayah</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {areaStats.map((a) => (
            <div key={a.area} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{a.area}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {a.saranaPromosi}/{a.totalStores} — {a.promosiCoverage}%
                </span>
              </div>
              <Progress value={a.promosiCoverage} className="h-1.5" />
            </div>
          ))}
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "Semua" | "Terpasang" | "Belum")}
          className="h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
        >
          <option>Semua</option>
          <option value="Terpasang">Terpasang</option>
          <option value="Belum">Belum</option>
        </select>
        <span className="text-xs text-muted-foreground">{filtered.length} toko</span>
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
              <TableHead className="hidden xl:table-cell">AM</TableHead>
              <TableHead className="text-center">UMKM</TableHead>
              <TableHead className="text-center">Sarana Promosi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.kode} className="hover:bg-muted/40 border-b border-border/30">
                <TableCell className="font-mono text-[11px] text-muted-foreground">{s.kode}</TableCell>
                <TableCell className="text-xs font-medium">{s.nama}</TableCell>
                <TableCell className="hidden md:table-cell text-xs">{s.area}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{s.kecamatan}</TableCell>
                <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{s.namaAM}</TableCell>
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
                <TableCell className="text-center">
                  <Badge
                    variant={s.saranaPromosi === "Terpasang" ? "default" : "secondary"}
                    className={
                      s.saranaPromosi === "Terpasang"
                        ? "bg-blue-100 text-blue-700 border-0 text-[10px] h-4 px-1.5"
                        : "bg-amber-100 text-amber-700 border-0 text-[10px] h-4 px-1.5"
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
            Tidak ada data yang sesuai filter.
          </div>
        )}
      </Card>
    </div>
  );
}
