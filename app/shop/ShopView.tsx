"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { CLASSES, DEPARTMENTS, PRODUCTS, classLabel, type Category } from "@/lib/data";
import { useCart, useHydrated } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { PageHead } from "@/components/PageHead";

const SORTS = { popular: "Most popular", low: "Price: low to high", high: "Price: high to low", name: "Name A–Z" } as const;

export function ShopView() {
  const sp = useSearchParams();
  const router = useRouter();
  const saved = useCart((s) => s.saved);
  const hydrated = useHydrated();

  const cat = (sp.get("cat") as Category | null) ?? "all";
  const cls = sp.get("cls");
  const sale = sp.get("sale") === "1";
  const onlySaved = sp.get("saved") === "1";
  const q = sp.get("q") ?? "";
  const sort = (sp.get("sort") as keyof typeof SORTS) ?? "popular";

  const set = (patch: Record<string, string | null>) => {
    const n = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v === null ? n.delete(k) : n.set(k, v)));
    router.replace(`/shop?${n}`, { scroll: false });
  };

  const items = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (!cls || p.cls === cls) &&
        (!sale || p.compareAt) &&
        (!onlySaved || (hydrated && saved.includes(p.id))) &&
        (!q || p.name.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [cat, cls, sale, onlySaved, q, sort, saved, hydrated]);

  const PAGE = 12;
  const [shown, setShown] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => setShown(PAGE), [cat, cls, sale, onlySaved, q, sort]);
  const visible = items.slice(0, shown);

  const title = onlySaved ? "Saved items" : q ? `Results for “${q}”` : sale ? "Offers" : cat === "all" ? "Everything" : DEPARTMENTS.find((d) => d.key === cat)!.title;
  const count = (c: Category | "all") => (c === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c).length);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHead crumbs={[["Home", "/"], ["Shop", "/shop"]]} title={title} sub={cls ? `${classLabel(cls)} · current session editions` : undefined} />
      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[220px_1fr] lg:gap-8">
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <button onClick={() => setFiltersOpen((o) => !o)} className="flex w-full items-center justify-between rounded-2xl bg-paper px-4 py-3 ring-1 ring-line lg:hidden" aria-expanded={filtersOpen}>
            <span className="font-display text-lg">Filters</span>
            <motion.span animate={{ rotate: filtersOpen ? 180 : 0 }}>▾</motion.span>
          </button>
          <div className={`${filtersOpen ? "block" : "hidden"} px-1 pt-2 lg:block lg:p-0`}>
          <p className="hidden font-display text-lg lg:block">Filters</p>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Department</p>
          <div className="mt-2 flex flex-wrap gap-1 lg:block lg:space-y-0.5">
            {(["all", ...DEPARTMENTS.map((d) => d.key)] as const).map((k) => (
              <button
                key={k}
                onClick={() => set({ cat: k === "all" ? null : k, cls: null })}
                className="relative flex w-auto items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] lg:w-full"
              >
                {cat === k && <motion.span layoutId="dept" className="absolute inset-0 rounded-lg bg-paper ring-1 ring-line" />}
                <span className={`relative grid h-4 w-4 place-items-center rounded-full border ${cat === k ? "border-brand" : "border-ink/30"}`}>
                  {cat === k && <motion.span layoutId="dept-dot" className="h-2 w-2 rounded-full bg-brand" />}
                </span>
                <span className="relative flex-1 text-left">{k === "all" ? "Everything" : DEPARTMENTS.find((d) => d.key === k)!.title}</span>
                <span className="relative text-[11px] text-muted">{count(k)}</span>
              </button>
            ))}
          </div>
          <AnimatePresence initial={false}>
            {(cat === "textbooks" || cat === "all") && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Class</p>
                <div className="mt-2 grid grid-cols-5 gap-1.5">
                  {CLASSES.map((c) => (
                    <button
                      key={c}
                      onClick={() => set({ cls: cls === c ? null : c, cat: "textbooks" })}
                      className={`h-8 rounded-full text-[11.5px] transition ${cls === c ? "bg-brand text-white" : "bg-paper ring-1 ring-line hover:ring-brand"}`}
                    >
                      {c === "Nursery" ? "N" : c}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Price</p>
          <label className="mt-2 flex cursor-pointer items-center gap-2.5 px-2.5 text-[13.5px]">
            <input type="checkbox" checked={sale} onChange={(e) => set({ sale: e.target.checked ? "1" : null })} className="h-4 w-4 accent-brand" />
            On offer only
          </label>
          {(cls || sale || q || onlySaved || cat !== "all") && (
            <Link href="/shop" className="mt-6 inline-block text-[12px] text-muted underline">
              Clear all filters
            </Link>
          )}
          </div>
        </aside>
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] text-muted">
              <motion.span key={items.length} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block font-semibold text-ink">
                {items.length}
              </motion.span>{" "}
              products
            </p>
            <select value={sort} onChange={(e) => set({ sort: e.target.value })} className="h-10 rounded-full border border-line bg-paper px-4 text-[13px] outline-none">
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <motion.div layout className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
          {shown < items.length && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="h-1 w-48 overflow-hidden rounded-full bg-line">
                <motion.div className="h-full bg-accent" animate={{ width: `${(shown / items.length) * 100}%` }} />
              </div>
              <p className="text-[12px] text-muted">
                Showing {shown} of {items.length}
              </p>
              <button onClick={() => setShown((n) => n + PAGE)} className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-accent hover:text-ink">
                Load more
              </button>
            </div>
          )}
          {items.length === 0 && (
            <div className="rounded-3xl bg-paper p-16 text-center ring-1 ring-line">
              <p className="font-display text-2xl">Nothing on this shelf</p>
              <p className="mt-2 text-sm text-muted">Try another filter, or clear them all.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
