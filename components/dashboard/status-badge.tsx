import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExpansionStatus, PKSStatus } from "@/types";

interface ExpansionBadgeProps {
  status: ExpansionStatus;
}

const expansionConfig: Record<ExpansionStatus, { label: string; dot: string; className: string }> = {
  open: { label: "Open", dot: "bg-emerald-500", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  conditional: { label: "Conditional", dot: "bg-amber-500", className: "border-amber-200 bg-amber-50 text-amber-700" },
  closed: { label: "Closed", dot: "bg-red-500", className: "border-red-200 bg-red-50 text-red-700" },
};

export function ExpansionBadge({ status }: ExpansionBadgeProps) {
  const { label, dot, className } = expansionConfig[status];
  return (
    <Badge variant="outline" className={cn("gap-1 rounded-md px-2 py-0.5 h-auto text-xs font-medium", className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
      {label}
    </Badge>
  );
}

interface PKSBadgeProps {
  status: PKSStatus;
}

export function PKSBadge({ status }: PKSBadgeProps) {
  const isAvailable = status === "available";
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 rounded-md px-2 py-0.5 h-auto text-xs font-medium",
        isAvailable
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-border bg-muted text-muted-foreground"
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isAvailable ? "bg-emerald-500" : "bg-muted-foreground")} />
      {isAvailable ? "Available" : "Not Available"}
    </Badge>
  );
}
