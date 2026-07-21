"use client";

import { useState, useTransition } from "react";
import type { AreaSetting } from "@/db/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, Save, X } from "lucide-react";
import { updateAreaSettingAction } from "@/lib/actions/area";

const EXPANSION_LABEL: Record<string, { label: string; className: string }> = {
  open:        { label: "Hijau — Terbuka",   className: "bg-emerald-100 text-emerald-700" },
  conditional: { label: "Kuning — Bersyarat", className: "bg-amber-100 text-amber-700" },
  closed:      { label: "Merah — Tertutup",  className: "bg-red-100 text-red-700" },
};
const PKS_LABEL: Record<string, string> = {
  available: "Tersedia",
  not_available: "Belum",
};
const TIMELINE_LABEL: Record<string, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

interface Props {
  settings: AreaSetting[];
}

export function AreaSettingsEditor({ settings }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState<{
    expansionStatus: string;
    pksStatus: string;
    timelineStatus: string;
    targetDate: string;
    newStoresText: string;
  }>({
    expansionStatus: "closed",
    pksStatus: "not_available",
    timelineStatus: "planned",
    targetDate: "",
    newStoresText: "",
  });

  const startEdit = (s: AreaSetting) => {
    setEditing(s.area);
    setForm({
      expansionStatus: s.expansionStatus,
      pksStatus: s.pksStatus,
      timelineStatus: s.timelineStatus,
      targetDate: s.targetDate,
      newStoresText: (s.newStores ?? []).join(", "),
    });
  };

  const save = (area: string) => {
    startTransition(async () => {
      const newStores = form.newStoresText
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      const res = await updateAreaSettingAction(area, {
        expansionStatus: form.expansionStatus,
        pksStatus: form.pksStatus,
        timelineStatus: form.timelineStatus,
        targetDate: form.targetDate,
        newStores,
      });
      if (res.ok) setEditing(null);
    });
  };

  const sorted = [...settings].sort((a, b) => a.area.localeCompare(b.area));

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <p className="text-sm font-semibold">Klasifikasi Ekspansi per Wilayah</p>
        <p className="text-xs text-muted-foreground">
          Sesuai brief: Hijau (Terbuka), Kuning (Bersyarat), Merah (Tertutup). Klik ikon pensil untuk edit.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead>Wilayah</TableHead>
              <TableHead>Status Ekspansi</TableHead>
              <TableHead className="hidden md:table-cell">PKS/MoU</TableHead>
              <TableHead className="hidden lg:table-cell">Timeline</TableHead>
              <TableHead className="hidden lg:table-cell">Target</TableHead>
              <TableHead className="hidden xl:table-cell">Toko Baru</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((s) => {
              const isEditing = editing === s.area;
              return (
                <TableRow key={s.area} className="border-b border-border/30 align-top">
                  <TableCell className="text-xs font-medium py-3">{s.area}</TableCell>
                  <TableCell className="py-3">
                    {isEditing ? (
                      <select
                        value={form.expansionStatus}
                        onChange={(e) => setForm({ ...form, expansionStatus: e.target.value })}
                        className="h-7 text-xs border border-input rounded-md px-2 bg-background"
                      >
                        <option value="open">Hijau — Terbuka</option>
                        <option value="conditional">Kuning — Bersyarat</option>
                        <option value="closed">Merah — Tertutup</option>
                      </select>
                    ) : (
                      <Badge className={`${EXPANSION_LABEL[s.expansionStatus].className} border-0 text-[10px] h-5 px-2`}>
                        {EXPANSION_LABEL[s.expansionStatus].label}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-3">
                    {isEditing ? (
                      <select
                        value={form.pksStatus}
                        onChange={(e) => setForm({ ...form, pksStatus: e.target.value })}
                        className="h-7 text-xs border border-input rounded-md px-2 bg-background"
                      >
                        <option value="available">Tersedia</option>
                        <option value="not_available">Belum</option>
                      </select>
                    ) : (
                      <span className="text-xs text-muted-foreground">{PKS_LABEL[s.pksStatus]}</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-3">
                    {isEditing ? (
                      <select
                        value={form.timelineStatus}
                        onChange={(e) => setForm({ ...form, timelineStatus: e.target.value })}
                        className="h-7 text-xs border border-input rounded-md px-2 bg-background"
                      >
                        <option value="planned">Planned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <span className="text-xs text-muted-foreground">{TIMELINE_LABEL[s.timelineStatus]}</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-3">
                    {isEditing ? (
                      <Input
                        value={form.targetDate}
                        onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                        placeholder="Q4 2025"
                        className="h-7 text-xs w-24"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">{s.targetDate || "—"}</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell py-3">
                    {isEditing ? (
                      <Input
                        value={form.newStoresText}
                        onChange={(e) => setForm({ ...form, newStoresText: e.target.value })}
                        placeholder="Toko A, Toko B"
                        className="h-7 text-xs"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {(s.newStores ?? []).join(", ") || "—"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon" variant="ghost" className="h-6 w-6 text-emerald-600"
                          disabled={pending}
                          onClick={() => save(s.area)}
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground"
                          disabled={pending}
                          onClick={() => setEditing(null)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => startEdit(s)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
