"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useState, type MouseEvent } from "react";
import type { Product } from "@/lib/data";
import { formatRs } from "@/lib/data";
import { useCart, useHydrated } from "@/lib/store";
import { ProductArt } from "./ProductArt";

export function useAddToCart() {
  const add = useCart((s) => s.add);
  const fly = useCart((s) => s.fly);
  return (p: Product, el: HTMLElement | null, qty = 1) => {
    add(p.id, qty);
    if (el) fly(el.getBoundingClientRect(), p.color === "#ffffff" ? "#13265c" : p.color);
  };
}

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const addToCart = useAddToCart();
  const saved = useCart((s) => s.saved.includes(p.id));
  const toggleSaved = useCart((s) => s.toggleSaved);
  const h = useHydrated();
  const [added, setAdded] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const glow = useTransform([mx, my], ([x, y]: number[]) => `radial-gradient(240px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.75), transparent 60%)`);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group [perspective:1000px]"
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry }}
        className="relative overflow-hidden rounded-2xl border border-line/80 bg-paper transition-shadow duration-500 hover:shadow-[0_30px_50px_-25px_rgba(14,26,61,.35)]"
      >
        <Link href={`/product/${p.slug}`} className="block">
          <div className="relative h-56 bg-gradient-to-b from-[#f1ece2] to-[#e9e3d6] sm:h-60">
            <ProductArt p={p} />
            <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
            {p.badge && (
              <span
                className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${
                  p.badge === "Sale" ? "bg-mustard text-ink" : p.badge === "New" ? "bg-navy text-white" : "bg-berry text-white"
                }`}
              >
                {p.badge === "Sale" && p.compareAt ? `Save ${formatRs(p.compareAt - p.price)}` : p.badge}
              </span>
            )}
          </div>
          <div className="px-4 pb-4 pt-3">
            <p className="text-[11px] uppercase tracking-wider text-muted">{p.subject ? `${p.category} · ${p.cls}` : p.category}</p>
            <p className="mt-0.5 line-clamp-2 min-h-[2.6em] text-[14.5px] font-medium leading-snug">{p.name}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-semibold">{formatRs(p.price)}</span>
              {p.compareAt && <span className="text-[12px] text-muted line-through">{formatRs(p.compareAt)}</span>}
            </div>
          </div>
        </Link>
        <button
          onClick={() => toggleSaved(p.id)}
          aria-label="Save"
          className="absolute right-3 top-3 grid h-8 w-8 translate-y-1 place-items-center rounded-full bg-paper/90 opacity-0 shadow transition group-hover:translate-y-0 group-hover:opacity-100"
        >
          <motion.svg key={String(saved)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} width="15" height="15" viewBox="0 0 24 24" fill={h && saved ? "#b8236a" : "none"} stroke={h && saved ? "#b8236a" : "currentColor"} strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </motion.svg>
        </button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            addToCart(p, e.currentTarget);
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
          }}
          aria-label={`Add ${p.name} to cart`}
          className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-navy text-white shadow-md transition-colors hover:bg-mustard hover:text-ink"
        >
          <motion.span key={String(added)} initial={{ rotate: -90, scale: 0.4 }} animate={{ rotate: 0, scale: 1 }}>
            {added ? "✓" : "+"}
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
