"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CLASSES, SCHOOLS, buildList, classLabel, formatRs, type ListItem } from "@/lib/data";
import { useCart } from "@/lib/store";
import { PageHead } from "@/components/PageHead";
import { BookSpine, spineSet } from "@/components/BookSpine";
import { ProductArt } from "@/components/ProductArt";
import { QtyStepper } from "@/components/CartDrawer";

export function BookListView() {
  const sp = useSearchParams();
  const router = useRouter();
  const [school, setSchool] = useState(sp.get("school") ?? "");
  const [cls, setCls] = useState(sp.get("cls") ?? "");
  const loadedSchool = sp.get("school");
  const loadedCls = sp.get("cls");
  const loaded = loadedSchool && loadedCls && SCHOOLS.some((s) => s.id === loadedSchool) ? { school: loadedSchool, cls: loadedCls } : null;

  useEffect(() => {
    setSchool(sp.get("school") ?? "");
    setCls(sp.get("cls") ?? "");
  }, [sp]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHead crumbs={[["Home", "/"], ["School book lists", "/book-lists"]]} title="School book lists" sub="Every prescribed textbook, register and stationery item for your child's class. Untick what you already have." />
      <div className="mt-10">
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (school && cls) router.replace(`/book-lists?school=${school}&cls=${cls}`, { scroll: false });
            }}
            className="grid grid-cols-1 items-end gap-3 rounded-2xl bg-paper p-4 ring-1 ring-line sm:grid-cols-[1.4fr_1fr_auto] lg:mr-[364px]"
          >
            <label className="text-[11px] text-muted">
              School
              <select value={school} onChange={(e) => setSchool(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-line bg-cream px-3 text-sm text-ink outline-none focus:border-brand">
                <option value="">Select school</option>
                {SCHOOLS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[11px] text-muted">
              Class
              <select value={cls} onChange={(e) => setCls(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-line bg-cream px-3 text-sm text-ink outline-none focus:border-brand">
                <option value="">Select class</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {classLabel(c)}
                  </option>
                ))}
              </select>
            </label>
            <button disabled={!school || !cls} className="h-11 rounded-full bg-brand px-6 text-sm font-semibold text-white transition enabled:hover:bg-accent enabled:hover:text-ink disabled:opacity-40">
              Load list
            </button>
          </form>
          <AnimatePresence mode="wait">
            {loaded ? (
              <LoadedList key={`${loaded.school}-${loaded.cls}`} schoolId={loaded.school} cls={loaded.cls} />
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="grid place-items-center rounded-3xl bg-paper px-6 py-20 text-center ring-1 ring-line">
                <div className="relative flex items-end gap-[2px]">
                  {spineSet(12, 4).map((s, i) => (
                    <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, delay: i * 0.1, repeat: Infinity, repeatDelay: 1.2 }}>
                      <BookSpine color={s.color} w={s.w * 0.8} h={s.h * 0.6} />
                    </motion.div>
                  ))}
                  <div className="shelf-plank absolute -bottom-2 -left-2 -right-2 h-2.5 rounded-sm" />
                </div>
                <p className="mt-8 font-display text-xl">Choose a school and class</p>
                <p className="mt-1 max-w-sm text-sm text-muted">We&apos;ll show the full prescribed list for the 2026–27 session. Untick anything you already have.</p>
              </div>
              <aside className="h-fit rounded-2xl bg-paper p-5 ring-1 ring-line">
                <p className="font-display text-lg">Order summary</p>
                <p className="mt-2 text-sm text-muted">Your list total appears here once you choose a school and class.</p>
              </aside>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LoadedList({ schoolId, cls }: { schoolId: string; cls: string }) {
  const school = SCHOOLS.find((s) => s.id === schoolId)!;
  const base = useMemo(() => buildList(schoolId, cls), [schoolId, cls]);
  const [rows, setRows] = useState(() => base.map((b) => ({ ...b, on: true })));
  const [cover, setCover] = useState(true);
  const [labels, setLabels] = useState(false);
  const addMany = useCart((s) => s.addMany);
  const fly = useCart((s) => s.fly);
  const setOpen = useCart((s) => s.setOpen);
  const btn = useRef<HTMLButtonElement>(null);

  const active = rows.filter((r) => r.on);
  const bookCount = active.filter((r) => r.group === "Textbooks").length;
  const sub = active.reduce((a, r) => a + r.product.price * r.qty, 0);
  const addons = (cover ? bookCount * 40 : 0) + (labels ? 200 : 0);
  const total = sub + addons;
  const groups = ["Textbooks", "Registers & copies", "Stationery"] as const;

  const update = (id: string, patch: Partial<ListItem & { on: boolean }>) => setRows((rs) => rs.map((r) => (r.product.id === id ? { ...r, ...patch } : r)));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        {/* banner shelf */}
        <div className="relative overflow-hidden rounded-3xl p-5 text-white sm:p-6" style={{ background: `linear-gradient(135deg, ${school.color}, #1a0f0a)` }}>
          <div className="flex items-center gap-3">
            <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }} className="grid h-11 w-11 place-items-center rounded-full bg-paper text-[11px] font-bold text-ink">
              {school.short}
            </motion.span>
            <div>
              <h2 className="font-display text-2xl">{classLabel(cls)} book list</h2>
              <p className="text-[12px] text-white/70">
                {school.name}, {school.area}. Session 2026–27
              </p>
            </div>
          </div>
          <div className="relative mt-6 flex h-[150px] items-end gap-[3px] px-2">
            {rows
              .filter((r) => r.group === "Textbooks")
              .map((r, i) => (
                <motion.div
                  key={r.product.id}
                  initial={{ y: -260, rotate: -20, opacity: 0 }}
                  animate={r.on ? { y: 0, rotate: 0, opacity: 1 } : { y: -40, rotate: 12, opacity: 0.18 }}
                  transition={{ delay: r.on ? 0.15 + i * 0.09 : 0, type: "spring", stiffness: 220, damping: 16 }}
                  style={{ transformOrigin: "bottom" }}
                >
                  <BookSpine color={r.product.color} w={26} h={110 + (i % 3) * 14} title={r.product.subject} num={cls.slice(0, 2)} />
                </motion.div>
              ))}
            <div className="shelf-plank absolute inset-x-0 -bottom-3 h-3 rounded-sm" />
          </div>
        </div>

        {groups.map((g) => {
          const gr = rows.filter((r) => r.group === g);
          const allOn = gr.every((r) => r.on);
          return (
            <div key={g} className="mt-8">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{g}</p>
                <button onClick={() => setRows((rs) => rs.map((r) => (r.group === g ? { ...r, on: !allOn } : r)))} className="text-[12px] text-brand underline">
                  {allOn ? "Untick all" : "Tick all"}
                </button>
              </div>
              <ul>
                {gr.map((r, i) => (
                  <motion.li
                    key={r.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: r.on ? 1 : 0.45, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 border-b border-line/60 py-2.5"
                  >
                    <button
                      onClick={() => update(r.product.id, { on: !r.on })}
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${r.on ? "border-brand bg-brand text-white" : "border-ink/30"}`}
                      aria-label="Toggle"
                    >
                      <AnimatePresence>
                        {r.on && (
                          <motion.svg initial={{ pathLength: 0, scale: 0.5 }} animate={{ pathLength: 1, scale: 1 }} exit={{ scale: 0 }} width="12" height="12" viewBox="0 0 24 24">
                            <motion.path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" strokeWidth="3.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </button>
                    <span className="hidden h-10 w-9 shrink-0 sm:block">
                      <ProductArt p={r.product} size={0.22} interactive={false} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`relative block truncate text-[14px] ${r.on ? "" : "text-muted"}`}>
                        {r.product.name}
                        <motion.span className="absolute left-0 top-1/2 h-px bg-ink/50" animate={{ width: r.on ? "0%" : "100%" }} />
                      </span>
                      <span className="text-[11.5px] text-muted">{formatRs(r.product.price)} each</span>
                    </span>
                    <QtyStepper small qty={r.qty} onChange={(n) => update(r.product.id, { qty: Math.max(1, n) })} />
                    <span className="w-16 text-right text-[13px] font-medium tabular-nums sm:w-20 sm:text-[14px]">{formatRs(r.product.price * r.qty)}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="h-fit rounded-2xl bg-paper p-5 ring-1 ring-line lg:sticky lg:top-36">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-lg">Order summary</p>
          <p className="text-[12px] text-muted">{active.length} items selected</p>
        </div>
        <div className="mt-4 space-y-2">
          {[
            { on: cover, set: setCover, t: `Cover every book, Rs 40 each`, d: "Clear plastic covering on every textbook before packing." },
            { on: labels, set: setLabels, t: "Name labels, Rs 200", d: "Printed with your child's name, class and section." },
          ].map((a) => (
            <button key={a.t} onClick={() => a.set(!a.on)} className={`block w-full rounded-xl border p-3 text-left transition-colors ${a.on ? "border-accent bg-accent/10" : "border-line"}`}>
              <span className="flex items-center gap-2 text-[13px] font-medium">
                <span className={`grid h-4 w-4 place-items-center rounded border text-[10px] ${a.on ? "border-brand bg-brand text-white" : "border-ink/30"}`}>{a.on ? "✓" : ""}</span>
                {a.t}
              </span>
              <span className="mt-1 block pl-6 text-[11.5px] text-muted">{a.d}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-[13px]">
          <div className="flex justify-between text-muted">
            <span>Items</span>
            <span>{formatRs(sub)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Add-ons</span>
            <span>{formatRs(addons)}</span>
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
          <span className="text-sm">List total</span>
          <AnimatedRs value={total} className="font-display text-2xl font-semibold" />
        </div>
        <motion.button
          ref={btn}
          whileTap={{ scale: 0.96 }}
          disabled={!active.length}
          onClick={() => {
            addMany(active.map((r) => ({ id: r.product.id, qty: r.qty })));
            const rect = btn.current!.getBoundingClientRect();
            active.slice(0, 8).forEach((r) => fly(rect, r.product.color));
            setTimeout(() => setOpen(true), 1200);
          }}
          className="mt-4 h-12 w-full rounded-full bg-accent text-sm font-semibold transition hover:brightness-95 disabled:opacity-40"
        >
          Add {active.reduce((a, r) => a + r.qty, 0)} items to cart
        </motion.button>
        <p className="mt-3 text-[11.5px] text-muted">Sold-out titles are sourced within 48 hours. We&apos;ll message you on WhatsApp if anything is delayed.</p>
      </motion.aside>
    </motion.div>
  );
}

function AnimatedRs({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => formatRs(Math.round(v)));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: "easeOut" });
    return () => c.stop();
  }, [value, mv]);
  return <motion.span className={className}>{text}</motion.span>;
}
