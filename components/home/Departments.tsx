"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DEPARTMENTS, PRODUCTS, SCHOOLS } from "@/lib/data";
import { ProductArt } from "../ProductArt";
import { Reveal, SplitHeading } from "../motion";
import { BookSpine, spineSet } from "../BookSpine";

export function Marquee() {
  const items = [...SCHOOLS.map((s) => s.name), "Free book covering", "Name labels", "Same-day packing", "Cash on delivery"];
  return (
    <div className="relative overflow-hidden border-y border-line bg-paper py-4">
      <motion.div className="flex w-max gap-10" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 38, repeat: Infinity, ease: "linear" }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-lg text-ink/70">
            {t}
            <span className="text-mustard-2">✦</span>
          </span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper" />
    </div>
  );
}

export function SectionTitle({ eyebrow, title, sub, italic, light }: { eyebrow: string; title: string; sub?: string; italic?: string[]; light?: boolean }) {
  return (
    <div>
      <Reveal>
        <p className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${light ? "text-mustard" : "text-mustard-2"}`}>
          <span className="h-px w-6 bg-current" />
          {eyebrow}
        </p>
      </Reveal>
      <h2 className={`mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl ${light ? "text-white" : ""}`}>
        <SplitHeading text={title} italic={italic} />
      </h2>
      {sub && (
        <Reveal delay={0.15}>
          <p className={`mt-3 max-w-xl text-[15px] ${light ? "text-white/70" : "text-muted"}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

const pick = (name: string) => PRODUCTS.find((p) => p.name === name)!;

export function Departments() {
  const [tb, un, st, bg] = DEPARTMENTS;
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionTitle eyebrow="Departments" title="Shop by department" sub="The same stock and prices as our counter, now online." />
      <div className="mt-10 grid gap-4 md:grid-cols-4 md:grid-rows-[260px_220px]">
        <DeptCard d={tb} className="md:row-span-2" delay={0}>
          <div className="absolute inset-x-0 bottom-16 flex h-64 items-end justify-center gap-0 px-2 [perspective:900px]">
            {["English Reader 3", "Mathematics 3", "General Science 3"].map((n, i) => {
              const p = PRODUCTS.find((x) => x.name === n)!;
              return (
                <motion.div
                  key={n}
                  className="h-60 w-[30%]"
                  initial={{ y: 80, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 120, damping: 14 }}
                >
                  <div className={`h-full transition-transform duration-500 ${i === 1 ? "group-hover:-translate-y-4" : i === 0 ? "group-hover:-translate-x-2 group-hover:-rotate-3" : "group-hover:translate-x-2 group-hover:rotate-3"}`}>
                    <ProductArt p={p} size={0.92} interactive={false} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </DeptCard>
        <DeptCard d={un} delay={0.08}>
          <Floaty p={pick("School shirt, half sleeve")} />
        </DeptCard>
        <DeptCard d={st} delay={0.16}>
          <Floaty p={pick("Colour pencils, 24 shades")} />
        </DeptCard>
        <DeptCard d={bg} delay={0.24}>
          <Floaty p={pick("Junior school backpack")} />
        </DeptCard>
        <Reveal delay={0.3} className="md:col-span-3">
          <Link href="/book-lists" className="group relative flex h-full min-h-[220px] overflow-hidden rounded-3xl bg-navy p-7 text-white">
            <div className="relative z-10 max-w-xs">
              <h3 className="font-display text-2xl">School book lists</h3>
              <p className="mt-2 text-sm text-white/70">Pick the school and class. We&apos;ll load the whole prescribed list and you untick what you already have.</p>
              <span className="mt-6 inline-grid h-10 w-10 place-items-center rounded-full bg-mustard text-ink transition-transform group-hover:translate-x-2">→</span>
            </div>
            <div className="absolute bottom-6 right-6 hidden items-end gap-[3px] sm:flex">
              {spineSet(22, 9).map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.03, type: "spring", stiffness: 160, damping: 14 }}
                  style={{ originY: 1 }}
                  className="transition-transform duration-300 group-hover:-translate-y-1"
                >
                  <div style={{ transitionDelay: `${i * 18}ms` }} className="transition-transform duration-300 group-hover:-translate-y-2">
                    <BookSpine color={s.color} w={s.w * 0.8} h={s.h * 0.95} />
                  </div>
                </motion.div>
              ))}
              <div className="shelf-plank absolute -bottom-3 -left-3 -right-3 h-3 rounded" />
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function DeptCard({ d, children, className = "", delay }: { d: (typeof DEPARTMENTS)[number]; children: React.ReactNode; className?: string; delay: number }) {
  return (
    <Reveal delay={delay} className={className}>
      <Link
        href={`/shop?cat=${d.key}`}
        className="group relative block h-full min-h-[240px] overflow-hidden rounded-3xl p-6 transition-shadow duration-500 hover:shadow-[0_30px_50px_-25px_rgba(14,26,61,.4)]"
        style={{ background: d.tint }}
      >
        <div className="relative z-10">
          <h3 className="font-display text-2xl">{d.title}</h3>
          <p className="mt-1 max-w-[220px] text-[13px] text-ink/60">{d.blurb}</p>
        </div>
        {children}
        <span className="absolute bottom-5 left-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-navy text-white transition-all duration-300 group-hover:w-24 group-hover:bg-mustard group-hover:text-ink">
          <span className="text-sm">
            <span className="hidden group-hover:inline">Shop </span>→
          </span>
        </span>
      </Link>
    </Reveal>
  );
}

function Floaty({ p }: { p: (typeof PRODUCTS)[number] }) {
  return (
    <motion.div
      className="absolute -bottom-4 -right-4 h-40 w-40 transition-transform duration-700 group-hover:-translate-x-3 group-hover:-translate-y-3 group-hover:rotate-[-6deg] group-hover:scale-110"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <ProductArt p={p} interactive={false} />
    </motion.div>
  );
}
