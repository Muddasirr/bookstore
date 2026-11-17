"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store";
import { FREE_DELIVERY, formatRs, getById } from "@/lib/data";
import { ProductArt } from "./ProductArt";

export function useCartLines() {
  const lines = useCart((s) => s.lines);
  const items = lines.map((l) => ({ ...l, p: getById(l.id)! })).filter((l) => l.p);
  const subtotal = items.reduce((a, l) => a + l.p.price * l.qty, 0);
  return { items, subtotal, count: items.reduce((a, l) => a + l.qty, 0) };
}

export function DeliveryMeter({ subtotal }: { subtotal: number }) {
  const pct = Math.min(1, subtotal / FREE_DELIVERY);
  return (
    <div>
      <p className="text-[13px]">
        {pct >= 1 ? (
          <span className="font-medium text-leaf">You&apos;ve unlocked free delivery 🎉</span>
        ) : (
          <>
            Add <b>{formatRs(FREE_DELIVERY - subtotal)}</b> more for free delivery
          </>
        )}
      </p>
      <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-sand">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mustard to-leaf"
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        <motion.div
          className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-paper bg-navy"
          animate={{ left: `${pct * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

export function QtyStepper({ qty, onChange, small }: { qty: number; onChange: (n: number) => void; small?: boolean }) {
  return (
    <div className={`flex items-center rounded-full border border-line bg-paper ${small ? "h-7" : "h-10"}`}>
      <button className={`grid h-full place-items-center rounded-full hover:bg-sand ${small ? "w-7" : "w-10"}`} onClick={() => onChange(qty - 1)} aria-label="Decrease">
        −
      </button>
      <span className={`relative overflow-hidden text-center text-sm tabular-nums ${small ? "w-6" : "w-8"}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={qty} className="block" initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}>
            {qty}
          </motion.span>
        </AnimatePresence>
      </span>
      <button className={`grid h-full place-items-center rounded-full hover:bg-sand ${small ? "w-7" : "w-10"}`} onClick={() => onChange(qty + 1)} aria-label="Increase">
        +
      </button>
    </div>
  );
}

export function CartDrawer() {
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { items, subtotal, count } = useCartLines();

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[420px] flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-xl font-semibold">
                Your cart <span className="text-sm font-normal text-muted">({count})</span>
              </h2>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-sand" aria-label="Close">
                ✕
              </button>
            </div>
            <div className="border-b border-line px-5 py-4">
              <DeliveryMeter subtotal={subtotal} />
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2">
              {items.length === 0 && <EmptyShelf onClose={() => setOpen(false)} />}
              <AnimatePresence initial={false}>
                {items.map((l, i) => (
                  <motion.div
                    key={l.id}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.03 } }}
                    exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                    className="group flex gap-3 rounded-xl p-2 hover:bg-cream"
                  >
                    <div className="h-16 w-14 shrink-0 rounded-lg bg-cream">
                      <ProductArt p={l.p} size={0.36} interactive={false} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="truncate text-[13.5px] font-medium">{l.p.name}</p>
                        <p className="shrink-0 text-[13.5px] font-semibold">{formatRs(l.p.price * l.qty)}</p>
                      </div>
                      <p className="text-[12px] text-muted">{formatRs(l.p.price)} each</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <QtyStepper small qty={l.qty} onChange={(n) => setQty(l.id, n)} />
                        <button onClick={() => remove(l.id)} className="text-[12px] text-muted underline-offset-2 hover:text-berry hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {items.length > 0 && (
              <div className="border-t border-line p-5">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-muted">Subtotal</span>
                  <motion.span key={subtotal} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-2xl font-semibold">
                    {formatRs(subtotal)}
                  </motion.span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-mustard font-semibold text-ink transition hover:brightness-95"
                >
                  Checkout →
                </Link>
                <Link href="/cart" onClick={() => setOpen(false)} className="mt-2 block text-center text-sm text-muted hover:text-ink">
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyShelf({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="relative h-20 w-48">
        <div className="shelf-plank absolute inset-x-0 bottom-0 h-3 rounded" />
        <motion.div
          className="absolute bottom-3 left-20 h-14 w-4 rounded-sm bg-berry"
          animate={{ rotate: [0, -18, -18, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "bottom left" }}
        />
      </div>
      <p className="mt-6 font-display text-lg">Your shelf is empty</p>
      <p className="mt-1 text-sm text-muted">Load a school list or pick a few things to get started.</p>
      <Link href="/book-lists" onClick={onClose} className="mt-5 rounded-full bg-navy px-5 py-2.5 text-sm text-white">
        Find your book list
      </Link>
    </div>
  );
}

/** Small book-shaped tokens that arc from the clicked button to the cart icon. */
export function FlyLayer() {
  const flies = useCart((s) => s.flies);
  const land = useCart((s) => s.land);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!flies.length) return;
    const el = document.getElementById("cart-target");
    const r = el?.getBoundingClientRect();
    if (r) setTarget({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }, [flies.length]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[80]">
      {target &&
        flies.map((f, i) => {
          const sx = f.from.left + f.from.width / 2;
          const sy = f.from.top + f.from.height / 2;
          const midY = Math.min(sy, target.y) - 140;
          return (
            <motion.div
              key={f.key}
              className="absolute left-0 top-0 h-7 w-5 rounded-[3px] shadow-lg"
              style={{ background: f.color, borderLeft: "3px solid rgba(0,0,0,.25)" }}
              initial={{ x: sx, y: sy, scale: 1.4, rotate: 0, opacity: 1 }}
              animate={{
                x: [sx, (sx + target.x) / 2, target.x - 10],
                y: [sy, midY, target.y - 14],
                scale: [1.4, 1.1, 0.5],
                rotate: [0, -200, -360],
                opacity: [1, 1, 0.6],
              }}
              transition={{ duration: 0.85, delay: (i % 8) * 0.06, ease: [0.45, 0, 0.2, 1] }}
              onAnimationComplete={() => land(f.key)}
            />
          );
        })}
    </div>
  );
}
