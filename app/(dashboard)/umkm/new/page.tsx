import { createUMKMProductAction } from "@/lib/actions/umkm";
import { UMKMForm } from "../umkm-form";

export default function NewUMKMPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Tambah PLU UMKM</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Input data produk UMKM baru secara manual</p>
      </div>
      <UMKMForm action={createUMKMProductAction} />
    </div>
  );
}
