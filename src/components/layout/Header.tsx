import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, User, ChevronDown, Heart, Search } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'

const categories = [
  { label: 'Crochet Bags',     slug: 'crochet-bags' },
  { label: 'Crochet Coasters', slug: 'crochet-coasters' },
  { label: 'Table Mats',       slug: 'table-mats' },
  { label: 'Thaal Posh',       slug: 'thaal-posh' },
  { label: 'Crochet Flowers',  slug: 'crochet-flowers' },
  { label: 'Crochet Toys',     slug: 'crochet-toys' },
  { label: 'Scrunchies',       slug: 'scrunchies' },
  { label: 'Custom Creations', slug: 'custom-creations' },
]

/* Bow accent next to logo */
const BowSVG = () => (
  <svg width="18" height="12" viewBox="0 0 36 24" fill="none" aria-hidden="true">
    <path d="M18 12 C14 8 4 2 2 6 C0 10 8 14 18 12Z" fill="#C96F78" opacity="0.85"/>
    <path d="M18 12 C22 8 32 2 34 6 C36 10 28 14 18 12Z" fill="#C96F78" opacity="0.85"/>
    <ellipse cx="18" cy="12" rx="3" ry="3" fill="#C96F78"/>
  </svg>
)

export default function Header() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const totalItemsCount = useCartStore((s) => s.totalItems())

  const [scrolled,       setScrolled]       = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [catOpen,        setCatOpen]        = useState(false)
  const [mobileCatOpen,  setMobileCatOpen]  = useState(false)
  const [searchQuery,    setSearchQuery]    = useState('')

  const catRef    = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* close cat dropdown on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* fade-in on mount */
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(-6px)'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const isActive = (path: string) => location.pathname === path

  /* nav link styles */
  const navLink = (path: string) => {
    const active = isActive(path)
    return {
      base: 'relative text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-full',
      style: active
        ? { backgroundColor: '#F4DAD8', color: '#57382D' }
        : { color: '#57382D' },
    }
  }

  const iconBtn =
    'relative p-2 rounded-full transition-all duration-200 hover:bg-[#F4DAD8] text-[#57382D]'

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: '#FFF8F1',
          boxShadow: scrolled ? '0 2px 20px rgba(87,56,45,0.09)' : 'none',
          transition: 'box-shadow 0.3s',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 md:px-8">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-1.5 shrink-0 mr-2"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex flex-col leading-none">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#57382D' }}
              >
                Crochella
              </span>
              <span
                className="text-[9px] font-medium tracking-widest uppercase flex items-center gap-1"
                style={{ color: '#C96F78' }}
              >
                Handmade with Love <span style={{ color: '#C96F78' }}>♥</span>
              </span>
            </div>
            <BowSVG />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {[
              { label: 'Home',    path: '/' },
              { label: 'Shop',    path: '/shop' },
            ].map(({ label, path }) => {
              const nl = navLink(path)
              return (
                <Link key={path} to={path} className={nl.base} style={nl.style}>
                  {label}
                </Link>
              )
            })}

            {/* Categories dropdown */}
            <div className="relative" ref={catRef}>
              <button
                className="relative text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#F4DAD8]"
                style={{ color: '#57382D' }}
                onClick={() => setCatOpen((o) => !o)}
                aria-expanded={catOpen}
              >
                Categories
                <ChevronDown
                  size={14}
                  style={{
                    transition: 'transform 0.25s',
                    transform: catOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Dropdown */}
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '220px',
                  borderRadius: '16px',
                  backgroundColor: '#FFF8F1',
                  boxShadow: '0 8px 32px rgba(87,56,45,0.14)',
                  border: '1px solid #F4DAD8',
                  padding: '6px 0',
                  zIndex: 50,
                  opacity: catOpen ? 1 : 0,
                  pointerEvents: catOpen ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  transformOrigin: 'top center',
                }}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="block px-5 py-2 text-sm font-medium transition-colors hover:bg-[#F4DAD8]"
                    style={{ color: '#57382D' }}
                    onClick={() => setCatOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {[
              { label: 'About Us', path: '/about' },
              { label: 'Contact',  path: '/contact' },
            ].map(({ label, path }) => {
              const nl = navLink(path)
              return (
                <Link key={path} to={path} className={nl.base} style={nl.style}>
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* ── Search field (desktop inline) ── */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0"
            style={{
              border: '1px solid #E9DCCB',
              backgroundColor: 'white',
              width: '200px',
            }}
          >
            <Search size={14} style={{ color: '#A8B5A0', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crochet goodies…"
              className="flex-1 bg-transparent text-xs outline-none min-w-0"
              style={{ color: '#57382D' }}
            />
          </form>

          {/* ── Icon cluster ── */}
          <div className="flex items-center gap-0.5 ml-auto md:ml-0">
            {/* Account */}
            <Link to="/admin/login" aria-label="Account" className={iconBtn}>
              <User size={18} />
            </Link>

            {/* Wishlist */}
            <Link to="/shop" aria-label="Wishlist" className={iconBtn}>
              <Heart size={18} />
            </Link>

            {/* Cart */}
            <Link to="/cart" aria-label="Cart" className={`${iconBtn} relative`}>
              <ShoppingBag size={18} />
              {totalItemsCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold leading-none"
                  style={{ backgroundColor: '#C96F78', color: 'white' }}
                >
                  {totalItemsCount > 9 ? '9+' : totalItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
              className={`${iconBtn} md:hidden`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* thin border at bottom */}
        <div style={{ height: '1px', backgroundColor: '#F4DAD8' }} />
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(87,56,45,0.35)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className="fixed top-0 right-0 z-50 h-full w-72 flex flex-col md:hidden"
        style={{
          backgroundColor: '#FFF8F1',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          boxShadow: '-4px 0 24px rgba(87,56,45,0.12)',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #F4DAD8' }}
        >
          <span className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#57382D' }}>
            Crochella
          </span>
          <button onClick={() => setMobileOpen(false)} style={{ color: '#57382D' }}>
            <X size={22} />
          </button>
        </div>

        {/* Mobile search */}
        <form
          onSubmit={(e) => { handleSearch(e); setMobileOpen(false) }}
          className="flex items-center gap-2 mx-4 mt-4 px-3 py-2 rounded-full"
          style={{ border: '1px solid #F4DAD8', backgroundColor: 'white' }}
        >
          <Search size={14} style={{ color: '#A8B5A0' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#57382D' }}
          />
        </form>

        <nav className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
          {[
            { label: 'Home',     to: '/' },
            { label: 'Shop',     to: '/shop' },
            { label: 'About Us', to: '/about' },
            { label: 'Contact',  to: '/contact' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center py-3 text-base font-medium border-b"
              style={{
                color: '#57382D',
                borderColor: '#F4DAD8',
                backgroundColor: isActive(to) ? '#F4DAD8' : 'transparent',
                borderRadius: isActive(to) ? '8px' : undefined,
                paddingLeft: isActive(to) ? '12px' : undefined,
              }}
            >
              {label}
            </Link>
          ))}

          {/* Mobile categories */}
          <div>
            <button
              className="flex items-center justify-between w-full py-3 text-base font-medium border-b"
              style={{ color: '#57382D', borderColor: '#F4DAD8' }}
              onClick={() => setMobileCatOpen((o) => !o)}
            >
              Categories
              <ChevronDown
                size={16}
                style={{
                  transition: 'transform 0.2s',
                  transform: mobileCatOpen ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>
            {mobileCatOpen && (
              <div className="pl-4 mt-1 space-y-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-sm font-medium hover:text-[#C96F78] transition-colors"
                    style={{ color: '#57382D' }}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div
          className="flex items-center gap-5 px-6 py-5"
          style={{ borderTop: '1px solid #F4DAD8' }}
        >
          <Link to="/admin/login" onClick={() => setMobileOpen(false)} aria-label="Account" style={{ color: '#57382D' }}>
            <User size={22} />
          </Link>
          <Link to="/shop" onClick={() => setMobileOpen(false)} aria-label="Wishlist" style={{ color: '#57382D' }}>
            <Heart size={22} />
          </Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)} aria-label="Cart" className="relative" style={{ color: '#57382D' }}>
            <ShoppingBag size={22} />
            {totalItemsCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
                style={{ backgroundColor: '#C96F78', color: 'white' }}
              >
                {totalItemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  )
}
