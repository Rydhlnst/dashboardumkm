import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const INFO_ROWS = [
  { label: "Cabang", value: "Branch Palu" },
  { label: "Wilayah Operasional", value: "Sulawesi Tengah & Sulbar" },
  { label: "Area Manager", value: "Haris Bonifasius Manik" },
  { label: "Data Sumber", value: "DATA TOKO AKTIF UMKM & DATA UMKM" },
];

const DATA_ROWS = [
  { label: "Total Toko", value: "233 toko" },
  { label: "Total Wilayah", value: "12 area" },
  { label: "Total PLU UMKM", value: "158 PLU" },
  { label: "Versi Dataset", value: "2025" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Pengaturan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Informasi sistem dan konfigurasi dashboard
        </p>
      </div>

      {/* System info */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Informasi Cabang</p>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          {INFO_ROWS.map((row, i) => (
            <div key={row.label}>
              <div className="flex items-center justify-between px-6 py-3">
                <span className="text-xs text-muted-foreground">{row.label}</span>
                <span className="text-xs font-medium text-foreground">{row.value}</span>
              </div>
              {i < INFO_ROWS.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dataset info */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Informasi Dataset</p>
            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Aktif</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          {DATA_ROWS.map((row, i) => (
            <div key={row.label}>
              <div className="flex items-center justify-between px-6 py-3">
                <span className="text-xs text-muted-foreground">{row.label}</span>
                <span className="text-xs font-medium text-foreground">{row.value}</span>
              </div>
              {i < DATA_ROWS.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Source files */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Sumber Data</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              name: "DATA TOKO AKTIF UMKM DAN PEMASANGAN SARANA PROMOSI.xlsx",
              desc: "233 records — Status UMKM & sarana promosi per toko",
            },
            {
              name: "DATA UMKM.xlsx",
              desc: "158 records — Produk & supplier UMKM per wilayah",
            },
          ].map((f) => (
            <div key={f.name} className="p-3 border border-border/40 rounded-lg space-y-0.5">
              <p className="text-xs font-medium text-foreground">{f.name}</p>
              <p className="text-[11px] text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <p className="text-sm font-semibold">Tentang Dashboard</p>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>Dashboard ini digunakan untuk monitoring perkembangan UMKM mitra Alfamidi di Branch Palu, mencakup data toko aktif, status UMKM, dan pemasangan sarana promosi di seluruh wilayah operasional.</p>
          <p>Data diperbarui secara berkala sesuai laporan dari lapangan.</p>
        </CardContent>
      </Card>
    </div>
  );
}
