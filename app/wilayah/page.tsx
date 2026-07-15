import Link from "next/link";
import { areaStats } from "@/data/area-stats";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AREA_SLUG: Record<string, string> = {
  PALU: "palu",
  DONGGALA: "donggala",
  SIGI: "sigi",
  "PARIGI MOUTONG": "parigi-moutong",
  POSO: "poso",
  "TOLI-TOLI": "tolitoli",
  BUOL: "buol",
  BANGGAI: "banggai",
  "TOJO UNA-UNA": "tojo-una-una",
  MAMUJU: "mamuju",
  PASANGKAYU: "pasangkayu",
  POHUWATO: "pohuwato",
};

export default function WilayahPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Wilayah</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {areaStats.length} wilayah — {areaStats.reduce((s, a) => s + a.totalStores, 0)} toko total
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {areaStats.map((a) => {
          const slug = AREA_SLUG[a.area] ?? a.area.toLowerCase().replace(/\s+/g, "-");
          return (
            <Link key={a.area} href={`/wilayah/${slug}`}>
              <Card className="border-border/50 hover:border-red-300 hover:shadow-sm transition-all cursor-pointer group">
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-red-700 transition-colors">
                        {a.area}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.totalStores} toko</p>
                    </div>
                    <Badge
                      variant={a.umkmCoverage >= 50 ? "default" : "secondary"}
                      className={
                        a.umkmCoverage >= 50
                          ? "bg-emerald-100 text-emerald-700 border-0 text-[10px]"
                          : "text-[10px]"
                      }
                    >
                      {a.umkmCoverage}%
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">UMKM Aktif</span>
                      <span className="font-medium">{a.umkmAktif}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Sarana Promosi</span>
                      <span className="font-medium">{a.saranaPromosi}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Belum UMKM</span>
                      <span className="font-medium text-amber-600">{a.totalStores - a.umkmAktif}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
