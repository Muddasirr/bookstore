"use client";

import { useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { BookSpine, spineSet } from "./BookSpine";

/**
 * A row of spines that drop in when scrolled into view.
 * One IntersectionObserver + CSS keyframes, instead of a JS animation per spine.
 */
export function SpineShelf({
  count,
  seed,
  scale = 1,
  stagger = 14,
  className = "",
  plank = "shelf-plank absolute -left-2 -right-2 bottom-0 h-3 rounded-sm",
  lift = false,
}: {
  count: number;
  seed: number;
  scale?: number;
  stagger?: number;
  className?: string;
  plank?: string | null;
  lift?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const spines = spineSet(count, seed);
  return (
    <div className={`relative ${className}`}>
      <div ref={ref} className={`flex items-end gap-[2px] ${inView ? "in" : ""}`}>
        {spines.map((s, i) => (
          <div
            key={i}
            className={`spine ${lift ? "spine-lift" : ""}`}
            style={{ "--d": `${i * stagger}ms`, "--r": `${s.tilt}deg`, "--r0": `${s.tilt * 3}deg`, transitionDelay: lift ? `${i * 15}ms` : undefined } as CSSProperties}
          >
            <BookSpine color={s.color} w={s.w * scale} h={s.h * scale} />
          </div>
        ))}
      </div>
      {plank && <div className={plank} />}
    </div>
  );
}
