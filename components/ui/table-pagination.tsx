"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({ page, totalPages, totalItems, pageSize, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
      <span className="text-xs text-muted-foreground">
        {from}–{to} dari {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>
        <span className="text-xs tabular-nums px-1.5 min-w-[3rem] text-center">
          {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
