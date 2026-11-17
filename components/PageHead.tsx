"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SpineShelf } from "./SpineShelf";

/** Page title with a mini bookshelf that stacks itself up on the right. */
export function PageHead({ crumbs, title, sub }: { crumbs: [string, string][]; title: string; sub?: string }) {
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
        <motion.h1 key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          {title}
        </motion.h1>
        {sub && <p className="mt-2 text-[14px] text-muted">{sub}</p>}
      </div>
      <SpineShelf key={title} count={18} seed={title.length + 2} scale={0.78} stagger={35} className="hidden pb-3 md:block" />
    </div>
  );
}
