import { notFound } from "next/navigation";
import { getStoreById } from "@/db/queries";
import { updateStoreAction } from "@/lib/actions/store";
import { StoreForm } from "../../store-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStorePage({ params }: Props) {
  const { id } = await params;
  const store = await getStoreById(Number(id));
  if (!store) notFound();

  const action = updateStoreAction.bind(null, store.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Edit Toko</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{store.kode} — {store.nama}</p>
      </div>
      <StoreForm action={action} defaultValues={store} isEdit />
    </div>
  );
}
