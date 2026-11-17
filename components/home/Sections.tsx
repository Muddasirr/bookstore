"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PRODUCTS, SCHOOLS, buildList, classLabel, formatRs } from "@/lib/data";
import { useCart } from "@/lib/store";
import { Book3D } from "../Book3D";
import { ProductCard } from "../ProductCard";
import { ProductArt } from "../ProductArt";
import { Reveal } from "../motion";
import { SectionTitle } from "./Departments";

/* ---------------- Ready-made class sets ---------------- */

const SETS = [
  { school: "cgs", cls: "3", bg: "from-[#2a5446] to-[#1d3a32]" },
  { school: "nms", cls: "6", bg: "from-[#1e5a5e] to-[#123e40]" },
  { school: "ana", cls: "KG", bg: "from-[#3f7a64] to-[#2a5446]" },
];

export function ClassSets() {
  const addMany = useCart((s) => s.addMany);
  const fly = useCart((s) => s.fly);
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow="Best value" title="Ready-made class sets" sub="The most-ordered lists this week. Open one to see every title and remove anything you don't need." />
        <Reveal>
          <Link href="/book-lists" className="text-sm font-medium text-brand underline decoration-accent decoration-2 underline-offset-4">
            See all schools
          </Link>
        </Reveal>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {SETS.map((s, i) => {
          const school = SCHOOLS.find((x) => x.id === s.school)!;
          const list = buildList(s.school, s.cls);
          const books = list.filter((l) => l.group === "Textbooks");
          const total = list.reduce((a, l) => a + l.product.price * l.qty, 0);
          return (
            <Reveal key={s.school} delay={i * 0.1}>
              <div className="group overflow-hidden rounded-3xl border border-line bg-paper transition-shadow duration-500 hover:shadow-[0_30px_50px_-25px_rgba(21,33,29,.4)]">
                <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${s.bg} [perspective:900px]`}>
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white ring-1 ring-white/20">{school.short}</span>
                  <div className="absolute inset-0 flex items-end justify-center pb-6">
                    {books.slice(0, 3).map((b, k) => (
                      <div
                        key={b.product.id}
                        className="transition-transform duration-700 ease-[var(--ease-book)]"
                        style={{
                          transform: `translateX(${(k - 1) * 12}px) rotateY(-24deg) rotateZ(${(k - 1) * 3}deg)`,
                          transformStyle: "preserve-3d",
                          zIndex: k === 1 ? 2 : 1,
                        }}
                      >
                        <div
                          className={`transition-transform duration-700 ease-[var(--ease-book)] ${
                            k === 0 ? "group-hover:[transform:translateX(-34px)_rotateZ(-8deg)]" : k === 2 ? "group-hover:[transform:translateX(34px)_rotateZ(8deg)]" : "group-hover:[transform:translateY(-14px)]"
                          }`}
                        >
                          <Book3D color={b.product.color} title={b.product.subject!} num={/^\d+$/.test(s.cls) ? s.cls : "KG"} w={84} h={116} d={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl">{classLabel(s.cls)} complete set</h3>
                  <p className="text-[13px] text-muted">
                    {school.name}, {school.area}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-[13px]">
                    {[`${books.length} textbooks for the 2026–27 session`, `${list.filter((l) => l.group !== "Textbooks" && l.group !== "Stationery").reduce((a, l) => a + l.qty, 0)} registers and copies`, `${list.filter((l) => l.group === "Stationery").length} stationery essentials`].map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="text-leaf">✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted">Full list</p>
                      <p className="font-display text-xl font-semibold">{formatRs(total)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/book-lists?school=${s.school}&cls=${s.cls}`} className="rounded-full border border-line px-4 py-2 text-[13px] hover:border-brand">
                        Review
                      </Link>
                      <button
                        onClick={(e) => {
                          addMany(list.map((l) => ({ id: l.product.id, qty: l.qty })));
                          const r = e.currentTarget.getBoundingClientRect();
                          books.slice(0, 5).forEach((b) => fly(r, b.product.color));
                        }}
                        className="rounded-full bg-brand px-4 py-2 text-[13px] text-white transition hover:bg-accent hover:text-ink active:scale-95"
                      >
                        Add all
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Featured tabs ---------------- */

const TABS = [
  { k: "best", l: "Bestsellers", f: (p: (typeof PRODUCTS)[number]) => p.badge === "Bestseller" || p.reviews > 85 },
  { k: "new", l: "New in", f: (p: (typeof PRODUCTS)[number]) => p.badge === "New" },
  { k: "sale", l: "On offer", f: (p: (typeof PRODUCTS)[number]) => !!p.compareAt },
];

export function Featured() {
  const [tab, setTab] = useState("best");
  const items = PRODUCTS.filter(TABS.find((t) => t.k === tab)!.f).slice(0, 8);
  return (
    <section className="bg-sand/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="On the counter" title="What parents are picking up" />
          <div className="flex gap-1 rounded-full bg-paper p-1 ring-1 ring-line">
            {TABS.map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} className={`relative rounded-full px-4 py-2 text-[13px] ${tab === t.k ? "text-white" : "text-ink/70"}`}>
                {tab === t.k && <motion.span layoutId="feat-tab" className="absolute inset-0 rounded-full bg-brand" />}
                <span className="relative">{t.l}</span>
              </button>
            ))}
          </div>
        </div>
        <LayoutGroup>
          <motion.div layout className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}

/* ---------------- Pinned horizontal stationery cupboard ---------------- */

export function StationeryCupboard() {
  const items = PRODUCTS.filter((p) => p.category === "stationery");
  const [wide, setWide] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const cards = (
    <>
      {items.map((p, i) => (
        <Link
          key={p.id}
          href={`/product/${p.slug}`}
          className="group relative flex h-[300px] w-[230px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl p-5 sm:h-[340px] sm:w-[270px]"
          style={{ background: ["#e2efe1", "#e3ebe6", "#f6e4dc"][i % 3] }}
        >
          <span className="font-display text-5xl text-ink/10">{String(i + 1).padStart(2, "0")}</span>
          <div className="flex-1">
            <ProductArt p={p} />
          </div>
          <div className="flex items-end justify-between gap-2">
            <p className="text-[14px] font-medium leading-snug">{p.name}</p>
            <span className="shrink-0 rounded-full bg-paper px-3 py-1 text-[13px] font-semibold">{formatRs(p.price)}</span>
          </div>
        </Link>
      ))}
      <Link href="/shop?cat=stationery" className="grid h-[300px] w-[230px] shrink-0 snap-start place-items-center rounded-3xl bg-brand text-white sm:h-[340px] sm:w-[270px]">
        <span className="text-center font-display text-2xl">
          See all
          <br />
          stationery →
        </span>
      </Link>
    </>
  );
  const title = (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="The stationery cupboard" title="Desk essentials, all term long" italic={["term"]} sub="Registers, colours, geometry and the small things that go missing by October." />
    </div>
  );
  return wide ? <PinnedRow title={title}>{cards}</PinnedRow> : <SwipeRow title={title}>{cards}</SwipeRow>;
}

/** Desktop: the section pins and vertical scroll drives the row sideways (distance measured, not guessed). */
function PinnedRow({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 48));
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  return (
    <section ref={ref} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {title}
        <motion.div ref={track} style={{ x }} className="mt-10 flex w-max gap-5 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] will-change-transform">
          {children}
        </motion.div>
        <div className="mx-auto mt-10 h-1 w-full max-w-7xl px-6">
          <div className="h-full overflow-hidden rounded-full bg-line">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Touch / small screens: a native, snap-scrolling row — no scroll hijacking. */
function SwipeRow({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: row });
  return (
    <section className="py-20">
      {title}
      <div ref={row} className="no-scrollbar mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:px-6" data-lenis-prevent>
        {children}
      </div>
      <div className="mx-auto mt-6 h-1 max-w-7xl px-4 sm:px-6">
        <div className="h-full overflow-hidden rounded-full bg-line">
          <motion.div style={{ scaleX: scrollXProgress }} className="h-full origin-left bg-accent" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const steps = [
    { t: "Choose school and class", d: "We load the full prescribed list. Untick books you already have or change quantities." },
    { t: "We pack, cover and label", d: "Every title is checked against the edition, then covered and name-labelled if you ask." },
    { t: "Delivered or ready to collect", d: "Delivery across Karachi in 1 to 2 days, or pick it up from the Gulshan store the same evening." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionTitle eyebrow="How it works" title="How a list order works" sub="Most orders are packed the same day they come in." />
      <div ref={ref} className="relative mt-14 grid gap-10 md:grid-cols-3">
        <div className="absolute left-5 right-5 top-5 hidden h-[2px] bg-line md:block">
          <motion.div style={{ scaleX: line }} className="h-full origin-left bg-accent" />
        </div>
        {steps.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.15}>
            <motion.div
              initial={{ scale: 0.4, backgroundColor: "#e6e3d5" }}
              whileInView={{ scale: 1, backgroundColor: "#f2945a" }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ delay: 0.3 + i * 0.35, type: "spring", stiffness: 260, damping: 14 }}
              className="relative grid h-10 w-10 place-items-center rounded-full font-display font-semibold"
            >
              {i + 1}
            </motion.div>
            <h3 className="mt-5 font-display text-xl">{s.t}</h3>
            <p className="mt-2 max-w-xs text-[14px] text-muted">{s.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Visit ---------------- */

export function Visit() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section id="visit" className="mx-auto max-w-7xl scroll-mt-28 px-4 sm:px-6">
      <div ref={ref} className="grid overflow-hidden rounded-3xl bg-paper ring-1 ring-line md:grid-cols-2">
        <div className="relative h-72 overflow-hidden md:h-auto">
          <motion.div style={{ y }} className="absolute -inset-y-10 inset-x-0 bg-brand">
            {/* stylised storefront */}
            <svg viewBox="0 0 400 320" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
              <rect width="400" height="320" fill="#1d3a32" />
              <rect x="30" y="60" width="340" height="230" fill="#2a5446" />
              <rect x="30" y="40" width="340" height="40" fill="#f2945a" />
              <text x="200" y="67" textAnchor="middle" fontFamily="Georgia" fontSize="20" fill="#15211d" fontWeight="700">
                HONORABLE BOOKS
              </text>
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 22 }).map((_, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={50 + c * 13.5}
                    y={100 + r * 46 + ((c * 7) % 3) * 4}
                    width="10"
                    height={34 - ((c * 7) % 3) * 4}
                    fill={["#d6452b", "#1e4fd6", "#1f7a4d", "#e2b100", "#5b3fc4", "#118a8a"][(c + r * 3) % 6]}
                  />
                ))
              )}
              {[0, 1, 2, 3].map((r) => (
                <rect key={r} x="44" y={134 + r * 46} width="312" height="5" fill="#7a4722" />
              ))}
              <rect x="0" y="290" width="400" height="30" fill="#15211d" />
            </svg>
          </motion.div>
        </div>
        <div className="p-8 sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-2">Visit the store</p>
          <h2 className="mt-3 font-display text-4xl">Come browse the shelves</h2>
          <p className="mt-3 text-[14px] text-muted">Bring your list or your child for a uniform fitting. Books can be covered while you wait.</p>
          <dl className="mt-6 space-y-4 text-[14px]">
            {[
              ["Address", "Shop 12, University Road, Block 13, Gulshan-e-Iqbal, Karachi"],
              ["Hours", "Mon to Sat, 10:00 am to 10:00 pm. Sunday 2:00 pm to 9:00 pm"],
              ["Phone", "+92 300 000 0000"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[90px_1fr] gap-3">
                <dt className="text-[11px] uppercase tracking-wider text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold transition hover:brightness-95">
              Get directions
            </a>
            <a href="#" className="rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
