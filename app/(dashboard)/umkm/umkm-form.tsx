"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { UMKMProduct } from "@/db/schema";
import type { FormState } from "@/lib/actions/umkm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-xs text-red-600 mt-1">{errors[0]}</p>;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-red-600 hover:bg-red-700 text-white h-9">
      {pending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
      {label}
    </Button>
  );
}

interface Props {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: Partial<UMKMProduct>;
  isEdit?: boolean;
}

const WILAYAHS = ["PALU", "DONGGALA", "SIGI", "PARIGI MOUTONG", "POSO", "TOLI-TOLI", "BUOL", "MOROWALI", "BANGGAI", "BANGGAI KEPULAUAN", "BANGGAI LAUT", "TOJO UNA-UNA"];

export function UMKMForm({ action, defaultValues, isEdit }: Props) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state.message && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {state.message}
        </div>
      )}

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Informasi Supplier</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div data-tour="form-wilayah">
            <Label htmlFor="wilayah" className="text-xs">Wilayah <span className="text-red-500">*</span></Label>
            <select
              id="wilayah"
              name="wilayah"
              defaultValue={defaultValues?.wilayah ?? ""}
              className="mt-1 w-full h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
            >
              <option value="" disabled>Pilih wilayah</option>
              {WILAYAHS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
            <FieldError errors={state.errors?.wilayah} />
          </div>

          <div data-tour="form-kodeSupp">
            <Label htmlFor="kodeSupp" className="text-xs">Kode Supplier <span className="text-red-500">*</span></Label>
            <Input
              id="kodeSupp"
              name="kodeSupp"
              defaultValue={defaultValues?.kodeSupp}
              placeholder="Contoh: SUP-001"
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.kodeSupp} />
          </div>

          <div data-tour="form-namaSupp" className="sm:col-span-2">
            <Label htmlFor="namaSupp" className="text-xs">Nama Supplier <span className="text-red-500">*</span></Label>
            <Input
              id="namaSupp"
              name="namaSupp"
              defaultValue={defaultValues?.namaSupp}
              placeholder="Nama lengkap supplier"
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.namaSupp} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Informasi Produk</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div data-tour="form-plu">
            <Label htmlFor="plu" className="text-xs">PLU <span className="text-red-500">*</span></Label>
            <Input
              id="plu"
              name="plu"
              type="number"
              defaultValue={defaultValues?.plu}
              placeholder="Kode PLU"
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.plu} />
          </div>

          <div data-tour="form-totalPlu">
            <Label htmlFor="totalPlu" className="text-xs">Total PLU</Label>
            <Input
              id="totalPlu"
              name="totalPlu"
              type="number"
              defaultValue={defaultValues?.totalPlu ?? 0}
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.totalPlu} />
          </div>

          <div data-tour="form-namaProduk" className="sm:col-span-2">
            <Label htmlFor="namaProduk" className="text-xs">Nama Produk <span className="text-red-500">*</span></Label>
            <Input
              id="namaProduk"
              name="namaProduk"
              defaultValue={defaultValues?.namaProduk}
              placeholder="Nama produk UMKM"
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.namaProduk} />
          </div>

          <div data-tour="form-keterangan">
            <Label htmlFor="keterangan" className="text-xs">Status <span className="text-red-500">*</span></Label>
            <select
              id="keterangan"
              name="keterangan"
              defaultValue={defaultValues?.keterangan ?? "AKTIF"}
              className="mt-1 w-full h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
            >
              <option value="AKTIF">Aktif</option>
              <option value="UMKM POLITIS">UMKM Politis</option>
              <option value="TIDAK AKTIF">Tidak Aktif</option>
            </select>
            <FieldError errors={state.errors?.keterangan} />
          </div>
        </CardContent>
      </Card>

      <div data-tour="form-verify" className="flex gap-3" id="form-verify-anchor">
        <div data-tour="form-submit">
          <SubmitButton label={isEdit ? "Simpan Perubahan" : "Tambah PLU"} />
        </div>
        <Button variant="outline" asChild className="h-9">
          <Link href="/umkm">Batal</Link>
        </Button>
      </div>
    </form>
  );
}
