"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState, type PointerEvent as RPointerEvent } from "react";
import { PRODUCTS, SHELF_GROUPS, classLabel, formatRs, type Product } from "@/lib/data";
import { BookSpine, pseudo } from "../BookSpine";
import { SectionTitle } from "./Departments";
import { BookModal } from "../BookModal";

export function ReadingRoom() {
  const [group, setGroup] = useState(SHELF_GROUPS[1].key);
  const [active, setActive] = useState<Product | null>(null);
  const g = SHELF_GROUPS.find((x) => x.key === group)!;

  // Lamp glow: a pre-painted gradient that is only *moved* (transform), never repainted.
  const lx = useMotionValue(400);
  const ly = useMotionValue(120);
  const sx = useSpring(lx, { stiffness: 80, damping: 20 });
  const sy = useSpring(ly, { stiffness: 80, damping: 20 });
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    lx.set(e.clientX - r.left);
    ly.set(e.clientY - r.top);
  };

  return (
    <section className="relative overflow-hidden bg-brand py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,#2f6d58,transparent)] opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle light eyebrow="The reading room" title="Pull a book off the shelf" italic={["shelf"]} sub="Every textbook we stock, shelved by class. Lift one out and open it to look inside." />
          <div className="no-scrollbar relative flex max-w-full overflow-x-auto rounded-full bg-white/10 p-1 ring-1 ring-white/15">
            {SHELF_GROUPS.map((s) => (
              <button key={s.key} onClick={() => setGroup(s.key)} className={`relative shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[12.5px] transition-colors sm:px-4 sm:text-[13px] ${group === s.key ? "text-ink" : "text-white/75 hover:text-white"}`}>
                {group === s.key && <motion.span layoutId="shelf-tab" className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <span className="relative">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 12 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1400 }}
          className="relative mt-8 sm:mt-12"
        >
          {/* cabinet frame */}
          <div onPointerMove={onMove} className="wood relative rounded-[22px] p-2.5 sm:rounded-[28px] sm:p-4 shadow-[0_60px_80px_-30px_rgba(0,0,0,.7)] sm:p-6">
            <div className="wood-dark relative overflow-hidden rounded-[16px] px-2 pb-2 pt-8 shadow-[inset_0_20px_40px_rgba(0,0,0,.6)] sm:px-6">
              <motion.div
                className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[1040px] w-[1040px] rounded-full mix-blend-screen will-change-transform [@media(hover:hover)]:block"
                style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", background: "radial-gradient(closest-side, rgba(255,214,140,.28), transparent)" }}
              />
              <AnimatePresence mode="wait">
                <motion.div key={group} className="grid gap-x-8 sm:grid-cols-2" exit={{ opacity: 1 }}>
                  {g.classes.map((c, i) => (
                    <Shelf key={c} cls={c} index={i} onPick={setActive} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <NoteCard />
        </motion.div>
      </div>
      <BookModal product={active} onClose={() => setActive(null)} />
    </section>
  );
}

function Shelf({ cls, index, onPick }: { cls: string; index: number; onPick: (p: Product) => void }) {
  const books = PRODUCTS.filter((p) => p.kind === "book" && p.cls === cls);
  const deco = index % 4;
  return (
    <div className="relative">
      <div className="flex h-[170px] items-end gap-[3px] px-1 sm:h-[190px] sm:px-2">
        {books.map((b, i) => (
          <ShelfBook key={b.id} p={b} i={i} shelf={index} onPick={onPick} />
        ))}
        {/* duplicates read as a well-stocked shelf */}
        {books.slice(0, 3).map((b, i) => (
          <motion.div
            key={b.id + "dup"}
            className="hidden lg:block"
            initial={{ y: -260, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: index * 0.12 + (books.length + i) * 0.04, type: "spring", stiffness: 260, damping: 20 } }}
            exit={{ y: 40, opacity: 0, transition: { duration: 0.25 } }}
          >
            <BookSpine color={b.color} w={24} h={128 + pseudo(i + index) * 20} title={b.subject} />
          </motion.div>
        ))}
        <span className="hidden sm:contents">
          <Deco kind={deco} delay={index * 0.12 + 0.5} />
        </span>
        <motion.div
          className="ml-auto hidden flex-col items-end gap-[3px] pb-0 sm:flex"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: index * 0.12 + 0.6 } }}
          exit={{ x: 60, opacity: 0, transition: { duration: 0.2 } }}
        >
          {[0, 1, 2, 3].map((k) => (
            <div key={k} className="h-[10px] rounded-[2px]" style={{ width: 76 - k * 4, background: ["#2a66d9", "#1f7a4d", "#1d3a32", "#e2b100"][k], boxShadow: "inset 0 -2px 0 rgba(0,0,0,.25)" }} />
          ))}
        </motion.div>
      </div>
      <div className="shelf-plank relative h-4 rounded-sm" />
      <div className="mb-6 mt-2 flex items-center justify-between px-1">
        <span className="rounded-[4px] bg-gradient-to-b from-[#f6b183] to-[#e07a43] px-2.5 py-0.5 text-[11px] font-bold text-ink shadow">{classLabel(cls)}</span>
        <Link href={`/shop?cat=textbooks&cls=${cls}`} className="group text-[12px] text-white/60 hover:text-accent">
          Shop {classLabel(cls)} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}

function ShelfBook({ p, i, shelf, onPick }: { p: Product; i: number; shelf: number; onPick: (p: Product) => void }) {
  const [hover, setHover] = useState(false);
  const h = 128 + pseudo(i * 5 + shelf) * 32;
  const w = 23 + Math.round(pseudo(i * 3 + shelf) * 8);
  const tipped = i === 2 && shelf % 2 === 1;
  return (
    <motion.button
      onClick={() => onPick(p)}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="relative outline-none"
      style={{ transformOrigin: "bottom right", zIndex: hover ? 30 : 1 }}
      initial={{ y: -280, rotate: -12, opacity: 0 }}
      animate={{
        y: hover ? -26 : 0,
        rotate: hover ? -4 : tipped ? 7 : 0,
        opacity: 1,
        transition: hover
          ? { type: "spring", stiffness: 420, damping: 18 }
          : { delay: shelf * 0.12 + i * 0.05, type: "spring", stiffness: 240, damping: 17 },
      }}
      exit={{ y: 30, rotate: i % 2 ? 25 : -25, opacity: 0, transition: { duration: 0.35, delay: i * 0.02, ease: "easeIn" } }}
      aria-label={`Open ${p.name}`}
    >
      <motion.div animate={{ scaleX: hover ? 1.15 : 1, filter: hover ? "brightness(1.15)" : "brightness(1)" }} style={{ boxShadow: hover ? "0 20px 25px -10px rgba(0,0,0,.6)" : "none" }}>
        <BookSpine color={p.color} w={w} h={h} title={p.subject} num={/^\d+$/.test(p.cls ?? "") ? p.cls : p.cls?.[0]} />
      </motion.div>
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            className={`pointer-events-none absolute -top-14 z-40 whitespace-nowrap ${i < 2 ? "left-0" : "left-1/2 -translate-x-1/2"} rounded-lg bg-paper px-3 py-1.5 text-left text-ink shadow-xl`}
          >
            <span className="block text-[12px] font-semibold">{p.name}</span>
            <span className="block text-[11px] text-muted">{formatRs(p.price)} · click to open</span>
            <span className={`absolute -bottom-1 h-2 w-2 rotate-45 bg-paper ${i < 2 ? "left-3" : "left-1/2 -translate-x-1/2"}`} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function Deco({ kind, delay }: { kind: number; delay: number }) {
  const anim = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay, type: "spring" as const, stiffness: 300, damping: 15 } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
  };
  if (kind === 0)
    return (
      <motion.svg {...anim} viewBox="0 0 40 60" className="ml-2 h-16 w-10 shrink-0">
        {["#d6452b", "#f2945a", "#1e4fd6"].map((c, i) => (
          <rect key={c} x={10 + i * 7} y={4 + i * 3} width="5" height="34" fill={c} transform={`rotate(${(i - 1) * 9} 20 40)`} />
        ))}
        <rect x="6" y="30" width="28" height="30" rx="3" fill="#1f7a4d" />
      </motion.svg>
    );
  if (kind === 1)
    return (
      <motion.svg {...anim} viewBox="0 0 60 30" className="ml-2 h-8 w-16 shrink-0" whileHover={{ rotate: [-4, 4, 0] }}>
        <rect x="2" y="8" width="56" height="20" rx="4" fill="#1d3a32" />
        <rect x="6" y="2" width="48" height="8" rx="3" fill="#f2945a" />
      </motion.svg>
    );
  if (kind === 2)
    return (
      <motion.svg {...anim} viewBox="0 0 40 50" className="ml-2 h-12 w-10 shrink-0">
        <path d="M8 22 q12 -18 24 0 v20 q0 6 -6 6 h-12 q-6 0 -6 -6z" fill="#e8532f" />
        <path d="M20 14 q2 -10 8 -12" stroke="#2f6b2f" strokeWidth="3" fill="none" />
      </motion.svg>
    );
  return (
    <motion.svg {...anim} viewBox="0 0 50 60" className="ml-2 h-14 w-12 shrink-0" whileHover={{ rotate: 360, transition: { duration: 1 } }}>
      <circle cx="25" cy="22" r="18" fill="#2a8fe0" />
      <path d="M12 16 q8 4 12 -2 q6 8 14 2 M14 30 q6 -4 12 2" stroke="#1f7a4d" strokeWidth="4" fill="none" />
      <rect x="22" y="40" width="6" height="12" fill="#8a5228" />
      <rect x="12" y="52" width="26" height="6" rx="2" fill="#5b3418" />
    </motion.svg>
  );
}

function NoteCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: -3 }}
      whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.6 }}
      className="absolute -bottom-8 right-6 z-30 hidden w-64 rounded-md bg-[#fffaf0] p-4 text-ink shadow-2xl md:block"
    >
      <span className="absolute -top-2 left-1/2 h-5 w-14 -translate-x-1/2 rotate-2 bg-accent/70" />
      <p className="font-display text-lg">Have the school&apos;s list?</p>
      <p className="mt-1 text-[12.5px] text-muted">Load every title for your class in one go. Untick what you already own.</p>
      <Link href="/book-lists" className="mt-3 inline-block text-sm font-semibold text-brand underline decoration-accent decoration-2 underline-offset-4">
        Open book lists →
      </Link>
    </motion.div>
  );
}
