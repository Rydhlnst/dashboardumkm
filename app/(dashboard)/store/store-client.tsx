"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { Store } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { TablePagination } from "@/components/ui/table-pagination";
import { Search, Plus, Pencil } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { DeleteStoreButton } from "./delete-store-button";

type UMKMStatus = "Aktif" | "Belum";
type PromotionStatus = "Terpasang" | "Belum";

const PAGE_SIZE = 25;

interface Props {
  stores: Store[];
}

export function StoreClient({ stores }: Props) {
  const AREAS = useMemo(
    () => ["Semua", ...Array.from(new Set(stores.map((s) => s.area))).sort()],
    [stores]
  );

  const [searchInput, setSearchInput] = useState("");
  const [areaFilter, setAreaFilter] = useState("Semua");
  const [umkmFilter, setUmkmFilter] = useState<"Semua" | UMKMStatus>("Semua");
  const [promoFilter, setPromoFilter] = useState<"Semua" | PromotionStatus>("Semua");
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput, 500);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter((s) => {
      if (areaFilter !== "Semua" && s.area !== areaFilter) return false;
      if (umkmFilter !== "Semua" && s.umkm !== umkmFilter) return false;
      if (promoFilter !== "Semua" && s.saranaPromosi !== promoFilter) return false;
      if (q && !s.nama.toLowerCase().includes(q) && !s.kode.toLowerCase().includes(q) && !s.alamat.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [stores, search, areaFilter, umkmFilter, promoFilter]);

  // Reset ke halaman 1 saat filter/search berubah
  useEffect(() => { setPage(1); }, [search, areaFilter, umkmFilter, promoFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Toko</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stores.length} toko terdaftar di seluruh wilayah
          </p>
        </div>
        <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white h-8 gap-1.5">
          <Link href="/store/new">
            <Plus className="w-3.5 h-3.5" />
            Tambah Toko
          </Link>
        </Button>
      </div>

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

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau kode toko..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((s) => (
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
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground" asChild>
                      <Link href={`/store/${s.id}/edit`} title={`Edit ${s.nama}`}>
                        <Pencil className="w-3 h-3" />
                      </Link>
                    </Button>
                    <DeleteStoreButton id={s.id} nama={s.nama} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Tidak ada toko yang sesuai filter.
          </div>
        ) : (
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}
