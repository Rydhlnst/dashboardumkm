import { getStores } from "@/db/queries";
import { PKSClient } from "./pks-client";

export default async function PKSPage() {
  const stores = await getStores();
  return <PKSClient stores={stores} />;
}
