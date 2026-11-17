"use client";

import Link from "next/link";
import { LogoMark } from "./Logo";
import { SpineShelf } from "./SpineShelf";

/** A full-width shelf of spines that drop in one by one (CSS), and bob when hovered. */
export function SpineRow({ seed = 3, count = 90 }: { seed?: number; count?: number }) {
  return (
    <div className="relative flex justify-center overflow-hidden">
      <SpineShelf count={count} seed={seed} stagger={10} plank={null} className="px-2" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24">
      <SpineRow />
      <div className="shelf-plank relative z-10 h-4" />
      <div className="bg-brand text-white/80">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <LogoMark className="h-14 w-14" />
            <p className="mt-4 font-display text-xl italic text-white">Bigger. Better. Booked.</p>
            <p className="mt-2 max-w-xs text-sm">School books, uniforms and stationery for families in Gulshan-e-Iqbal and across Karachi.</p>
          </div>
          {[
            { h: "Shop", l: [["School book lists", "/book-lists"], ["Textbooks", "/shop?cat=textbooks"], ["Uniforms", "/shop?cat=uniforms"], ["Stationery", "/shop?cat=stationery"], ["Bags & bottles", "/shop?cat=bags"]] },
            { h: "Help", l: [["Delivery & pickup", "/#how"], ["Returns & exchanges", "/#how"], ["Uniform sizing", "/shop?cat=uniforms"], ["Your cart", "/cart"]] },
          ].map((c) => (
            <div key={c.h}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">{c.h}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {c.l.map(([t, href]) => (
                  <li key={t}>
                    <Link href={href} className="group relative inline-block hover:text-white">
                      {t}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Visit us</p>
            <p className="mt-4 text-sm leading-relaxed">
              Shop 12, University Road, Block 13,
              <br />
              Gulshan-e-Iqbal, Karachi
            </p>
            <p className="mt-3 text-sm">+92 300 000 0000</p>
            <p className="text-sm">hello@honorable.pk</p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-white/50 sm:px-6">
            <p>© 2026 Honorable Books & Uniforms. All rights reserved.</p>
            <div className="flex gap-2">
              {["Cash on delivery", "JazzCash", "Easypaisa", "Bank transfer"].map((m) => (
                <span key={m} className="rounded-md border border-white/15 px-2 py-1">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
