"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { LogoMark } from "./Logo";
import { useCart, useHydrated } from "@/lib/store";
import { CLASSES, PRODUCTS, classLabel, formatRs } from "@/lib/data";
import { ProductArt } from "./ProductArt";

const MESSAGES = [
  "Free delivery across Karachi on orders over Rs 5,000",
  "2026–27 session book lists are live for 5 schools",
  "Free book covering on every full class set",
];

const NAV = [
  { href: "/", label: "Home" },
  { href: "/book-lists", label: "School book lists" },
  { href: "/shop?cat=textbooks", label: "Books", mega: true },
  { href: "/shop?cat=uniforms", label: "Uniforms" },
  { href: "/shop?cat=stationery", label: "Stationery" },
  { href: "/shop?cat=bags", label: "Bags & bottles" },
  { href: "/shop?sale=1", label: "Offers", star: true },
  { href: "/#visit", label: "Visit the store" },
];

export function Header() {
  return (
    <Suspense fallback={<div className="h-[148px]" />}>
      <HeaderInner />
    </Suspense>
  );
}

function HeaderInner() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [msg, setMsg] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = pathname + (sp.toString() ? `?${sp}` : "");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCompact(y > 40);
    setHidden(y > 400 && y > prev + 2 ? true : y < prev - 2 ? false : hidden);
  });

  useEffect(() => {
    const t = setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 3800);
    return () => clearInterval(t);
  }, []);
  useEffect(() => setMobile(false), [current]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : href.startsWith("/shop?") ? current.startsWith(href) : pathname.startsWith(href.split("?")[0]) && !href.includes("#");

  return (
    <>
      <div className="relative z-50 h-8 overflow-hidden bg-brand text-[12px] text-white/90">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="relative h-full flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={msg}
                className="absolute inset-y-0 flex items-center"
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                {MESSAGES[msg]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="hidden gap-5 sm:flex">
            <span>+92 300 000 0000</span>
            <a className="text-accent hover:underline" href="#">
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
      <motion.header
        className="sticky top-0 z-40 border-b border-line/70 bg-cream/95 md:bg-cream/80 md:backdrop-blur-xl"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onMouseLeave={() => setHover(null)}
      >
        <div className={`mx-auto flex max-w-7xl items-center gap-4 px-4 transition-all duration-300 sm:px-6 ${compact ? "py-2.5" : "py-4"}`}>
          <button className="-ml-1 p-1 lg:hidden" aria-label="Menu" onClick={() => setMobile((m) => !m)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <motion.span whileHover={{ rotate: -8, scale: 1.06 }}>
              <LogoMark className={`transition-all duration-300 ${compact ? "h-9 w-9" : "h-11 w-11"}`} />
            </motion.span>
            <span className="leading-none">
              <span className="block font-display text-[19px] font-semibold tracking-tight">Honorable</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-muted">Books & Uniforms</span>
            </span>
          </Link>
          <Search />
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link href="/book-lists" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm hover:bg-sand md:flex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              Book lists
            </Link>
            <SavedButton />
            <CartButton />
          </div>
        </div>
        <nav className="relative mx-auto hidden max-w-7xl items-center gap-1 px-4 pb-2 text-[13.5px] sm:px-6 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              onMouseEnter={() => setHover(n.mega ? "mega" : n.label)}
              className={`relative rounded-full px-3 py-1.5 transition-colors ${isActive(n.href) ? "font-medium text-ink" : "text-ink/70 hover:text-ink"}`}
            >
              {hover === n.label || (hover === "mega" && n.mega) ? (
                <motion.span layoutId="navhover" className="absolute inset-0 -z-10 rounded-full bg-sand" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              ) : null}
              {n.star && <span className="mr-1 text-accent-2">✦</span>}
              {n.label}
              {n.mega && <span className="ml-1 inline-block text-[10px] opacity-60">▾</span>}
              {isActive(n.href) && <motion.span layoutId="navactive" className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded bg-accent" />}
            </Link>
          ))}
          <AnimatePresence>{hover === "mega" && <MegaMenu onClose={() => setHover(null)} />}</AnimatePresence>
        </nav>
        <AnimatePresence>
          {mobile && (
            <motion.nav
              className="overflow-hidden border-t border-line lg:hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              <div className="grid gap-1 p-4">
                <MobileSearch />
                {NAV.map((n, i) => (
                  <motion.div key={n.label} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <Link href={n.href} className="block rounded-lg px-3 py-2.5 text-[15px] hover:bg-sand">
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function MegaMenu({ onClose }: { onClose: () => void }) {
  const books = PRODUCTS.filter((p) => p.kind === "book");
  return (
    <motion.div
      className="absolute left-4 right-4 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_30px_60px_-20px_rgba(21,33,29,.35)] sm:left-6 sm:right-6"
      initial={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0 round 16px)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 16px)" }}
      exit={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0 round 16px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-[1.4fr_1fr] gap-8 p-7">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Shop by class</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {CLASSES.map((c, i) => (
              <motion.div key={c} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
                <Link
                  href={`/shop?cat=textbooks&cls=${c}`}
                  className="block rounded-xl border border-line px-3 py-2.5 text-center text-[13px] transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white"
                >
                  {classLabel(c)}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {books
            .filter((b) => b.badge)
            .slice(0, 3)
            .map((b) => (
              <Link key={b.id} href={`/product/${b.slug}`} className="group rounded-xl bg-cream p-2">
                <div className="h-32">
                  <ProductArt p={b} size={0.62} />
                </div>
                <p className="mt-1 truncate text-[12px]">{b.name}</p>
                <p className="text-[12px] font-semibold">{formatRs(b.price)}</p>
              </Link>
            ))}
        </div>
      </div>
    </motion.div>
  );
}

function Search() {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const router = useRouter();
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(s)).slice(0, 6);
  }, [q]);
  return (
    <form
      className="relative mx-2 hidden max-w-xl flex-1 md:block"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/shop?q=${encodeURIComponent(q)}`);
        setFocus(false);
      }}
    >
      <motion.div
        animate={{ boxShadow: focus ? "0 0 0 4px rgba(242,148,90,.35)" : "0 0 0 0px rgba(242,148,90,0)" }}
        className="flex items-center rounded-full border border-line bg-paper pl-4 pr-1"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          placeholder="Search books, uniforms, stationery"
          className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <button className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white transition hover:scale-105" aria-label="Search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </motion.div>
      <AnimatePresence>
        {focus && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-2xl border border-line bg-paper p-1.5 shadow-xl"
          >
            {results.map((p) => (
              <li key={p.id}>
                <Link href={`/product/${p.slug}`} className="group flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-cream">
                  <span className="h-10 w-10 shrink-0">
                    <ProductArt p={p} size={0.24} interactive={false} />
                  </span>
                  <span className="flex-1 truncate text-sm">{p.name}</span>
                  <span className="text-sm font-semibold">{formatRs(p.price)}</span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </form>
  );
}

function MobileSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
      }}
      className="mb-2 flex items-center rounded-full border border-line bg-paper pl-4 pr-1 md:hidden"
    >
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search books, uniforms, stationery" className="h-11 flex-1 bg-transparent text-[15px] outline-none" />
      <button className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white" aria-label="Search">
        →
      </button>
    </form>
  );
}

function SavedButton() {
  const saved = useCart((s) => s.saved.length);
  const h = useHydrated();
  return (
    <Link href="/shop?saved=1" className="relative hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm hover:bg-sand sm:flex">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      Saved{h && saved > 0 ? ` (${saved})` : ""}
    </Link>
  );
}

function CartButton() {
  const count = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  const bump = useCart((s) => s.bump);
  const setOpen = useCart((s) => s.setOpen);
  const h = useHydrated();
  return (
    <motion.button
      id="cart-target"
      onClick={() => setOpen(true)}
      key={bump}
      animate={bump ? { scale: [1, 1.25, 0.92, 1], rotate: [0, -10, 6, 0] } : {}}
      transition={{ duration: 0.55 }}
      className="relative flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 text-sm text-white"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      {h && count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-ink">
          {count}
        </span>
      )}
    </motion.button>
  );
}
