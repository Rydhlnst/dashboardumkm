import { getStores, getUMKMProducts, getAreaStats, getKPISummary } from "@/db/queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function ReportsPage() {
  const [stores, umkmProducts, areaStats, kpiSummary] = await Promise.all([
    getStores(),
    getUMKMProducts(),
    getAreaStats(),
    getKPISummary(),
  ]);

  const umkmCoverage = Math.round((kpiSummary.umkmAktif / kpiSummary.totalStores) * 100);
  const promosiCoverage = Math.round((kpiSummary.saranaPromosiTerpasang / kpiSummary.totalStores) * 100);
  const topArea = areaStats[0];
  const lowestCoverage = [...areaStats].sort((a, b) => a.umkmCoverage - b.umkmCoverage)[0];

  const suppliersPerWilayah = Array.from(
    umkmProducts.reduce((map, p) => {
      if (!map.has(p.wilayah)) map.set(p.wilayah, new Set<string>());
      map.get(p.wilayah)!.add(p.kodeSupp);
      return map;
    }, new Map<string, Set<string>>())
  ).map(([wilayah, supps]) => ({ wilayah, count: supps.size }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Laporan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ringkasan eksekutif data UMKM Alfamidi Branch Palu
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Ringkasan Eksekutif</p>
          <p className="text-xs text-muted-foreground">Data toko aktif dan status UMKM</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Toko", value: kpiSummary.totalStores },
              { label: "Total Wilayah", value: kpiSummary.totalAreas },
              { label: "UMKM Coverage", value: `${umkmCoverage}%` },
              { label: "Promosi Coverage", value: `${promosiCoverage}%` },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 border border-border/40 rounded-lg">
                <p className="text-xl font-bold tabular-nums">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Wilayah Terbanyak Toko</p>
              <p className="text-muted-foreground">{topArea.area} — {topArea.totalStores} toko ({topArea.umkmCoverage}% UMKM aktif)</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Perlu Perhatian</p>
              <p className="text-muted-foreground">{lowestCoverage.area} — coverage UMKM hanya {lowestCoverage.umkmCoverage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Rekap per Wilayah</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Wilayah</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Toko</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">UMKM Aktif</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Belum UMKM</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Promosi</th>
                  <th className="text-right px-6 py-3 font-medium text-muted-foreground">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {areaStats.map((a) => (
                  <tr key={a.area} className="border-b border-border/30 hover:bg-muted/30">
                    <td className="px-6 py-2.5 font-medium">{a.area}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{a.totalStores}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">{a.umkmAktif}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-amber-600">{a.totalStores - a.umkmAktif}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-blue-600">{a.saranaPromosi}</td>
                    <td className="px-6 py-2.5 text-right tabular-nums">
                      <Badge
                        variant="secondary"
                        className={
                          a.umkmCoverage >= 70
                            ? "bg-emerald-100 text-emerald-700 border-0"
                            : a.umkmCoverage >= 40
                            ? "bg-amber-100 text-amber-700 border-0"
                            : "bg-red-100 text-red-700 border-0"
                        }
                      >
                        {a.umkmCoverage}%
                      </Badge>
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-medium">
                  <td className="px-6 py-2.5">Total</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{stores.length}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">{kpiSummary.umkmAktif}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-amber-600">{stores.length - kpiSummary.umkmAktif}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-blue-600">{kpiSummary.saranaPromosiTerpasang}</td>
                  <td className="px-6 py-2.5 text-right tabular-nums">{umkmCoverage}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Rekap Supplier UMKM per Wilayah</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Wilayah</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Supplier</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total PLU</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">PLU Aktif</th>
                  <th className="text-right px-6 py-3 font-medium text-muted-foreground">Politis</th>
                </tr>
              </thead>
              <tbody>
                {suppliersPerWilayah.map(({ wilayah, count }) => {
                  const wProducts = umkmProducts.filter((p) => p.wilayah === wilayah);
                  const aktif = wProducts.filter((p) => p.keterangan === "AKTIF").length;
                  const politis = wProducts.filter((p) => p.keterangan === "UMKM POLITIS").length;
                  return (
                    <tr key={wilayah} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="px-6 py-2.5 font-medium">{wilayah}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{count}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{wProducts.length}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">{aktif}</td>
                      <td className="px-6 py-2.5 text-right tabular-nums text-amber-600">{politis}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
