import type { Product } from "@/lib/data";
import { classLabel } from "@/lib/data";
import { Book3D, shade } from "./Book3D";

/** Illustrated product imagery: CSS-3D books and hand-drawn SVG objects. */
export function ProductArt({ p, size = 1, interactive = true }: { p: Product; size?: number; interactive?: boolean }) {
  if (p.kind === "book") {
    return (
      <div className="flex h-full w-full items-center justify-center [perspective:900px]">
        <div
          className={`transition-transform duration-700 ease-[var(--ease-book)] [transform:rotateY(-28deg)_rotateX(6deg)] ${
            interactive ? "group-hover:[transform:rotateY(-8deg)_rotateX(2deg)_translateY(-6px)]" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Book3D
            color={p.color}
            title={p.subject ?? p.name}
            label={p.cls ? classLabel(p.cls) : undefined}
            num={p.cls && /^\d+$/.test(p.cls) ? p.cls : p.cls?.slice(0, 2)}
            w={112 * size}
            h={150 * size}
            d={22 * size}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className={`h-[78%] w-[78%] drop-shadow-[0_18px_18px_rgba(14,26,61,.18)] transition-transform duration-700 ease-[var(--ease-book)] ${
          interactive ? "group-hover:-translate-y-1.5 group-hover:-rotate-2 group-hover:scale-[1.04]" : ""
        }`}
      >
        <Art p={p} />
      </svg>
    </div>
  );
}

function Art({ p }: { p: Product }) {
  const c = p.color;
  const d = shade(c, -40);
  const l = shade(c, 40);
  const a = p.accent ?? "#f4c21b";
  switch (p.kind) {
    case "register":
    case "notebook":
      return (
        <g>
          <rect x="52" y="30" width="104" height="140" rx="6" fill="#f3ecdc" transform="translate(6 4)" />
          <rect x="48" y="28" width="104" height="140" rx="6" fill={c} />
          <rect x="48" y="28" width="14" height="140" rx="4" fill={d} />
          <rect x="74" y="54" width="62" height="34" rx="4" fill="#fffaf0" />
          <line x1="80" y1="66" x2="128" y2="66" stroke={d} strokeWidth="2" />
          <line x1="80" y1="76" x2="116" y2="76" stroke={d} strokeWidth="2" opacity=".6" />
          {p.kind === "notebook" &&
            [44, 64, 84, 104, 124, 144].map((y) => <circle key={y} cx="55" cy={y} r="3" fill="#fffaf0" opacity=".7" />)}
          <rect x="62" y="28" width="90" height="140" rx="6" fill="url(#shine)" opacity=".35" />
          <Defs />
        </g>
      );
    case "pencils":
    case "crayons":
      return (
        <g>
          {Array.from({ length: 8 }).map((_, i) => {
            const cols = ["#d6452b", "#f08a24", "#f4c21b", "#3d8b3d", "#118a8a", "#1e4fd6", "#5b3fc4", "#b8236a"];
            const x = 58 + i * 11;
            const h = p.kind === "crayons" ? 46 : 70 + (i % 3) * 8;
            return (
              <g key={i}>
                <rect x={x} y={92 - h + 40} width="9" height={h} rx={p.kind === "crayons" ? 4 : 1} fill={cols[i]} />
                {p.kind === "pencils" && <polygon points={`${x},${132 - h} ${x + 9},${132 - h} ${x + 4.5},${118 - h}`} fill="#f2d3a2" />}
                {p.kind === "pencils" && <polygon points={`${x + 2.7},${123 - h} ${x + 6.3},${123 - h} ${x + 4.5},${118 - h}`} fill={cols[i]} />}
              </g>
            );
          })}
          <path d="M48 118 h104 v52 a6 6 0 0 1 -6 6 h-92 a6 6 0 0 1 -6 -6z" fill={c} />
          <rect x="48" y="118" width="104" height="10" fill={d} />
          <text x="62" y="160" fill="#fff" fontFamily="Georgia" fontSize="22" fontWeight="700">
            {p.kind === "pencils" ? "24" : "16"}
          </text>
          <text x="96" y="150" fill="#fff" fontFamily="Arial" fontSize="8" opacity=".85">
            {p.kind === "pencils" ? "COLOUR" : "WAX"}
          </text>
          <text x="96" y="160" fill="#fff" fontFamily="Arial" fontSize="8" opacity=".85">
            {p.kind === "pencils" ? "PENCILS" : "CRAYONS"}
          </text>
        </g>
      );
    case "pens":
      return (
        <g transform="rotate(-30 100 100)">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${i * 14 - 28} 0)`}>
              <rect x="94" y="40" width="12" height="110" rx="3" fill={c} />
              <rect x="94" y="40" width="4" height="110" fill={l} opacity=".6" />
              <polygon points="94,150 106,150 100,166" fill="#f2d3a2" />
              <polygon points="98,160 102,160 100,166" fill="#333" />
              <rect x="94" y="36" width="12" height="10" rx="2" fill={p.name.includes("HB") ? "#e85d75" : d} />
            </g>
          ))}
        </g>
      );
    case "geometry":
      return (
        <g>
          <rect x="30" y="60" width="140" height="84" rx="10" fill={d} transform="translate(0 6)" />
          <rect x="30" y="56" width="140" height="84" rx="10" fill={c} />
          <rect x="40" y="66" width="120" height="64" rx="6" fill={shade(c, 20)} />
          <path d="M60 120 a30 30 0 0 1 60 0z" fill="none" stroke={a} strokeWidth="5" />
          <polygon points="128,120 152,120 152,80" fill={a} opacity=".9" />
          <rect x="46" y="72" width="80" height="8" rx="2" fill="#fff" opacity=".85" />
        </g>
      );
    case "calculator":
      return (
        <g transform="rotate(-8 100 100)">
          <rect x="58" y="28" width="88" height="148" rx="12" fill={shade(c, -20)} transform="translate(4 6)" />
          <rect x="56" y="26" width="88" height="148" rx="12" fill={c} />
          <rect x="66" y="38" width="68" height="28" rx="4" fill="#bfd3b0" />
          <text x="128" y="58" textAnchor="end" fontFamily="monospace" fontSize="14" fill="#2c3a24">
            2026
          </text>
          {Array.from({ length: 16 }).map((_, i) => (
            <rect
              key={i}
              x={66 + (i % 4) * 18}
              y={76 + Math.floor(i / 4) * 22}
              width="14"
              height="15"
              rx="3"
              fill={i % 4 === 3 ? "#f4c21b" : i > 12 ? "#d6452b" : "#4a5060"}
            />
          ))}
        </g>
      );
    case "backpack":
      return (
        <g>
          <path d="M78 46 q22 -26 44 0" fill="none" stroke={d} strokeWidth="8" strokeLinecap="round" />
          <rect x="52" y="46" width="96" height="128" rx="30" fill={c} />
          <rect x="52" y="46" width="22" height="128" rx="14" fill={l} opacity=".25" />
          <rect x="66" y="108" width="68" height="52" rx="14" fill={d} />
          <rect x="66" y="118" width="68" height="5" fill={a} />
          <rect x="94" y="60" width="12" height="30" rx="4" fill={d} />
          <circle cx="100" cy="104" r="3" fill={a} />
        </g>
      );
    case "trolley":
      return (
        <g>
          <rect x="90" y="18" width="20" height="40" rx="4" fill="none" stroke="#555" strokeWidth="5" />
          <rect x="54" y="52" width="92" height="118" rx="24" fill={c} />
          <rect x="66" y="104" width="68" height="50" rx="12" fill={d} />
          <rect x="66" y="112" width="68" height="5" fill={a} />
          <circle cx="66" cy="176" r="9" fill="#333" />
          <circle cx="134" cy="176" r="9" fill="#333" />
        </g>
      );
    case "bottle":
      return (
        <g>
          <rect x="84" y="20" width="32" height="20" rx="6" fill="#333" />
          <path d="M76 52 q0 -12 12 -12 h24 q12 0 12 12 v112 q0 14 -14 14 h-20 q-14 0 -14 -14z" fill={c} />
          <rect x="82" y="56" width="8" height="110" rx="4" fill="#fff" opacity=".25" />
          <rect x="76" y="96" width="48" height="26" fill={d} opacity=".5" />
        </g>
      );
    case "lunchbox":
      return (
        <g>
          <path d="M80 62 q20 -26 40 0" fill="none" stroke={p.accent} strokeWidth="7" strokeLinecap="round" />
          <rect x="40" y="62" width="120" height="50" rx="12" fill={c} />
          <rect x="40" y="108" width="120" height="56" rx="12" fill={shade(c, -20)} />
          <rect x="40" y="104" width="120" height="8" fill={p.accent} />
          <rect x="52" y="70" width="40" height="6" rx="3" fill="#fff" opacity=".4" />
        </g>
      );
    case "shirt":
    case "sweater":
      return (
        <g>
          <path
            d="M70 38 l-38 22 l14 34 l18 -8 v86 h72 v-86 l18 8 l14 -34 l-38 -22 q-15 14 -30 0z"
            fill={c}
            stroke={shade(c, -25)}
            strokeWidth="2"
          />
          {p.kind === "sweater" ? (
            <>
              <path d="M85 38 l15 30 l15 -30" fill="none" stroke={a} strokeWidth="5" />
              <rect x="64" y="166" width="72" height="8" fill={a} />
            </>
          ) : (
            <>
              <path d="M85 38 l15 16 l15 -16" fill="#fff" stroke={shade(c, -25)} strokeWidth="2" />
              <line x1="100" y1="54" x2="100" y2="172" stroke={shade(c, -25)} strokeWidth="1.5" />
              {[70, 92, 114, 136].map((y) => (
                <circle key={y} cx="100" cy={y} r="2.5" fill={shade(c, -40)} />
              ))}
              <rect x="110" y="70" width="18" height="16" rx="2" fill="none" stroke={a} strokeWidth="2" />
            </>
          )}
        </g>
      );
    case "trousers":
      return (
        <g>
          <path d="M62 30 h76 l10 148 h-34 l-14 -100 l-14 100 h-34z" fill={c} />
          <rect x="62" y="30" width="76" height="12" fill={d} />
          <line x1="100" y1="42" x2="100" y2="70" stroke={d} strokeWidth="2" />
        </g>
      );
    case "pouch":
      return (
        <g>
          <path d="M34 80 q66 -26 132 0 v50 q-66 26 -132 0z" fill={c} />
          <path d="M34 80 q66 -26 132 0" fill="none" stroke={d} strokeWidth="6" />
          <rect x="150" y="66" width="8" height="22" rx="3" fill="#ddd" />
          <path d="M44 92 q56 -18 112 0" fill="none" stroke="#fff" strokeWidth="3" opacity=".35" />
        </g>
      );
    case "eraser":
      return (
        <g>
          <rect x="40" y="86" width="70" height="40" rx="6" fill={c} transform="rotate(-10 75 106)" />
          <rect x="40" y="86" width="30" height="40" rx="6" fill="#1e4fd6" transform="rotate(-10 75 106)" />
          <rect x="116" y="88" width="44" height="34" rx="6" fill="#f4c21b" />
          <circle cx="130" cy="105" r="6" fill="#333" />
          <circle cx="148" cy="105" r="6" fill="#333" />
        </g>
      );
    case "glue":
      return (
        <g>
          <rect x="44" y="60" width="34" height="110" rx="8" fill={c} />
          <rect x="44" y="50" width="34" height="18" rx="6" fill={shade(c, -30)} />
          <circle cx="120" cy="80" r="16" fill="none" stroke="#e85d75" strokeWidth="8" />
          <circle cx="150" cy="80" r="16" fill="none" stroke="#e85d75" strokeWidth="8" />
          <path d="M128 92 l18 80 M142 92 l-18 80" stroke="#9aa3b2" strokeWidth="7" strokeLinecap="round" />
        </g>
      );
    default:
      return <rect x="50" y="50" width="100" height="100" rx="12" fill={c} />;
  }
}

function Defs() {
  return (
    <defs>
      <linearGradient id="shine" x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".6" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}
