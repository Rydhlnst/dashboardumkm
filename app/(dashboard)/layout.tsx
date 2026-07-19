import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TourProvider } from "@/components/tour/tour-provider";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TourProvider />
      <Toaster />
      <Sidebar />
      <div className="lg:pl-60 flex flex-col min-h-screen">
        <Topbar
          title="Dashboard UMKM"
          subtitle="Alfamidi Branch Palu — Sulawesi Tengah"
        />
        <main className="flex-1 p-6">{children}</main>
        <footer className="px-6 py-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
          <span>Alfamidi UMKM Dashboard © 2025</span>
          <span>Branch Palu — Sulawesi Tengah</span>
        </footer>
      </div>
    </>
  );
}
