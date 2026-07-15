import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Dashboard UMKM — Alfamidi Branch Palu",
  description: "Executive monitoring dashboard for Alfamidi UMKM Branch Palu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full antialiased", inter.variable)}>
      <body className="min-h-full bg-background text-foreground font-sans">
        <Sidebar />
        <div className="lg:pl-60 flex flex-col min-h-screen">
          <Topbar
            title="Dashboard UMKM"
            subtitle="Alfamidi Branch Palu — Sulawesi Tengah"
          />
          <main className="flex-1 p-6">
            {children}
          </main>
          <footer className="px-6 py-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
            <span>Alfamidi UMKM Dashboard © 2025</span>
            <span>Branch Palu — Sulawesi Tengah</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
