"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { Store } from "@/db/schema";
import type { FormState } from "@/lib/actions/store";
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
  defaultValues?: Partial<Store>;
  isEdit?: boolean;
}

const AREAS = ["PALU", "DONGGALA", "SIGI", "PARIGI MOUTONG", "POSO", "TOLI-TOLI", "BUOL", "MOROWALI", "BANGGAI", "BANGGAI KEPULAUAN", "BANGGAI LAUT", "TOJO UNA-UNA"];

export function StoreForm({ action, defaultValues, isEdit }: Props) {
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
          <p className="text-sm font-semibold">Informasi Toko</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="kode" className="text-xs">Kode Toko <span className="text-red-500">*</span></Label>
            <Input
              id="kode"
              name="kode"
              defaultValue={defaultValues?.kode}
              placeholder="Contoh: ALF-001"
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.kode} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="nama" className="text-xs">Nama Toko <span className="text-red-500">*</span></Label>
            <Input
              id="nama"
              name="nama"
              defaultValue={defaultValues?.nama}
              placeholder="Nama lengkap toko"
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.nama} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="alamat" className="text-xs">Alamat <span className="text-red-500">*</span></Label>
            <Input
              id="alamat"
              name="alamat"
              defaultValue={defaultValues?.alamat}
              placeholder="Alamat lengkap"
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.alamat} />
          </div>

          <div>
            <Label htmlFor="kelurahan" className="text-xs">Kelurahan <span className="text-red-500">*</span></Label>
            <Input
              id="kelurahan"
              name="kelurahan"
              defaultValue={defaultValues?.kelurahan}
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.kelurahan} />
          </div>

          <div>
            <Label htmlFor="kecamatan" className="text-xs">Kecamatan <span className="text-red-500">*</span></Label>
            <Input
              id="kecamatan"
              name="kecamatan"
              defaultValue={defaultValues?.kecamatan}
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.kecamatan} />
          </div>

          <div>
            <Label htmlFor="kabupaten" className="text-xs">Kabupaten/Kota <span className="text-red-500">*</span></Label>
            <Input
              id="kabupaten"
              name="kabupaten"
              defaultValue={defaultValues?.kabupaten}
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.kabupaten} />
          </div>

          <div>
            <Label htmlFor="area" className="text-xs">Area <span className="text-red-500">*</span></Label>
            <select
              id="area"
              name="area"
              defaultValue={defaultValues?.area ?? ""}
              className="mt-1 w-full h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
            >
              <option value="" disabled>Pilih area</option>
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <FieldError errors={state.errors?.area} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Koordinator & Manager</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="namaAC" className="text-xs">Nama AC (Area Coordinator) <span className="text-red-500">*</span></Label>
            <Input
              id="namaAC"
              name="namaAC"
              defaultValue={defaultValues?.namaAC}
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.namaAC} />
          </div>

          <div>
            <Label htmlFor="namaAM" className="text-xs">Nama AM (Area Manager) <span className="text-red-500">*</span></Label>
            <Input
              id="namaAM"
              name="namaAM"
              defaultValue={defaultValues?.namaAM}
              className="mt-1 h-8 text-xs"
            />
            <FieldError errors={state.errors?.namaAM} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Status</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="umkm" className="text-xs">Status UMKM <span className="text-red-500">*</span></Label>
            <select
              id="umkm"
              name="umkm"
              defaultValue={defaultValues?.umkm ?? "Belum"}
              className="mt-1 w-full h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
            >
              <option value="Aktif">Aktif</option>
              <option value="Belum">Belum</option>
            </select>
            <FieldError errors={state.errors?.umkm} />
          </div>

          <div>
            <Label htmlFor="saranaPromosi" className="text-xs">Sarana Promosi <span className="text-red-500">*</span></Label>
            <select
              id="saranaPromosi"
              name="saranaPromosi"
              defaultValue={defaultValues?.saranaPromosi ?? "Belum"}
              className="mt-1 w-full h-8 text-xs border border-input rounded-md px-2 bg-background text-foreground"
            >
              <option value="Terpasang">Terpasang</option>
              <option value="Belum">Belum</option>
            </select>
            <FieldError errors={state.errors?.saranaPromosi} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <SubmitButton label={isEdit ? "Simpan Perubahan" : "Tambah Toko"} />
        <Button variant="outline" asChild className="h-9">
          <Link href="/store">Batal</Link>
        </Button>
      </div>
    </form>
  );
}
