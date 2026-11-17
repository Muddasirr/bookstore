"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { PRODUCTS, classLabel, formatRs, getProduct } from "@/lib/data";
import { Book3D } from "@/components/Book3D";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard, useAddToCart } from "@/components/ProductCard";
import { QtyStepper } from "@/components/CartDrawer";
import { PageHead } from "@/components/PageHead";
import { useCart, useHydrated } from "@/lib/store";

export function ProductView({ slug }: { slug: string }) {
  const p = getProduct(slug)!;
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const addToCart = useAddToCart();
  const btn = useRef<HTMLButtonElement>(null);
  const saved = useCart((s) => s.saved.includes(p.id));
  const toggleSaved = useCart((s) => s.toggleSaved);
  const h = useHydrated();

  const rot = useMotionValue(-28);
  const rotS = useSpring(rot, { stiffness: 120, damping: 18 });

  const related = PRODUCTS.filter((x) => x.id !== p.id && (p.cls ? x.cls === p.cls : x.category === p.category)).slice(0, 4);
  const cat = p.category[0].toUpperCase() + p.category.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHead crumbs={[["Home", "/"], [cat, `/shop?cat=${p.category}`], [p.name, `/product/${p.slug}`]]} title="" />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid h-[400px] place-items-center overflow-hidden rounded-[28px] sm:h-[460px] sm:rounded-[32px] bg-[radial-gradient(circle_at_50%_35%,#ffffff,#e9e2d4_70%)] lg:h-[560px]"
        >
          {p.kind === "book" ? (
            <>
              <motion.div
                className="cursor-grab touch-pan-y scale-[.7] active:cursor-grabbing sm:scale-100 [perspective:1200px]"
                onPan={(_, info) => rot.set(Math.max(-170, Math.min(40, rot.get() + info.delta.x * 0.6)))}
              >
                <motion.div style={{ rotateY: rotS, rotateX: 4, transformStyle: "preserve-3d" }} animate={{ x: open ? 70 : 0 }}>
                  <Book3D
                    inside
                    open={open}
                    color={p.color}
                    title={p.subject ?? p.name}
                    label={p.cls ? classLabel(p.cls) : ""}
                    num={/^\d+$/.test(p.cls ?? "") ? p.cls : p.cls?.slice(0, 2)}
                    w={230}
                    h={310}
                    d={40}
                  />
                </motion.div>
              </motion.div>
              <div className="absolute bottom-16 h-8 w-72 rounded-[50%] bg-ink/20 blur-2xl" />
              <div className="absolute inset-x-3 bottom-4 flex flex-wrap justify-center gap-2 sm:bottom-5">
                <button onClick={() => setOpen((o) => !o)} className="rounded-full bg-paper px-4 py-2 text-[12px] shadow ring-1 ring-line hover:ring-brand">
                  {open ? "Close the cover" : "Look inside"}
                </button>
                {[
                  ["Front", -20],
                  ["Spine", 70],
                  ["Back", -160],
                ].map(([l, v]) => (
                  <button key={l} onClick={() => rot.set(v as number)} className="rounded-full bg-paper/70 px-3 py-2 text-[12px] ring-1 ring-line hover:bg-paper">
                    {l}
                  </button>
                ))}
              </div>
              <p className="absolute left-5 top-5 text-[11px] uppercase tracking-[0.2em] text-muted">Drag to turn ↔</p>
            </>
          ) : (
            <motion.div className="h-[80%] w-[80%]" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <ProductArt p={p} size={2} interactive={false} />
            </motion.div>
          )}
          {p.badge && <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase">{p.badge}</span>}
        </motion.div>

        <motion.div initial="h" animate="s" transition={{ staggerChildren: 0.07, delayChildren: 0.2 }} className="flex flex-col">
          {[
            <p key="1" className="text-[11px] uppercase tracking-[0.2em] text-muted">
              {p.cls ? `${classLabel(p.cls)} · ${p.subject}` : cat}
            </p>,
            <h1 key="2" className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              {p.name}
            </h1>,
            <p key="3" className="mt-3 text-sm">
              <span className="text-accent-2">{"★".repeat(Math.round(p.rating))}</span> <span className="text-muted">{p.rating.toFixed(1)} · {p.reviews} reviews</span>
            </p>,
            <div key="4" className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold">{formatRs(p.price)}</span>
              {p.compareAt && <span className="text-muted line-through">{formatRs(p.compareAt)}</span>}
              {p.compareAt && <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[12px] font-semibold">Save {formatRs(p.compareAt - p.price)}</span>}
            </div>,
            <p key="5" className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
              {p.desc}
            </p>,
            <div key="6" className="mt-8 flex flex-wrap items-center gap-3">
              <QtyStepper qty={qty} onChange={(n) => setQty(Math.max(1, n))} />
              <motion.button
                ref={btn}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(p, btn.current, qty)}
                className="h-12 flex-1 rounded-full bg-brand px-8 text-[15px] font-semibold text-white transition-colors hover:bg-accent hover:text-ink sm:flex-none"
              >
                Add to cart · {formatRs(p.price * qty)}
              </motion.button>
              <button onClick={() => toggleSaved(p.id)} className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-line hover:ring-brand" aria-label="Save">
                <motion.span key={String(saved)} initial={{ scale: 0.3 }} animate={{ scale: 1 }} className={h && saved ? "text-berry" : ""}>
                  {h && saved ? "♥" : "♡"}
                </motion.span>
              </button>
            </div>,
            <div key="7" className="mt-8 grid grid-cols-3 gap-2 text-[11.5px] sm:gap-3 sm:text-[12px]">
              {["Free covering on full sets", "Delivery in 1–2 days", "Easy exchange in 7 days"].map((t) => (
                <div key={t} className="rounded-2xl bg-paper p-3 ring-1 ring-line">
                  {t}
                </div>
              ))}
            </div>,
            <div key="8" className="mt-8">
              <div className="flex gap-6 border-b border-line">
                {["Details", "Delivery", "Returns"].map((t, i) => (
                  <button key={t} onClick={() => setTab(i)} className={`relative pb-3 text-sm ${tab === i ? "text-ink" : "text-muted"}`}>
                    {t}
                    {tab === i && <motion.span layoutId="pd-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="pt-4 text-[14px] leading-relaxed text-muted">
                  {
                    [
                      p.kind === "book" ? "Paperback, 2026–27 edition. Prescribed by partner schools; we confirm edition and ISBN before dispatch." : "Brand-new stock. Colours may vary slightly from the illustration.",
                      "Free across Karachi on orders over Rs 5,000. Otherwise Rs 200. Same-evening pickup from our Gulshan store.",
                      "Unused items can be exchanged within 7 days with the receipt. Covered or labelled books cannot be returned.",
                    ][tab]
                  }
                </motion.p>
              </AnimatePresence>
            </div>,
          ].map((el, i) => (
            <motion.div key={i} variants={{ h: { opacity: 0, y: 20 }, s: { opacity: 1, y: 0 } }}>
              {el}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl">{p.cls ? `More for ${classLabel(p.cls)}` : "You might also need"}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {related.map((r, i) => (
              <ProductCard key={r.id} p={r} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
