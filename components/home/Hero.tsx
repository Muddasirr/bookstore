"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CLASSES, SCHOOLS, classLabel } from "@/lib/data";
import { CountUp } from "../motion";

const HeroScene = dynamic(() => import("../HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
    </div>
  ),
});

/** Mount the WebGL scene only once the browser is idle, so text and the finder paint first. */
function IdleScene() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1200 });
      return () => (window as unknown as { cancelIdleCallback: (n: number) => void }).cancelIdleCallback(id);
    }
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);
  return ready ? (
    <HeroScene />
  ) : (
    <div className="grid h-full place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-brand text-white">
      {/* backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_75%_40%,#2f6d58_0%,transparent_60%),radial-gradient(50%_60%_at_10%_100%,#0c1d18,transparent)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${700 + i * 90} 820 C ${760 + i * 80} ${380 - i * 60}, ${1100 + i * 40} ${120 - i * 30}, 1460 ${200 + i * 70}`}
            fill="none"
            stroke={i === 1 ? "#f2945a" : "#ffffff"}
            strokeOpacity={i === 1 ? 0.35 : 0.1}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, delay: 0.4 + i * 0.25, ease: "easeInOut" }}
          />
        ))}
      </svg>
      <Sparkles />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-14 pt-14 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:pb-20 lg:pt-20">
        <motion.div style={{ y: copyY, opacity: fade }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-[12px] ring-1 ring-white/15 backdrop-blur"
          >
            <span className="rounded-full bg-accent px-2 py-0.5 font-bold text-ink">2026–27</span>
            New session book lists are in
          </motion.span>
          <h1 className="mt-5 font-display text-[44px] font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-[68px]">
            {["Everything", "on", "your"].map((w, i) => (
              <Word key={w} i={i}>
                {w}
              </Word>
            ))}
            <br className="hidden sm:block" />
            {["school", "list,"].map((w, i) => (
              <Word key={w} i={i + 3}>
                {w}
              </Word>
            ))}
            <Word i={5} className="italic text-accent">
              in one
            </Word>
            <br className="hidden sm:block" />
            <Word i={6} className="italic text-accent">
              order.
            </Word>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75"
          >
            Textbooks, registers, uniforms and stationery for Gulshan-e-Iqbal schools. We pack, cover and label it all, then deliver across Karachi.
          </motion.p>
          <Finder />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-8 flex gap-8 text-sm text-white/70"
          >
            <div>
              <p className="font-display text-2xl text-white">PG–10</p>classes covered
            </div>
            <div>
              <p className="font-display text-2xl text-white">
                <CountUp to={5} />
              </p>
              partner schools
            </div>
            <div>
              <p className="font-display text-2xl text-white">
                <CountUp to={2400} suffix="+" />
              </p>
              lists packed
            </div>
          </motion.div>
        </motion.div>
        <motion.div style={{ y: sceneY, scale: sceneScale }} className="relative -mx-4 h-[320px] sm:mx-0 sm:h-[480px] lg:h-[600px]">
          <IdleScene />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="pointer-events-none absolute bottom-3 right-4 text-[11px] uppercase tracking-[0.2em] text-white/40"
          >
            Tap the book ↺
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function Word({ children, i, className = "" }: { children: React.ReactNode; i: number; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: "115%", rotate: 6 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 1, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}&nbsp;
      </motion.span>
    </span>
  );
}

function Finder() {
  const router = useRouter();
  const [school, setSchool] = useState("");
  const [cls, setCls] = useState("");
  const ready = school && cls;
  return (
    <motion.form
      initial={{ opacity: 0, y: 30, rotateX: -25 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 1.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 800 }}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/book-lists?school=${school}&cls=${cls}`);
      }}
      className="mt-7 max-w-lg rounded-2xl bg-paper p-5 text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,.5)]"
    >
      <p className="flex items-center gap-2 font-display text-[15px] font-semibold">
        <span className="text-accent-2">☰</span> Find your school&apos;s book list
      </p>
      <div className="mt-3 grid grid-cols-2 items-end gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <label className="text-[11px] text-muted">
          School
          <select value={school} onChange={(e) => setSchool(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-line bg-cream px-2 text-[13px] text-ink outline-none focus:border-brand">
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
          <select value={cls} onChange={(e) => setCls(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-line bg-cream px-2 text-[13px] text-ink outline-none focus:border-brand">
            <option value="">Select class</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {classLabel(c)}
              </option>
            ))}
          </select>
        </label>
        <motion.button
          animate={ready ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.5 }}
          className={`col-span-2 h-10 rounded-full px-4 text-[13px] font-semibold transition sm:col-span-1 ${ready ? "bg-accent text-ink" : "bg-accent/50 text-ink/60"}`}
        >
          Show my list
        </motion.button>
      </div>
      <p className="mt-3 text-[11.5px] text-muted">
        School not listed? <span className="font-medium text-brand underline">Send us a photo of the list</span> and we&apos;ll price it for you.
      </p>
    </motion.form>
  );
}

function Sparkles() {
  const dots = Array.from({ length: 26 }, (_, i) => ({
    x: (Math.sin(i * 91.7) * 0.5 + 0.5) * 100,
    y: (Math.cos(i * 47.3) * 0.5 + 0.5) * 100,
    s: 1 + (i % 3),
    d: (i % 7) * 0.6,
  }));
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {dots.map((d, i) => (
        <span
          key={i}
          className="sparkle absolute rounded-full bg-white"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDelay: `${d.d}s` }}
        />
      ))}
    </div>
  );
}
