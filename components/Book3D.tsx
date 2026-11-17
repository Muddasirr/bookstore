import type { CSSProperties } from "react";

export function shade(hex: string, amt: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

type Props = {
  color: string;
  title: string;
  label?: string;
  num?: string;
  w?: number;
  h?: number;
  d?: number;
  open?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** A real CSS 3D book: cover that hinges open, spine, page block, top edge, back. */
export function Book3D({ color, title, label, num, w = 140, h = 190, d = 26, open, className = "", style }: Props) {
  const dark = shade(color, -45);
  const light = shade(color, 30);
  const scale = w / 140;
  return (
    <div
      className={`book3d ${open ? "is-open" : ""} ${className}`}
      style={{ "--w": `${w}px`, "--h": `${h}px`, "--d": `${d}px`, ...style } as CSSProperties}
    >
      <div className="b-back" style={{ background: dark }} />
      <div className="b-pages" />
      <div className="b-top" />
      <div className="b-firstpage">
        <div className="flex h-full flex-col p-[10%] text-ink" style={{ fontSize: 9 * scale }}>
          <p className="font-display font-semibold" style={{ fontSize: 12 * scale }}>
            Contents
          </p>
          {["Getting started", "Shapes & sizes", "Numbers in life", "Stories we share", "Time & money", "Our world", "Review"].map(
            (t, i) => (
              <div key={t} className="mt-[6%] flex items-end gap-1 opacity-80">
                <span className="truncate">{t}</span>
                <span className="flex-1 border-b border-dotted border-ink/40" />
                <span>{(i + 1) * 9}</span>
              </div>
            )
          )}
        </div>
      </div>
      <div className="b-spine" style={{ background: `linear-gradient(90deg, ${dark}, ${color} 40%, ${dark})` }}>
        <div className="mx-auto mt-[30%] h-[2px] w-3/4 bg-white/40" />
        <div className="mx-auto mt-1 h-[2px] w-3/4 bg-white/40" />
      </div>
      <div className="b-front">
        <div
          className="b-cover-face"
          style={{
            background: `linear-gradient(110deg, ${dark} 0%, ${color} 9%, ${light} 55%, ${color} 100%)`,
            boxShadow: "inset 4px 0 0 rgba(0,0,0,.25), inset 7px 0 0 rgba(255,255,255,.12)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_80%_0%,rgba(255,255,255,.35),transparent_55%)]" />
          <div className="relative flex h-full flex-col justify-between p-[12%] text-white">
            <div>
              {label && (
                <p className="uppercase tracking-[0.2em] opacity-80" style={{ fontSize: 7 * scale }}>
                  {label}
                </p>
              )}
              <p className="mt-1 font-display font-semibold leading-tight" style={{ fontSize: 16 * scale }}>
                {title}
              </p>
            </div>
            {num && (
              <p className="self-end font-display font-bold text-mustard drop-shadow" style={{ fontSize: 44 * scale, lineHeight: 1 }}>
                {num}
              </p>
            )}
          </div>
        </div>
        <div className="b-cover-inside">
          <div className="flex h-full items-center justify-center p-4 text-center font-display text-ink/40" style={{ fontSize: 10 * scale }}>
            This book belongs to
            <br />
            ____________
          </div>
        </div>
      </div>
    </div>
  );
}
