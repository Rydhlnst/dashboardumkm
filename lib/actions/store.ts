"use server";

import { redirect } from "next/navigation";
import { StoreSchema } from "@/lib/validations";
import {
  createStore,
  updateStore,
  deleteStore,
} from "@/db/queries";

export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createStoreAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const result = StoreSchema.safeParse(raw);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await createStore(result.data);
  } catch {
    return { message: "Gagal menyimpan data. Coba lagi." };
  }

  redirect("/store");
}

export async function updateStoreAction(
  id: number,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const result = StoreSchema.safeParse(raw);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await updateStore(id, result.data);
  } catch {
    return { message: "Gagal memperbarui data. Coba lagi." };
  }

  redirect("/store");
}

export async function deleteStoreAction(id: number) {
  await deleteStore(id);
  redirect("/store");
}
