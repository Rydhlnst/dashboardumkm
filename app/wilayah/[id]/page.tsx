import { notFound } from "next/navigation";
import Link from "next/link";
import { regions } from "@/data/dashboard";
import { RegionDetailClient } from "./region-detail-client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return regions.map((r) => ({ id: r.id }));
}

export default async function RegionDetailPage({ params }: RegionPageProps) {
  const { id } = await params;
  const region = regions.find((r) => r.id === id);
  if (!region) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8" asChild>
          <Link href="/">
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
        </Button>
        <span className="text-muted-foreground text-xs">/</span>
        <span className="text-xs text-muted-foreground">Wilayah</span>
        <span className="text-muted-foreground text-xs">/</span>
        <span className="text-xs font-medium">{region.name}</span>
      </div>
      <RegionDetailClient region={region} />
    </div>
  );
}
