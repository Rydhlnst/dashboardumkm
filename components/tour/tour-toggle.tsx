"use client";

import { usePathname } from "next/navigation";
import { HelpCircle, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTour } from "@/lib/tour/store";
import { tourKeyForPath } from "@/lib/tour/steps";
import { toast } from "sonner";

export function TourToggle() {
  const pathname = usePathname();
  const { enabled, setEnabled, start, stop, running } = useTour();

  const handleClick = () => {
    if (!enabled) {
      setEnabled(true);
      const key = tourKeyForPath(pathname);
      if (key) start(key);
      toast.success("Tutorial diaktifkan");
      return;
    }
    if (running) {
      stop();
      toast.info("Tutorial dijeda");
      return;
    }
    const key = tourKeyForPath(pathname);
    if (key) {
      start(key);
    }
  };

  const handleDisable = () => {
    setEnabled(false);
    stop();
    toast.info("Tutorial dimatikan");
  };

  return (
    <div className="flex items-center" data-tour="topbar-tour">
      <Button
        variant={enabled ? "default" : "outline"}
        size="icon"
        onClick={handleClick}
        className={
          enabled
            ? "h-8 w-8 bg-red-600 hover:bg-red-700 text-white"
            : "h-8 w-8"
        }
        title={
          enabled
            ? running
              ? "Jeda tutorial"
              : "Jalankan tutorial halaman ini"
            : "Aktifkan tutorial"
        }
        aria-label="Tutorial"
      >
        <HelpCircle className="w-4 h-4" />
      </Button>
      {enabled && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDisable}
          className="h-8 w-8 ml-1 text-muted-foreground"
          title="Matikan tutorial"
        >
          <PowerOff className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}
