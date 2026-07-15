import { getAreaStats, getKPISummary, getUMKMProducts } from "@/db/queries";
import { OverviewClient } from "./overview-client";

export default async function OverviewPage() {
  const [areaStats, kpiSummary, products] = await Promise.all([
    getAreaStats(),
    getKPISummary(),
    getUMKMProducts(),
  ]);

  const prodAktif = products.filter((p) => p.keterangan === "AKTIF").length;
  const prodPolitis = products.filter((p) => p.keterangan === "UMKM POLITIS").length;
  const prodTidakAktif = products.filter((p) => p.keterangan === "TIDAK AKTIF").length;

  return (
    <OverviewClient
      areaStats={areaStats}
      kpiSummary={kpiSummary}
      prodAktif={prodAktif}
      prodPolitis={prodPolitis}
      prodTidakAktif={prodTidakAktif}
    />
  );
}
