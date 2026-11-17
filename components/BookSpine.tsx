import { shade } from "./Book3D";

type Props = {
  color: string;
  title?: string;
  num?: string;
  w?: number;
  h?: number;
  className?: string;
};

/** A flat book spine as it appears on a shelf. */
export function BookSpine({ color, title, num, w = 26, h = 120, className = "" }: Props) {
  const dark = shade(color, -50);
  const light = shade(color, 35);
  return (
    <div
      className={`relative flex shrink-0 flex-col items-center justify-between overflow-hidden rounded-[3px] py-2 ${className}`}
      style={{
        width: w,
        height: h,
        background: `linear-gradient(90deg, ${dark} 0%, ${color} 18%, ${light} 45%, ${color} 70%, ${dark} 100%)`,
        boxShadow: "inset 0 2px 0 rgba(255,255,255,.2), inset 0 -2px 0 rgba(0,0,0,.25)",
      }}
    >
      <div className="w-full space-y-[3px] px-1">
        <div className="h-[2px] bg-mustard/80" />
        <div className="h-[1px] bg-mustard/60" />
      </div>
      {title && (
        <span
          className="flex-1 truncate py-1 font-display text-[10px] font-semibold tracking-wide text-white/90 [writing-mode:vertical-rl] rotate-180"
          style={{ fontSize: Math.min(11, w * 0.4) }}
        >
          {title}
        </span>
      )}
      {num && <span className="font-display text-[11px] font-bold text-mustard">{num}</span>}
      <div className="w-full space-y-[3px] px-1">
        <div className="h-[1px] bg-mustard/60" />
        <div className="h-[2px] bg-mustard/80" />
      </div>
    </div>
  );
}

const PALETTE = ["#1e4fd6", "#d6452b", "#1f7a4d", "#e2b100", "#5b3fc4", "#118a8a", "#b8236a", "#c98a12", "#243c8f", "#2f6b2f", "#7a1f3a", "#f08a24"];

export function pseudo(i: number) {
  const x = Math.sin(i * 999.13) * 10000;
  return x - Math.floor(x);
}

export function spineSet(n: number, seed = 1) {
  return Array.from({ length: n }, (_, i) => {
    const r = pseudo(i + seed * 31);
    return {
      color: PALETTE[Math.floor(pseudo(i * 3 + seed) * PALETTE.length)],
      w: 14 + Math.round(r * 18),
      h: 70 + Math.round(pseudo(i * 7 + seed) * 50),
      tilt: pseudo(i * 11 + seed) > 0.93 ? (pseudo(i) > 0.5 ? 8 : -8) : 0,
    };
  });
}
