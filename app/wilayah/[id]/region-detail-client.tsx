"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ExpansionBadge, PKSBadge } from "@/components/dashboard/status-badge";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  Store, Users, Megaphone, TrendingUp, MapPin,
  ShoppingBag, ClipboardList, CalendarDays,
} from "lucide-react";
import type { Region } from "@/types";

interface RegionDetailClientProps {
  region: Region;
}

export function RegionDetailClient({ region }: RegionDetailClientProps) {
  const promoPct = Math.round((region.promotionInstalled / region.promotionTotal) * 100);

  const umkmPieData = [
    { name: "Active UMKM", value: region.activeUMKM, color: "#16a34a" },
    { name: "Inactive", value: region.storeCount - region.activeUMKM, color: "#e2e8f0" },
  ];

  const monthlyData = [
    { month: "Jan", store: Math.round(region.storeCount * 0.82), umkm: Math.round(region.activeUMKM * 0.78) },
    { month: "Feb", store: Math.round(region.storeCount * 0.86), umkm: Math.round(region.activeUMKM * 0.82) },
    { month: "Mar", store: Math.round(region.storeCount * 0.88), umkm: Math.round(region.activeUMKM * 0.85) },
    { month: "Apr", store: Math.round(region.storeCount * 0.91), umkm: Math.round(region.activeUMKM * 0.88) },
    { month: "May", store: Math.round(region.storeCount * 0.95), umkm: Math.round(region.activeUMKM * 0.92) },
    { month: "Jun", store: Math.round(region.storeCount * 0.98), umkm: Math.round(region.activeUMKM * 0.96) },
    { month: "Jul", store: region.storeCount, umkm: region.activeUMKM },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-start gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{region.name}</h1>
            <ExpansionBadge status={region.expansionStatus} />
            <PKSBadge status={region.pksStatus} />
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kabupaten/Kota — Sulawesi Tengah</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs">
            <TrendingUp className={`w-3 h-3 ${region.trend === "up" ? "text-emerald-500" : region.trend === "down" ? "text-red-500" : "text-muted-foreground"}`} />
            {region.trend === "up" ? "+" : ""}{region.trendValue}% this quarter
          </Badge>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Stores", value: region.storeCount, icon: Store, color: "text-red-600", bg: "bg-red-50" },
          { label: "Active UMKM", value: region.activeUMKM, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Participants", value: region.participants, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Items", value: region.activeItems, icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="h-9">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="store" className="text-xs">Store</TabsTrigger>
          <TabsTrigger value="umkm" className="text-xs">UMKM</TabsTrigger>
          <TabsTrigger value="promotion" className="text-xs">Promotion</TabsTrigger>
          <TabsTrigger value="socialization" className="text-xs">Socialization</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Chart */}
            <Card className="border-border/60">
              <CardHeader className="pb-2 px-5 pt-5">
                <SectionHeader title="Monthly Growth" description="Store & UMKM trend" iconSlot={<TrendingUp className="w-4 h-4 text-muted-foreground" />} />
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData} barSize={12}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                    />
                    <Bar dataKey="store" name="Stores" fill="#dc2626" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="umkm" name="UMKM" fill="#16a34a" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* UMKM Pie */}
            <Card className="border-border/60">
              <CardHeader className="pb-2 px-5 pt-5">
                <SectionHeader title="UMKM Breakdown" description="Active vs. inactive stores" iconSlot={<Users className="w-4 h-4 text-muted-foreground" />} />
              </CardHeader>
              <CardContent className="px-5 pb-5 flex flex-col items-center">
                <div className="relative w-full" style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={umkmPieData} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {umkmPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold">{Math.round((region.activeUMKM / region.storeCount) * 100)}%</span>
                    <span className="text-[10px] text-muted-foreground">Active</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  {umkmPieData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      {d.name}: <span className="font-semibold text-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Promotion Progress */}
          <Card className="border-border/60">
            <CardHeader className="pb-2 px-5 pt-5">
              <SectionHeader title="Promotion Coverage" description="Installed vs. total stores" iconSlot={<Megaphone className="w-4 h-4 text-muted-foreground" />} />
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Materials Installed</span>
                <span className="font-semibold">{region.promotionInstalled} / {region.promotionTotal} stores</span>
              </div>
              <Progress value={promoPct} className="h-2" />
              <p className="text-xs text-muted-foreground">{promoPct}% coverage — {region.promotionTotal - region.promotionInstalled} stores remaining</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STORE */}
        <TabsContent value="store" className="mt-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2 px-5 pt-5">
              <SectionHeader title="Store List" description={`${region.storeCount} stores in ${region.name}`} iconSlot={<Store className="w-4 h-4 text-muted-foreground" />} />
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {Array.from({ length: region.storeCount }, (_, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs">
                    <Store className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span className="font-medium text-foreground">{region.name} {String(i + 1).padStart(2, "0")}</span>
                    <span className="ml-auto text-muted-foreground">Active</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UMKM */}
        <TabsContent value="umkm" className="mt-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2 px-5 pt-5">
              <SectionHeader title="UMKM Partners" description={`${region.activeUMKM} active partners`} iconSlot={<Users className="w-4 h-4 text-muted-foreground" />} />
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.from({ length: region.activeUMKM }, (_, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-border/60 bg-muted/20">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-emerald-700">U{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium">UMKM Partner {String(i + 1).padStart(3, "0")}</p>
                      <p className="text-[10px] text-muted-foreground">{region.name} · Active</p>
                    </div>
                    <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROMOTION */}
        <TabsContent value="promotion" className="mt-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2 px-5 pt-5">
              <SectionHeader title="Promotion Detail" description="Per-store promotion status" iconSlot={<Megaphone className="w-4 h-4 text-muted-foreground" />} />
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-2">
                {Array.from({ length: region.promotionTotal }, (_, i) => {
                  const installed = i < region.promotionInstalled;
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${installed ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                        <span className="text-foreground">{region.name} {String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] h-4 px-1.5 ${installed ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-muted-foreground"}`}>
                        {installed ? "Installed" : "Pending"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOCIALIZATION */}
        <TabsContent value="socialization" className="mt-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2 px-5 pt-5">
              <SectionHeader title="Socialization Data" description="Training & MD curation progress" iconSlot={<CalendarDays className="w-4 h-4 text-muted-foreground" />} />
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                  <p className="text-2xl font-bold">{region.participants}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Participants</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                  <p className="text-2xl font-bold">{region.mdProgress}%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">MD Progress</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Overall MD Curation Progress</span>
                  <span className="font-semibold">{region.mdProgress}%</span>
                </div>
                <Progress value={region.mdProgress} className="h-2" />
              </div>
              {region.newStores.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">New Store Pipeline</p>
                  <div className="space-y-1.5">
                    {region.newStores.map((store) => (
                      <div key={store} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Store className="w-3 h-3" />
                        <span>{store}</span>
                        <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1.5">Planned</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
