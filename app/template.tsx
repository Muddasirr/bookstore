"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Page transition: a brand "page" turns away on its spine (left edge)
 * revealing the new route, while content rises in underneath.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[90] [perspective:2200px]">
        <motion.div
          className="absolute inset-0 origin-left bg-brand"
          style={{ backfaceVisibility: "hidden" }}
          initial={{ rotateY: 0, opacity: 1 }}
          animate={{ rotateY: -95, opacity: [1, 1, 0] }}
          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/30 to-transparent" />
          <div className="grid h-full place-items-center">
            <span className="font-display text-3xl italic text-accent/80">Asif</span>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
