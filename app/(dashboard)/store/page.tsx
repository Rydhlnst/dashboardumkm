import { getStores } from "@/db/queries";
import { StoreClient } from "./store-client";

export default async function StorePage() {
  const stores = await getStores();
  return <StoreClient stores={stores} />;
}
