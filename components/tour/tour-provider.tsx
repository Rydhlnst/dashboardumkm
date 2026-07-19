"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { EventData } from "react-joyride";
import { toast } from "sonner";
import { useTour } from "@/lib/tour/store";
import { TOURS, tourKeyForPath } from "@/lib/tour/steps";

const Joyride = dynamic(
  () => import("react-joyride").then((m) => m.Joyride),
  { ssr: false }
);

function setNativeInputValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = Object.getPrototypeOf(el);
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function setNativeSelectValue(el: HTMLSelectElement, value: string) {
  const proto = Object.getPrototypeOf(el);
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export function TourProvider() {
  const pathname = usePathname();
  const { enabled, running, stepIndex, start, stop, setStepIndex } = useTour();
  const [mounted, setMounted] = useState(false);
  const lastAutoStartedPath = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const routeKey = useMemo(() => tourKeyForPath(pathname), [pathname]);
  const config = routeKey ? TOURS[routeKey] : null;

  useEffect(() => {
    if (!enabled || !mounted || !routeKey) return;
    if (lastAutoStartedPath.current === pathname) return;
    lastAutoStartedPath.current = pathname;
    const seenKey = `umkm-tour-seen-${routeKey}`;
    if (typeof window !== "undefined" && window.localStorage.getItem(seenKey) === "1") {
      return;
    }
    const t = setTimeout(() => {
      start(routeKey);
      if (typeof window !== "undefined") window.localStorage.setItem(seenKey, "1");
    }, 350);
    return () => clearTimeout(t);
  }, [pathname, enabled, mounted, routeKey, start]);

  useEffect(() => {
    if (!running || !config?.autofill) return;
    const fill = config.autofill[stepIndex];
    if (!fill) return;
    const t = setTimeout(() => {
      const el = document.querySelector(fill.selector) as
        | HTMLInputElement
        | HTMLSelectElement
        | null;
      if (!el) return;
      if (fill.kind === "input") {
        setNativeInputValue(el as HTMLInputElement, fill.value);
      } else {
        setNativeSelectValue(el as HTMLSelectElement, fill.value);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [running, stepIndex, config]);

  useEffect(() => {
    if (!running || !config?.verify) return;
    const verifyStepIdx = config.steps.findIndex((s) => {
      const t = typeof s.target === "string" ? s.target : "";
      return t.includes("verify");
    });
    if (verifyStepIdx === -1 || stepIndex !== verifyStepIdx) return;
    const form = document.querySelector("form");
    if (!form) return;
    const fd = new FormData(form);
    const missing: string[] = [];
    for (const [name, expected] of Object.entries(config.verify)) {
      const actual = fd.get(name);
      if (typeof actual !== "string" || actual.trim() === "") {
        missing.push(name);
      } else if (actual !== expected) {
        missing.push(`${name} ("${actual}" ≠ "${expected}")`);
      }
    }
    if (missing.length === 0) {
      toast.success("Semua data terisi dengan benar", {
        description: `${Object.keys(config.verify).length} field terverifikasi.`,
      });
    } else {
      toast.warning("Verifikasi menemukan field yang belum sesuai", {
        description: missing.join(", "),
      });
    }
  }, [running, stepIndex, config]);

  const onEvent = (data: EventData) => {
    const { action, index, status, type } = data;

    if (status === "finished" || status === "skipped") {
      stop();
      return;
    }

    if (type === "step:after") {
      if (action === "prev") {
        setStepIndex(Math.max(0, index - 1));
      } else if (action === "next" || action === "close") {
        setStepIndex(index + 1);
      } else if (action === "skip") {
        stop();
      }
    } else if (type === "error:target_not_found") {
      setStepIndex(index + 1);
    }
  };

  if (!mounted || !enabled || !config) return null;

  return (
    <Joyride
      steps={config.steps}
      run={running}
      stepIndex={stepIndex}
      continuous
      scrollToFirstStep
      onEvent={onEvent}
      locale={{
        back: "Kembali",
        close: "Tutup",
        last: "Selesai",
        next: "Lanjut",
        skip: "Lewati",
      }}
    />
  );
}
