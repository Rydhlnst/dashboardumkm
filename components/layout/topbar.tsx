"use client";

import { Bell, Download, SlidersHorizontal, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const today = format(new Date(), "EEEE, dd MMMM yyyy");

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-30 flex items-center px-6 gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden w-8 h-8">
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-60">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {title && (
        <div className="flex flex-col leading-tight">
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div className="flex-1 max-w-sm hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search region, store, UMKM..."
            className="pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-muted-foreground hidden sm:block">{today}</span>
        <Separator orientation="vertical" className="h-5 hidden sm:block" />
        <Button variant="ghost" size="icon" className="w-8 h-8 relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[9px] bg-red-600 text-white border-0">
            3
          </Badge>
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs hidden sm:flex">
          <SlidersHorizontal className="w-3 h-3" />
          Filter
        </Button>
        <Button size="sm" className="h-8 gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white">
          <Download className="w-3 h-3" />
          Export
        </Button>
      </div>
    </header>
  );
}
