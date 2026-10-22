/* ──────────────────────────────────────────────────────────────────────────
   Reusable decorative bow accent — matches the homepage's Bow SVG.

   Used on section headings, page heroes, and decorative dividers across
   non-homepage pages.
─────────────────────────────────────────────────────────────────────────── */

interface BowProps {
  size?: number
  color?: string
}

export default function Bow({ size = 28, color = '#C96F78' }: BowProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.6)}
      viewBox="0 0 36 22"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 11 C14 7 3 1 1 5.5 C-1 10 8 14 18 11Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M18 11 C22 7 33 1 35 5.5 C37 10 28 14 18 11Z"
        fill={color}
        opacity="0.85"
      />
      <ellipse cx="18" cy="11" rx="3.5" ry="3" fill={color} />
    </svg>
  )
}
