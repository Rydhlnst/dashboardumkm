"use server";

import { revalidatePath } from "next/cache";
import { AreaSettingSchema } from "@/lib/validations";
import { upsertAreaSetting, updateStorePromosi, deleteAreaSetting } from "@/db/queries";

export async function updateAreaSettingAction(
  area: string,
  patch: {
    expansionStatus: string;
    pksStatus: string;
    timelineStatus: string;
    targetDate: string;
    newStores: string[];
    notes?: string;
    lat?: number | string;
    lng?: number | string;
    shortName?: string;
    trend?: string;
    trendValue?: number | string;
    participants?: number | string;
    mdProgress?: number | string;
    activeItems?: number | string;
  }
) {
  const parsed = AreaSettingSchema.safeParse({
    expansionStatus: patch.expansionStatus,
    pksStatus: patch.pksStatus,
    timelineStatus: patch.timelineStatus,
    targetDate: patch.targetDate,
    newStores: patch.newStores,
    notes: patch.notes ?? "",
    lat: patch.lat ?? 0,
    lng: patch.lng ?? 0,
    shortName: patch.shortName ?? "",
    trend: patch.trend ?? "stable",
    trendValue: patch.trendValue ?? 0,
    participants: patch.participants ?? 0,
    mdProgress: patch.mdProgress ?? 0,
    activeItems: patch.activeItems ?? 0,
  });
  if (!parsed.success) {
    return { ok: false as const, error: "Data tidak valid" };
  }
  await upsertAreaSetting(area, parsed.data);
  revalidatePath("/expansion");
  revalidatePath("/");
  return { ok: true as const };
}

export async function createAreaAction(area: string) {
  const trimmed = area.trim().toUpperCase();
  if (!trimmed || trimmed.length > 100) {
    return { ok: false as const, error: "Nama wilayah wajib diisi (maks 100 karakter)" };
  }
  const parsed = AreaSettingSchema.parse({
    expansionStatus: "closed",
    pksStatus: "not_available",
    timelineStatus: "planned",
  });
  try {
    await upsertAreaSetting(trimmed, parsed);
  } catch (e) {
    return { ok: false as const, error: "Gagal menyimpan wilayah (mungkin sudah ada)" };
  }
  revalidatePath("/expansion");
  revalidatePath("/");
  return { ok: true as const, area: trimmed };
}

export async function deleteAreaAction(area: string) {
  await deleteAreaSetting(area);
  revalidatePath("/expansion");
  revalidatePath("/");
  return { ok: true as const };
}

export async function togglePromosiAction(
  id: number,
  next: "Terpasang" | "Belum"
) {
  if (next !== "Terpasang" && next !== "Belum") {
    return { ok: false as const, error: "Status tidak valid" };
  }
  await updateStorePromosi(id, next);
  revalidatePath("/promotion");
  revalidatePath("/");
  return { ok: true as const };
}
