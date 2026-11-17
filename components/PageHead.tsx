"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookSpine, spineSet } from "./BookSpine";

/** Page title with a mini bookshelf that stacks itself up on the right. */
export function PageHead({ crumbs, title, sub }: { crumbs: [string, string][]; title: string; sub?: string }) {
  const spines = spineSet(18, title.length + 2);
  if (!title)
    return (
      <nav className="flex gap-1.5 pt-8 text-[12px] text-muted">
        {crumbs.map(([l, h], i) => (
          <span key={h} className="flex gap-1.5">
            {i > 0 && <span>/</span>}
            <Link href={h} className="hover:text-ink">
              {l}
            </Link>
          </span>
        ))}
      </nav>
    );
  return (
    <div className="flex items-end justify-between gap-6 pt-10">
      <div>
        <nav className="flex gap-1.5 text-[12px] text-muted">
          {crumbs.map(([l, h], i) => (
            <span key={h} className="flex gap-1.5">
              {i > 0 && <span>/</span>}
              <Link href={h} className="hover:text-ink">
                {l}
              </Link>
            </span>
          ))}
        </nav>
        <motion.h1 key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-display text-5xl font-medium tracking-tight">
          {title}
        </motion.h1>
        {sub && <p className="mt-2 text-[14px] text-muted">{sub}</p>}
      </div>
      <div className="relative hidden items-end gap-[2px] pb-3 md:flex">
        {spines.map((s, i) => (
          <motion.div
            key={`${title}-${i}`}
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1, rotate: s.tilt }}
            transition={{ delay: 0.3 + i * 0.035, type: "spring", stiffness: 300, damping: 18 }}
            whileHover={{ y: -8 }}
            style={{ transformOrigin: "bottom" }}
          >
            <BookSpine color={s.color} w={s.w * 0.75} h={s.h * 0.8} />
          </motion.div>
        ))}
        <div className="shelf-plank absolute -left-2 -right-2 bottom-0 h-3 rounded-sm" />
      </div>
    </div>
  );
}
