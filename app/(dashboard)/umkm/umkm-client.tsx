"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { UMKMProduct } from "@/db/schema";
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
import { DeleteUMKMButton } from "./delete-umkm-button";

type ProductStatus = "AKTIF" | "UMKM POLITIS" | "TIDAK AKTIF";

const STATUS_LABEL: Record<ProductStatus, string> = {
  AKTIF: "Aktif",
  "UMKM POLITIS": "Politis",
  "TIDAK AKTIF": "Tidak Aktif",
};

const PAGE_SIZE = 25;

interface Props {
  products: UMKMProduct[];
}

export function UMKMClient({ products }: Props) {
  const WILAYAHS = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.wilayah))).sort()],
    [products]
  );

  const [searchInput, setSearchInput] = useState("");
  const [wilayahFilter, setWilayahFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState<"Semua" | ProductStatus>("Semua");
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput, 500);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      if (wilayahFilter !== "Semua" && p.wilayah !== wilayahFilter) return false;
      if (statusFilter !== "Semua" && p.keterangan !== statusFilter) return false;
      if (q && !p.namaSupp.toLowerCase().includes(q) && !p.namaProduk.toLowerCase().includes(q) && !p.kodeSupp.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, wilayahFilter, statusFilter]);

  useEffect(() => { setPage(1); }, [search, wilayahFilter, statusFilter]);

  const suppliersInView = new Set(filtered.map((p) => p.kodeSupp)).size;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statAktif = products.filter((p) => p.keterangan === "AKTIF").length;
  const statPolitis = products.filter((p) => p.keterangan === "UMKM POLITIS").length;
  const statTidakAktif = products.filter((p) => p.keterangan === "TIDAK AKTIF").length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">UMKM</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Daftar produk & supplier UMKM yang terdaftar di sistem
          </p>
        </div>
        <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white h-8 gap-1.5">
          <Link href="/umkm/new">
            <Plus className="w-3.5 h-3.5" />
            Tambah PLU
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total PLU", value: products.length },
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

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cari supplier atau produk..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((p) => (
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
                    {STATUS_LABEL[p.keterangan as ProductStatus]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground" asChild>
                      <Link href={`/umkm/${p.id}/edit`} title={`Edit ${p.namaProduk}`}>
                        <Pencil className="w-3 h-3" />
                      </Link>
                    </Button>
                    <DeleteUMKMButton id={p.id} nama={p.namaProduk} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Tidak ada data yang sesuai filter.
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
