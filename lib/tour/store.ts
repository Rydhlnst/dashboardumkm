"use client";

import { create } from "zustand";

const STORAGE_KEY = "umkm-tour-enabled";

interface TourState {
  enabled: boolean;
  running: boolean;
  stepIndex: number;
  routeKey: string | null;
  setEnabled: (v: boolean) => void;
  start: (routeKey: string) => void;
  stop: () => void;
  setStepIndex: (i: number) => void;
  next: () => void;
}

function readInitialEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return true;
  return raw === "1";
}

export const useTour = create<TourState>((set, get) => ({
  enabled: readInitialEnabled(),
  running: false,
  stepIndex: 0,
  routeKey: null,
  setEnabled: (v) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    }
    set({ enabled: v, running: v ? get().running : false });
  },
  start: (routeKey) => set({ running: true, stepIndex: 0, routeKey }),
  stop: () => set({ running: false, stepIndex: 0 }),
  setStepIndex: (i) => set({ stepIndex: i }),
  next: () => set((s) => ({ stepIndex: s.stepIndex + 1 })),
}));
