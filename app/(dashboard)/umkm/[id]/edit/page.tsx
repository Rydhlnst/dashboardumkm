import { notFound } from "next/navigation";
import { getUMKMProductById } from "@/db/queries";
import { updateUMKMProductAction } from "@/lib/actions/umkm";
import { UMKMForm } from "../../umkm-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditUMKMPage({ params }: Props) {
  const { id } = await params;
  const product = await getUMKMProductById(Number(id));
  if (!product) notFound();

  const action = updateUMKMProductAction.bind(null, product.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Edit PLU UMKM</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{product.kodeSupp} — {product.namaProduk}</p>
      </div>
      <UMKMForm action={action} defaultValues={product} isEdit />
    </div>
  );
}
