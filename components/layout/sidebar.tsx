"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Store,
  Handshake,
  ShoppingBag,
  Megaphone,
  FileText,
  Settings,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Overview", href: "/overview", icon: BarChart3 },
  { label: "Wilayah", href: "/wilayah", icon: Map, badge: "12" },
  { label: "Ekspansi", href: "/expansion", icon: ArrowUpRight },
  { label: "UMKM", href: "/umkm", icon: Users },
  { label: "PKS / MoU", href: "/pks", icon: Handshake },
  { label: "Toko", href: "/store", icon: ShoppingBag },
  { label: "Promosi", href: "/promotion", icon: Megaphone },
  { label: "Laporan", href: "/reports", icon: FileText },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-40">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">A</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-sidebar-foreground">Alfamidi</span>
          <span className="text-xs text-muted-foreground">Branch Palu</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-2 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-red-50 text-red-700"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  isActive ? "text-red-600" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-medium">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <span className="text-red-700 text-xs font-semibold">SM</span>
          </div>
          <div className="flex flex-col leading-tight flex-1 min-w-0">
            <span className="text-xs font-medium text-sidebar-foreground truncate">Store Manager</span>
            <span className="text-[10px] text-muted-foreground truncate">admin@alfamidi.id</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
