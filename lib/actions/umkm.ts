"use server";

import { redirect } from "next/navigation";
import { UMKMProductSchema } from "@/lib/validations";
import {
  createUMKMProduct,
  updateUMKMProduct,
  deleteUMKMProduct,
} from "@/db/queries";

export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createUMKMProductAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const result = UMKMProductSchema.safeParse(raw);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await createUMKMProduct(result.data);
  } catch {
    return { message: "Gagal menyimpan data. Coba lagi." };
  }

  redirect("/umkm");
}

export async function updateUMKMProductAction(
  id: number,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const result = UMKMProductSchema.safeParse(raw);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await updateUMKMProduct(id, result.data);
  } catch {
    return { message: "Gagal memperbarui data. Coba lagi." };
  }

  redirect("/umkm");
}

export async function deleteUMKMProductAction(id: number) {
  await deleteUMKMProduct(id);
  redirect("/umkm");
}
