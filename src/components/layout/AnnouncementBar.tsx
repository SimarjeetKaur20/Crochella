import { useEffect, useRef } from 'react'

/* ── tiny inline SVG icons ──────────────────────────────────────────────── */
const Flower = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a3 3 0 0 1 3 3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1 3-3z"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
)

const IGIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const YTIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.8 9.2.8 11.5v2.1c0 2.2.2 4.5.2 4.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 22.2 12 22.2 12 22.2s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.2-2.2.2-4.5v-2.1C23.2 9.2 23 7 23 7zM9.8 15.5V8.4l6.5 3.6-6.5 3.5z"/>
  </svg>
)

export default function AnnouncementBar() {
  const barRef = useRef<HTMLDivElement>(null)

  /* fade-in on mount */
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(-8px)'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={barRef}
      className="w-full relative flex items-center justify-between px-4 md:px-8"
      style={{
        backgroundColor: '#C96F78',
        color: '#FFF8F1',
        fontSize: '0.75rem',
        letterSpacing: '0.04em',
        height: '36px',
      }}
    >
      {/* Left spacer (mirrors Follow us on desktop) */}
      <div className="hidden md:flex items-center gap-1 opacity-0 select-none" aria-hidden="true">
        Follow us
      </div>

      {/* Centered text */}
      <div className="flex items-center gap-2 mx-auto font-medium tracking-wide">
        <span style={{ color: '#F4DAD8' }}><Flower /></span>
        <span>Handmade with Love&nbsp;|&nbsp;Every Stitch Tells a Story</span>
        <span style={{ color: '#F4DAD8' }}><Flower /></span>
      </div>

      {/* Right: social icons */}
      <div className="hidden md:flex items-center gap-3" style={{ color: '#FFF8F1' }}>
        <span className="text-xs font-medium opacity-80">Follow us</span>
        <a href="https://www.instagram.com/_crochellla/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
          className="opacity-80 hover:opacity-100 transition-opacity">
          <IGIcon />
        </a>
        <a href="https://www.youtube.com/@Crochellla" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
          className="opacity-80 hover:opacity-100 transition-opacity">
          <YTIcon />
        </a>
      </div>
    </div>
  )
}
