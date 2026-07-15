"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteStoreAction } from "@/lib/actions/store";

export function DeleteStoreButton({ id, nama }: { id: number; nama: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <Button
          size="sm"
          variant="destructive"
          className="h-6 text-[10px] px-2"
          onClick={async () => {
            await deleteStoreAction(id);
          }}
        >
          Hapus
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 text-[10px] px-2"
          onClick={() => setConfirming(false)}
        >
          Batal
        </Button>
      </span>
    );
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      title={`Hapus ${nama}`}
      className="h-6 w-6 text-muted-foreground hover:text-red-600"
      onClick={() => setConfirming(true)}
    >
      <Trash2 className="w-3 h-3" />
    </Button>
  );
}
