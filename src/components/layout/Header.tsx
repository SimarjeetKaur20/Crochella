import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Search, ShoppingBag, User, ChevronDown } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'

const categories = [
  { label: 'Crochet Bags',      slug: 'crochet-bags' },
  { label: 'Crochet Coasters',  slug: 'crochet-coasters' },
  { label: 'Table Mats',        slug: 'table-mats' },
  { label: 'Thaal Posh',        slug: 'thaal-posh' },
  { label: 'Crochet Flowers',   slug: 'crochet-flowers' },
  { label: 'Crochet Toys',      slug: 'crochet-toys' },
  { label: 'Scrunchies',        slug: 'scrunchies' },
  { label: 'Custom Creations',  slug: 'custom-creations' },
]

export default function Header() {
  const navigate = useNavigate()
  const totalItemsCount = useCartStore((s) => s.totalItems())

  const [scrolled, setScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [catOpen, setCatOpen]           = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [searchOpen, setSearchOpen]     = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')

  const catRef = useRef<HTMLDivElement>(null)

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close category dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinkClass =
    'relative text-sm font-medium tracking-wide transition-colors duration-200 hover:text-[#493B35] ' +
    'after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-[#493B35] ' +
    'after:transition-all after:duration-300 hover:after:w-full'

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full transition-shadow duration-300"
        style={{
          backgroundColor: '#FFF9F2',
          color: '#493B35',
          boxShadow: scrolled ? '0 2px 16px 0 rgba(73,59,53,0.10)' : 'none',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
            {/* Crochet hook SVG */}
            <svg
              width="28" height="28" viewBox="0 0 28 28" fill="none"
              xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            >
              <path
                d="M8 24 C8 24 6 20 6 16 C6 10 10 6 14 6 C18 6 20 9 20 12 C20 15 18 17 15 17 C13 17 12 15.5 12 14 C12 12.5 13 11 14.5 11"
                stroke="#493B35" strokeWidth="2" strokeLinecap="round" fill="none"
              />
              <circle cx="14.5" cy="10" r="1.5" fill="#493B35" />
              <path d="M8 24 L10 20" stroke="#493B35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span
              className="text-2xl font-bold tracking-tight leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#493B35' }}
            >
              Crochella
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-7">
            <Link to="/"       className={navLinkClass} style={{ color: '#493B35' }}>Home</Link>
            <Link to="/shop"   className={navLinkClass} style={{ color: '#493B35' }}>Shop</Link>

            {/* Categories dropdown */}
            <div className="relative" ref={catRef}>
              <button
                className={`${navLinkClass} flex items-center gap-1`}
                style={{ color: '#493B35' }}
                onClick={() => setCatOpen((o) => !o)}
                aria-expanded={catOpen}
              >
                Categories
                <ChevronDown
                  size={15}
                  className="transition-transform duration-200"
                  style={{ transform: catOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {catOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-2xl py-2 z-50"
                  style={{
                    backgroundColor: '#FFF9F2',
                    boxShadow: '0 8px 32px rgba(73,59,53,0.15)',
                    border: '1px solid #E9DCCB',
                  }}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      className="block px-5 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#F5DDE3]"
                      style={{ color: '#493B35' }}
                      onClick={() => setCatOpen(false)}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about"   className={navLinkClass} style={{ color: '#493B35' }}>About Us</Link>
            <Link to="/contact" className={navLinkClass} style={{ color: '#493B35' }}>Contact</Link>
          </nav>

          {/* ── Right Icons ── */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((o) => !o)}
              className="p-1 rounded-full transition-colors duration-200 hover:bg-[#F5DDE3]"
              style={{ color: '#493B35' }}
            >
              <Search size={20} />
            </button>

            {/* User / Admin */}
            <Link
              to="/admin/login"
              aria-label="Account"
              className="p-1 rounded-full transition-colors duration-200 hover:bg-[#F5DDE3]"
              style={{ color: '#493B35' }}
            >
              <User size={20} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative p-1 rounded-full transition-colors duration-200 hover:bg-[#F5DDE3]"
              style={{ color: '#493B35' }}
            >
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold leading-none"
                  style={{ backgroundColor: '#493B35', color: '#FFF9F2' }}
                >
                  {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-1 rounded-full transition-colors duration-200 hover:bg-[#F5DDE3]"
              style={{ color: '#493B35' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Search bar (slide-down) ── */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: searchOpen ? '80px' : '0' }}
        >
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 px-4 py-3 md:px-8"
            style={{ borderTop: '1px solid #E9DCCB' }}
          >
            <Search size={18} style={{ color: '#A8B5A0' }} />
            <input
              autoFocus={searchOpen}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for crochet bags, coasters, toys…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#A8B5A0]"
              style={{ color: '#493B35' }}
            />
            <button
              type="submit"
              className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors duration-200"
              style={{ backgroundColor: '#493B35', color: '#FFF9F2' }}
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300 md:hidden"
          style={{
            backgroundColor: 'rgba(73,59,53,0.4)',
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? 'auto' : 'none',
          }}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className="fixed top-0 right-0 z-50 h-full w-72 flex flex-col md:hidden transition-transform duration-300"
          style={{
            backgroundColor: '#FFF9F2',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
            boxShadow: '-4px 0 24px rgba(73,59,53,0.12)',
          }}
        >
          {/* Drawer header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid #E9DCCB' }}
          >
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#493B35' }}
            >
              Crochella
            </span>
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              style={{ color: '#493B35' }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Drawer links */}
          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
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
                className="block py-3 text-base font-medium border-b transition-colors duration-150 hover:text-[#A8B5A0]"
                style={{ color: '#493B35', borderColor: '#E9DCCB' }}
              >
                {label}
              </Link>
            ))}

            {/* Mobile categories accordion */}
            <div>
              <button
                className="flex items-center justify-between w-full py-3 text-base font-medium border-b"
                style={{ color: '#493B35', borderColor: '#E9DCCB' }}
                onClick={() => setMobileCatOpen((o) => !o)}
              >
                Categories
                <ChevronDown
                  size={16}
                  className="transition-transform duration-200"
                  style={{ transform: mobileCatOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {mobileCatOpen && (
                <div className="pl-4 mt-1 space-y-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2.5 text-sm font-medium transition-colors duration-150 hover:text-[#A8B5A0]"
                      style={{ color: '#493B35' }}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Drawer footer icons */}
          <div
            className="flex items-center gap-5 px-6 py-5"
            style={{ borderTop: '1px solid #E9DCCB' }}
          >
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              aria-label="Account"
              style={{ color: '#493B35' }}
            >
              <User size={22} />
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              aria-label="Cart"
              className="relative"
              style={{ color: '#493B35' }}
            >
              <ShoppingBag size={22} />
              {totalItemsCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: '#493B35', color: '#FFF9F2' }}
                >
                  {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </>
    </>
  )
}
