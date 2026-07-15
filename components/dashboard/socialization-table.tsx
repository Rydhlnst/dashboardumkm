"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Search, ChevronUp, ChevronDown } from "lucide-react";
import type { SocializationRow } from "@/types";
import { cn } from "@/lib/utils";

interface SocializationTableProps {
  data: SocializationRow[];
}

type SortKey = keyof SocializationRow;

export function SocializationTable({ data }: SocializationTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("region");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = data.filter((r) =>
    r.region.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
    ) : (
      <ChevronUp className="w-3 h-3 opacity-20" />
    );

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3 px-5 pt-5">
        <SectionHeader
          title="Socialization & Curation"
          description="Training and development progress per region"
          iconSlot={<Users className="w-4 h-4 text-muted-foreground" />}
          action={
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search region..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 h-8 w-44 text-xs"
              />
            </div>
          }
        />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                {([
                  { key: "region", label: "Region" },
                  { key: "participants", label: "Participants" },
                  { key: "mdProgress", label: "MD Progress" },
                  { key: "activeUMKM", label: "Active UMKM" },
                  { key: "activeItems", label: "Active Items" },
                ] as { key: SortKey; label: string }[]).map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-xs font-semibold cursor-pointer select-none h-9"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="text-xs font-medium py-2.5">{row.region}</TableCell>
                  <TableCell className="text-xs py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      {row.participants}
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Progress value={row.mdProgress} className="h-1.5 w-16" />
                      <span className={cn(
                        "text-xs font-medium",
                        row.mdProgress >= 75 ? "text-emerald-600" :
                        row.mdProgress >= 50 ? "text-amber-600" : "text-red-600"
                      )}>
                        {row.mdProgress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium py-2.5 text-emerald-600">
                    {row.activeUMKM}
                  </TableCell>
                  <TableCell className="text-xs py-2.5 text-muted-foreground">
                    {row.activeItems}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, sorted.length)} of {sorted.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "ghost"}
                  size="sm"
                  className={cn("h-7 w-7 text-xs p-0", p === page && "bg-red-600 hover:bg-red-700 text-white")}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
