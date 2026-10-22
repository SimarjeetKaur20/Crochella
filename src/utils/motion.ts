import type { Variants } from 'framer-motion'

/* ──────────────────────────────────────────────────────────────────────────
   Shared Framer Motion animation variants.

   Each factory accepts a `reduced` flag (from useReducedMotion) and returns
   no-op variants when the user prefers reduced motion, matching the
   homepage's accessibility-aware behaviour.
─────────────────────────────────────────────────────────────────────────── */

const noop: Variants = { hidden: {}, visible: {} }

/** Fade in + slide up — for individual page sections. */
export const sectionReveal = (reduced: boolean | null): Variants =>
  reduced
    ? noop
    : {
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: 'easeOut' },
        },
      }

/** Container that staggers its children's entrance. */
export const staggerContainer = (reduced: boolean | null, stagger = 0.08): Variants =>
  reduced
    ? noop
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger },
        },
      }

/** Child card reveal — used inside a staggerContainer. */
export const cardReveal = (reduced: boolean | null): Variants =>
  reduced
    ? noop
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' },
        },
      }

/** Shared viewport config — trigger once when 12 % visible. */
export const viewportOnce = { once: true, amount: 0.12 } as const

/** Smoother expand/collapse transition for panels. */
export const panelExpand = (reduced: boolean | null) =>
  reduced
    ? { duration: 0.01 }
    : { duration: 0.3, ease: 'easeInOut' as const }
