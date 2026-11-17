"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export type CartLine = { id: string; qty: number };

type Fly = { key: number; from: DOMRect; color: string };

type CartState = {
  lines: CartLine[];
  saved: string[];
  open: boolean;
  bump: number;
  flies: Fly[];
  add: (id: string, qty?: number) => void;
  addMany: (items: CartLine[]) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggleSaved: (id: string) => void;
  setOpen: (o: boolean) => void;
  fly: (from: DOMRect, color: string) => void;
  land: (key: number) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      saved: [],
      open: false,
      bump: 0,
      flies: [],
      add: (id, qty = 1) =>
        set((s) => {
          const ex = s.lines.find((l) => l.id === id);
          return {
            lines: ex ? s.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...s.lines, { id, qty }],
          };
        }),
      addMany: (items) =>
        set((s) => {
          const map = new Map(s.lines.map((l) => [l.id, l.qty]));
          items.forEach((i) => map.set(i.id, (map.get(i.id) ?? 0) + i.qty));
          return { lines: [...map].map(([id, qty]) => ({ id, qty })) };
        }),
      setQty: (id, qty) =>
        set((s) => ({ lines: qty <= 0 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty } : l)) })),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      clear: () => set({ lines: [] }),
      toggleSaved: (id) => set((s) => ({ saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
      setOpen: (open) => set({ open }),
      fly: (from, color) => set((s) => ({ flies: [...s.flies, { key: Date.now() + Math.random(), from, color }] })),
      land: (key) => set((s) => ({ flies: s.flies.filter((f) => f.key !== key), bump: s.bump + 1 })),
    }),
    { name: "honorable-cart", partialize: (s) => ({ lines: s.lines, saved: s.saved }) }
  )
);

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
