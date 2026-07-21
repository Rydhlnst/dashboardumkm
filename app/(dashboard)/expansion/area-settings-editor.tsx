"use client";

import { Fragment, useState, useTransition } from "react";
import type { AreaSetting } from "@/db/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { createAreaAction, deleteAreaAction, updateAreaSettingAction } from "@/lib/actions/area";

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

type FormState = {
  expansionStatus: string;
  pksStatus: string;
  timelineStatus: string;
  targetDate: string;
  newStoresText: string;
  lat: string;
  lng: string;
  shortName: string;
  trend: string;
  trendValue: string;
  participants: string;
  mdProgress: string;
  activeItems: string;
};

const EMPTY_FORM: FormState = {
  expansionStatus: "closed",
  pksStatus: "not_available",
  timelineStatus: "planned",
  targetDate: "",
  newStoresText: "",
  lat: "0",
  lng: "0",
  shortName: "",
  trend: "stable",
  trendValue: "0",
  participants: "0",
  mdProgress: "0",
  activeItems: "0",
};

export function AreaSettingsEditor({ settings }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [newAreaName, setNewAreaName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  const addRegion = () => {
    setAddError(null);
    startTransition(async () => {
      const res = await createAreaAction(newAreaName);
      if (!res.ok) {
        setAddError(res.error);
        return;
      }
      setNewAreaName("");
    });
  };

  const removeRegion = (area: string) => {
    if (!confirm(`Hapus wilayah "${area}"? Data terkait di tabel area_settings akan hilang.`)) return;
    startTransition(async () => {
      await deleteAreaAction(area);
      if (editing === area) setEditing(null);
    });
  };

  const startEdit = (s: AreaSetting) => {
    setEditing(s.area);
    setForm({
      expansionStatus: s.expansionStatus,
      pksStatus: s.pksStatus,
      timelineStatus: s.timelineStatus,
      targetDate: s.targetDate,
      newStoresText: (s.newStores ?? []).join(", "),
      lat: String(s.lat ?? 0),
      lng: String(s.lng ?? 0),
      shortName: s.shortName ?? "",
      trend: s.trend ?? "stable",
      trendValue: String(s.trendValue ?? 0),
      participants: String(s.participants ?? 0),
      mdProgress: String(s.mdProgress ?? 0),
      activeItems: String(s.activeItems ?? 0),
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
        lat: form.lat,
        lng: form.lng,
        shortName: form.shortName,
        trend: form.trend,
        trendValue: form.trendValue,
        participants: form.participants,
        mdProgress: form.mdProgress,
        activeItems: form.activeItems,
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
          Sesuai brief: Hijau (Terbuka), Kuning (Bersyarat), Merah (Tertutup). Klik pensil untuk edit — panel lanjutan (koordinat, tren, kapasitas) muncul saat mode edit.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Input
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            placeholder="Nama wilayah baru (mis. GORONTALO)"
            className="h-8 text-xs max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") addRegion();
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            disabled={pending || !newAreaName.trim()}
            onClick={addRegion}
          >
            <Plus className="w-3 h-3 mr-1" /> Tambah Wilayah
          </Button>
          {addError && <span className="text-xs text-red-600">{addError}</span>}
        </div>
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
                <Fragment key={s.area}>
                  <TableRow className="border-b border-border/30 align-top">
                    <TableCell className="text-xs font-medium py-3">
                      <div className="flex flex-col">
                        <span>{s.area}</span>
                        {!isEditing && s.shortName && (
                          <span className="text-[10px] text-muted-foreground">{s.shortName}</span>
                        )}
                      </div>
                    </TableCell>
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
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => startEdit(s)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-red-600"
                            disabled={pending}
                            onClick={() => removeRegion(s.area)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  {isEditing && (
                    <TableRow className="border-b border-border/30 bg-muted/30">
                      <TableCell colSpan={7} className="py-4 px-4">
                        <p className="text-[11px] font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                          Panel lanjutan
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          <LabeledInput
                            label="Short name (peta)"
                            value={form.shortName}
                            onChange={(v) => setForm({ ...form, shortName: v })}
                            placeholder="PLU"
                          />
                          <LabeledInput
                            label="Latitude"
                            value={form.lat}
                            onChange={(v) => setForm({ ...form, lat: v })}
                            type="number"
                            placeholder="-0.8917"
                          />
                          <LabeledInput
                            label="Longitude"
                            value={form.lng}
                            onChange={(v) => setForm({ ...form, lng: v })}
                            type="number"
                            placeholder="119.8707"
                          />
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-medium text-muted-foreground">Trend</label>
                            <select
                              value={form.trend}
                              onChange={(e) => setForm({ ...form, trend: e.target.value })}
                              className="h-8 text-xs border border-input rounded-md px-2 bg-background"
                            >
                              <option value="up">Up</option>
                              <option value="down">Down</option>
                              <option value="stable">Stable</option>
                            </select>
                          </div>
                          <LabeledInput
                            label="Trend value (%)"
                            value={form.trendValue}
                            onChange={(v) => setForm({ ...form, trendValue: v })}
                            type="number"
                            placeholder="12.4"
                          />
                          <LabeledInput
                            label="Participants"
                            value={form.participants}
                            onChange={(v) => setForm({ ...form, participants: v })}
                            type="number"
                            placeholder="156"
                          />
                          <LabeledInput
                            label="MD progress (%)"
                            value={form.mdProgress}
                            onChange={(v) => setForm({ ...form, mdProgress: v })}
                            type="number"
                            placeholder="82"
                          />
                          <LabeledInput
                            label="Active items"
                            value={form.activeItems}
                            onChange={(v) => setForm({ ...form, activeItems: v })}
                            type="number"
                            placeholder="214"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LabeledInput({
  label, value, onChange, type, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-medium text-muted-foreground">{label}</label>
      <Input
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 text-xs"
      />
    </div>
  );
}
