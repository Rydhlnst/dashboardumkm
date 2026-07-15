import { getStores, getAreaStats } from "@/db/queries";
import { ExpansionClient } from "./expansion-client";

export default async function ExpansionPage() {
  const [stores, areaStats] = await Promise.all([getStores(), getAreaStats()]);
  return <ExpansionClient stores={stores} areaStats={areaStats} />;
}
