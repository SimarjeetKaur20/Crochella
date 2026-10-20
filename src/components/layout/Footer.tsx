import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'

// Instagram icon as inline SVG since lucide-react doesn't include it in all versions
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const quickLinks = [
  { label: 'Home',          to: '/' },
  { label: 'Shop',          to: '/shop' },
  { label: 'About Us',      to: '/about' },
  { label: 'Contact',       to: '/contact' },
  { label: 'Custom Order',  to: '/custom-order' },
]

const categoryLinks = [
  { label: 'Crochet Bags',  to: '/category/crochet-bags' },
  { label: 'Coasters',      to: '/category/crochet-coasters' },
  { label: 'Table Mats',    to: '/category/table-mats' },
  { label: 'Thaal Posh',    to: '/category/thaal-posh' },
  { label: 'Scrunchies',    to: '/category/scrunchies' },
]

const helpLinks = [
  { label: 'Shipping Info',       to: '/shipping-info' },
  { label: 'Return Policy',       to: '/return-policy' },
  { label: 'Privacy Policy',      to: '/privacy-policy' },
  { label: 'Terms & Conditions',  to: '/terms' },
]

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3
        className="text-base font-semibold tracking-wide uppercase"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#493B35' }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="text-sm transition-colors duration-200 hover:text-[#493B35]"
      style={{ color: '#7A6B63' }}
    >
      {label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer>
      {/* ── Top Section ── */}
      <div style={{ backgroundColor: '#F5DDE3' }}>
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

            {/* Column 1 – Brand */}
            <div className="flex flex-col gap-5">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 w-fit">
                <svg
                  width="26" height="26" viewBox="0 0 28 28" fill="none"
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
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#493B35' }}
                >
                  Crochella
                </span>
              </Link>

              {/* Tagline */}
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#7A6B63' }}>
                Handmade with Love, Stitched with Care.
                <br />
                Every piece is crafted to bring warmth and beauty into your everyday life.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-4 mt-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 hover:bg-[#E9DCCB]"
                  style={{ color: '#493B35' }}
                >
                  <InstagramIcon size={18} />
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 hover:bg-[#E9DCCB]"
                  style={{ color: '#493B35' }}
                >
                  {/* WhatsApp SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2 – Quick Links */}
            <FooterColumn title="Quick Links">
              <nav className="flex flex-col gap-2.5">
                {quickLinks.map(({ label, to }) => (
                  <FooterLink key={to} to={to} label={label} />
                ))}
              </nav>
            </FooterColumn>

            {/* Column 3 – Categories */}
            <FooterColumn title="Categories">
              <nav className="flex flex-col gap-2.5">
                {categoryLinks.map(({ label, to }) => (
                  <FooterLink key={to} to={to} label={label} />
                ))}
              </nav>
            </FooterColumn>

            {/* Column 4 – Help */}
            <FooterColumn title="Help">
              <nav className="flex flex-col gap-2.5">
                {helpLinks.map(({ label, to }) => (
                  <FooterLink key={to} to={to} label={label} />
                ))}
              </nav>
            </FooterColumn>

          </div>
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div style={{ backgroundColor: '#493B35' }}>
        <div
          className="mx-auto max-w-7xl px-6 py-4 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-2"
        >
          <p className="text-sm text-center" style={{ color: '#FFF9F2' }}>
            © 2026 Crochella. All rights reserved. Handmade with ❤️ in India.
          </p>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#E9DCCB' }}>
            <Phone size={12} />
            <span>Crafted one stitch at a time.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
