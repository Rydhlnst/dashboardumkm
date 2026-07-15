import { getUMKMProducts } from "@/db/queries";
import { UMKMClient } from "./umkm-client";

export default async function UMKMPage() {
  const products = await getUMKMProducts();
  return <UMKMClient products={products} />;
}
