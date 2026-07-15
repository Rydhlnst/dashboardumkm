"use client";

import { useState, useMemo } from "react";
import { stores } from "@/data/stores";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";

type ACEntry = {
  namaAC: string;
  namaAM: string;
  totalStores: number;
  umkmAktif: number;
  promosiTerpasang: number;
};

const acMap = new Map<string, ACEntry>();
for (const s of stores) {
  if (!acMap.has(s.namaAC)) {
    acMap.set(s.namaAC, {
      namaAC: s.namaAC,
      namaAM: s.namaAM,
      totalStores: 0,
      umkmAktif: 0,
      promosiTerpasang: 0,
    });
  }
  const entry = acMap.get(s.namaAC)!;
  entry.totalStores++;
  if (s.umkm === "Aktif") entry.umkmAktif++;
  if (s.saranaPromosi === "Terpasang") entry.promosiTerpasang++;
}
const acList = Array.from(acMap.values()).sort((a, b) => b.totalStores - a.totalStores);

const AMS = ["Semua", ...Array.from(new Set(stores.map((s) => s.namaAM))).sort()];
const ACS = ["Semua", ...Array.from(new Set(stores.map((s) => s.namaAC))).sort()];

export default function PKSPage() {
  const [search, setSearch] = useState("");
  const [acFilter, setAcFilter] = useState("Semua");
  const [tab, setTab] = useState<"ac" | "stores">("ac");

  const filteredStores = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter((s) => {
      if (acFilter !== "Semua" && s.namaAC !== acFilter) return false;
      if (q && !s.nama.toLowerCase().includes(q) && !s.namaAC.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, acFilter]);

  const filteredAC = useMemo(() => {
    const q = search.toLowerCase();
    return acList.filter((a) => {
      if (q && !a.namaAC.toLowerCase().includes(q) && !a.namaAM.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">PKS / MoU</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Area Coordinator dan Area Manager — cakupan toko dan UMKM
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold tabular-nums">{acList.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Area Coordinator</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold tabular-nums">{AMS.length - 1}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Area Manager</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold tabular-nums">{stores.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Toko Aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 border-b border-border">
        {(["ac", "stores"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-red-600 text-red-700"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "ac" ? "Per AC" : "Daftar Toko"}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder={tab === "ac" ? "Cari AC atau AM..." : "Cari nama toko..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        {tab === "stores" && (
          <select
            value={acFilter}
            onChange={(e) => setAcFilter(e.target.value)}
            className="h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
          >
            {ACS.map((a) => <option key={a}>{a}</option>)}
          </select>
        )}
      </div>

      {/* AC summary table */}
      {tab === "ac" && (
        <Card className="border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead>Area Coordinator</TableHead>
                <TableHead className="hidden md:table-cell">Area Manager</TableHead>
                <TableHead className="text-right">Toko</TableHead>
                <TableHead className="text-right hidden sm:table-cell">UMKM Aktif</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Promosi</TableHead>
                <TableHead className="text-right">Coverage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAC.map((a) => {
                const pct = Math.round((a.umkmAktif / a.totalStores) * 100);
                return (
                  <TableRow key={a.namaAC} className="hover:bg-muted/40 border-b border-border/30">
                    <TableCell className="text-xs font-medium">{a.namaAC}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{a.namaAM}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{a.totalStores}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] h-4 px-1.5">
                        {a.umkmAktif}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] h-4 px-1.5">
                        {a.promosiTerpasang}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums">
                      <span className={pct >= 50 ? "text-emerald-600 font-medium" : "text-amber-600"}>
                        {pct}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Store list table */}
      {tab === "stores" && (
        <Card className="border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead className="w-16">Kode</TableHead>
                <TableHead>Nama Toko</TableHead>
                <TableHead className="hidden md:table-cell">AC</TableHead>
                <TableHead className="hidden lg:table-cell">AM</TableHead>
                <TableHead className="hidden md:table-cell">Wilayah</TableHead>
                <TableHead className="text-center">UMKM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((s) => (
                <TableRow key={s.kode} className="hover:bg-muted/40 border-b border-border/30">
                  <TableCell className="font-mono text-[11px] text-muted-foreground">{s.kode}</TableCell>
                  <TableCell className="text-xs font-medium">{s.nama}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs">{s.namaAC}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{s.namaAM}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{s.area}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredStores.length === 0 && (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Tidak ada data yang sesuai filter.
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
