export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#13265c" />
      <path d="M10 15 q7 -3 14 1 v20 q-7 -4 -14 -1z" fill="#f4c21b" />
      <path d="M38 15 q-7 -3 -14 1 v20 q7 -4 14 -1z" fill="#fff" />
      <path d="M24 16 v20" stroke="#13265c" strokeWidth="1.5" />
      <path d="M28 21 h6 M28 25 h6 M28 29 h4" stroke="#13265c" strokeWidth="1.2" opacity=".5" />
    </svg>
  );
}
