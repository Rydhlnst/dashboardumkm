import { getStores, getAreaStats } from "@/db/queries";
import { PromotionClient } from "./promotion-client";

export default async function PromotionPage() {
  const [stores, areaStats] = await Promise.all([getStores(), getAreaStats()]);
  return <PromotionClient stores={stores} areaStats={areaStats} />;
}
