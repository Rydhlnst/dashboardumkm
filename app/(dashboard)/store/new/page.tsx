import { createStoreAction } from "@/lib/actions/store";
import { StoreForm } from "../store-form";

export default function NewStorePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Tambah Toko</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Input data toko baru secara manual</p>
      </div>
      <StoreForm action={createStoreAction} />
    </div>
  );
}
