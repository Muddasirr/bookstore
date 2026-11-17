"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { classLabel, formatRs, type Product } from "@/lib/data";
import { Book3D } from "./Book3D";
import { useAddToCart } from "./ProductCard";

/** Pulled-off-the-shelf view: the book swings from spine-on to cover-on, then its cover opens. */
export function BookModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const addToCart = useAddToCart();
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
    if (!product) return;
    const t = setTimeout(() => setOpen(true), 900);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-paper text-ink shadow-2xl md:grid-cols-2"
            initial={{ y: 60, scale: 0.94 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <div className="relative grid h-80 place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#fff,#e9e2d4)] md:h-[420px] [perspective:1100px]">
              <motion.div
                initial={{ rotateY: 88, x: -120, rotateZ: -8 }}
                animate={{ rotateY: open ? -18 : -24, x: open ? 60 : 0, rotateZ: 0 }}
                transition={{ type: "spring", stiffness: 70, damping: 14 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Book3D
                  open={open}
                  color={product.color}
                  title={product.subject ?? product.name}
                  label={product.cls ? classLabel(product.cls) : ""}
                  num={/^\d+$/.test(product.cls ?? "") ? product.cls : product.cls?.slice(0, 2)}
                  w={170}
                  h={230}
                  d={30}
                />
              </motion.div>
              <div className="absolute bottom-10 h-6 w-48 rounded-[50%] bg-ink/20 blur-xl" />
              <button onClick={() => setOpen((o) => !o)} className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-paper/80 px-3 py-1 text-[11px] text-muted shadow hover:text-ink">
                {open ? "Close cover" : "Open cover"}
              </button>
            </div>
            <motion.div
              className="flex flex-col p-7"
              initial="h"
              animate="s"
              transition={{ staggerChildren: 0.07, delayChildren: 0.25 }}
            >
              {[
                <p key="a" className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  {product.cls ? classLabel(product.cls) : product.category} · 2026–27 edition
                </p>,
                <h3 key="b" className="mt-2 font-display text-3xl">
                  {product.name}
                </h3>,
                <p key="c" className="mt-1 text-sm text-mustard-2">
                  {"★".repeat(Math.round(product.rating))} <span className="text-muted">({product.reviews})</span>
                </p>,
                <p key="d" className="mt-4 text-[14px] leading-relaxed text-muted">
                  {product.desc}
                </p>,
                <div key="e" className="mt-auto flex items-center gap-3 pt-6">
                  <span className="font-display text-2xl font-semibold">{formatRs(product.price)}</span>
                  <button
                    ref={btn}
                    onClick={() => addToCart(product, btn.current)}
                    className="ml-auto h-11 rounded-full bg-mustard px-5 text-sm font-semibold transition hover:brightness-95 active:scale-95"
                  >
                    Add to cart
                  </button>
                </div>,
                <Link key="f" href={`/product/${product.slug}`} className="mt-3 text-center text-[13px] text-muted underline-offset-4 hover:text-ink hover:underline">
                  See full details
                </Link>,
              ].map((el, i) => (
                <motion.div key={i} variants={{ h: { opacity: 0, x: 20 }, s: { opacity: 1, x: 0 } }} className={i === 4 ? "mt-auto" : ""}>
                  {el}
                </motion.div>
              ))}
            </motion.div>
            <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-sand hover:bg-line" aria-label="Close">
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
