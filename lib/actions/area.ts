"use server";

import { revalidatePath } from "next/cache";
import { AreaSettingSchema } from "@/lib/validations";
import { upsertAreaSetting, updateStorePromosi } from "@/db/queries";

export async function updateAreaSettingAction(
  area: string,
  patch: {
    expansionStatus: string;
    pksStatus: string;
    timelineStatus: string;
    targetDate: string;
    newStores: string[];
    notes?: string;
  }
) {
  const parsed = AreaSettingSchema.safeParse({
    expansionStatus: patch.expansionStatus,
    pksStatus: patch.pksStatus,
    timelineStatus: patch.timelineStatus,
    targetDate: patch.targetDate,
    newStores: patch.newStores,
    notes: patch.notes ?? "",
  });
  if (!parsed.success) {
    return { ok: false as const, error: "Data tidak valid" };
  }
  await upsertAreaSetting(area, parsed.data);
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
