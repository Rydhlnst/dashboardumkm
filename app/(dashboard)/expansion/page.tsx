import { getStores, getAreaStats, getAreaSettings } from "@/db/queries";
import { ExpansionClient } from "./expansion-client";
import { AreaSettingsEditor } from "./area-settings-editor";

export default async function ExpansionPage() {
  const [stores, areaStats, areaSettings] = await Promise.all([
    getStores(),
    getAreaStats(),
    getAreaSettings(),
  ]);
  return (
    <div className="space-y-6">
      <AreaSettingsEditor settings={areaSettings} />
      <ExpansionClient stores={stores} areaStats={areaStats} />
    </div>
  );
}
