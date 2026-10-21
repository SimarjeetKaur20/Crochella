import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useProductStore } from '../store/productStore'
import { CATEGORY_IMAGES } from '../data/products'
import type { ProductCategory } from '../types'
import ProductCard from '../components/product/ProductCard'

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const CATEGORIES: { slug: ProductCategory; label: string }[] = [
  { slug: 'crochet-bags',     label: 'Crochet Bags' },
  { slug: 'crochet-coasters', label: 'Coasters' },
  { slug: 'table-mats',       label: 'Table Mats' },
  { slug: 'thaal-posh',       label: 'Thaal Posh' },
  { slug: 'crochet-flowers',  label: 'Crochet Flowers' },
  { slug: 'scrunchies',       label: 'Scrunchies' },
  { slug: 'crochet-toys',     label: 'Crochet Toys' },
  { slug: 'custom-creations', label: 'Custom Creations' },
]

const BENEFITS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Handmade with Love',
    desc: 'Every piece is crafted with care.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Secure Shipping',
    desc: 'Across India.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Custom Orders',
    desc: 'Personalised just for you.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5" rx="1"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    title: 'Unique & Thoughtful Gifts',
    desc: 'Perfect for every occasion.',
  },
]

const TESTIMONIALS = [
  { quote: 'Beautiful quality! The lily bag is exactly what I wanted. Will definitely order again!', name: 'Priya S.', location: 'Mumbai' },
  { quote: 'Fast delivery and the coasters are absolutely adorable. Everyone keeps asking where I got them!', name: 'Meera K.', location: 'Pune' },
  { quote: 'The thaal posh was perfect for our pooja ceremony. So beautifully handcrafted. 10/10!', name: 'Anita P.', location: 'Ahmedabad' },
]

/* ─────────────────────────────────────────────────────────────────────────────
   HOOK: Intersection Observer reveal
───────────────────────────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SMALL DECORATIVE BOW SVG
───────────────────────────────────────────────────────────────────────────── */
const Bow = ({ size = 28, color = '#C96F78' }: { size?: number; color?: string }) => (
  <svg width={size} height={Math.round(size * 0.6)} viewBox="0 0 36 22" fill="none" aria-hidden="true">
    <path d="M18 11 C14 7 3 1 1 5.5 C-1 10 8 14 18 11Z" fill={color} opacity="0.85"/>
    <path d="M18 11 C22 7 33 1 35 5.5 C37 10 28 14 18 11Z" fill={color} opacity="0.85"/>
    <ellipse cx="18" cy="11" rx="3.5" ry="3" fill={color}/>
  </svg>
)

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const products    = useProductStore((s) => s.products)
  const bestsellers = products.filter((p) => p.is_bestseller && p.is_available).slice(0, 4)
  const recentlyAdded = products.filter((p) => p.is_new && p.is_available).slice(0, 4)
  const galleryImages = products.flatMap((p) => p.images).filter(Boolean).slice(0, 9)

  /* hero panel animation */
  const heroPanelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = heroPanelRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(28px)'
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 200)
    return () => clearTimeout(t)
  }, [])

  const benefitsReveal  = useReveal()
  const collectReveal   = useReveal()
  const bestReveal      = useReveal()
  const recentReveal    = useReveal()
  const testimReveal    = useReveal()
  const ctaReveal       = useReveal()
  const igReveal        = useReveal()

  /* reduce motion */
  const noMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const revealStyle = (visible: boolean, delay = 0): React.CSSProperties =>
    noMotion
      ? {}
      : {
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        }

  return (
    <div style={{ backgroundColor: '#FFF8F1', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative w-full"
        style={{
          backgroundImage: "url('/product-images/coverpage.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          minHeight: 'min(90vh, 620px)',
        }}
      >
        {/* very light veil so image stays vivid */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(255,248,241,0.55) 0%, rgba(255,248,241,0.15) 50%, transparent 100%)' }}
        />

        {/* Content panel — arched card on the left */}
        <div className="relative z-10 flex items-center h-full min-h-[min(90vh,620px)] px-6 md:px-16 py-12">
          <div
            ref={heroPanelRef}
            className="flex flex-col items-center text-center"
            style={{
              maxWidth: '420px',
              width: '100%',
              backgroundColor: 'rgba(255, 248, 241, 0.92)',
              border: '1.5px solid #C96F78',
              borderRadius: '50% 50% 18px 18px / 60px 60px 18px 18px',
              padding: '2.5rem 2rem 2rem',
              boxShadow: '0 8px 40px rgba(87,56,45,0.12)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {/* Decorative bow at top */}
            <div className="mb-3">
              <Bow size={32} />
            </div>

            {/* Welcome label */}
            <p
              className="text-sm mb-3 tracking-widest uppercase font-medium"
              style={{ color: '#C96F78', fontFamily: "'Dancing Script', cursive", fontSize: '1rem', textTransform: 'none', letterSpacing: '0.02em' }}
            >
              Welcome to Crochella
            </p>

            {/* Main heading */}
            <h1
              className="font-bold leading-tight mb-4"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#57382D',
                fontSize: 'clamp(1.9rem, 4vw, 2.75rem)',
                lineHeight: 1.2,
              }}
            >
              Little Things,<br />Lovingly Handmade
            </h1>

            {/* Small heart divider */}
            <div className="flex items-center gap-2 mb-4" style={{ color: '#C96F78' }}>
              <span style={{ height: '1px', width: '40px', backgroundColor: '#F4DAD8', display: 'block' }} />
              ♥
              <span style={{ height: '1px', width: '40px', backgroundColor: '#F4DAD8', display: 'block' }} />
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: '#7A5C50', maxWidth: '300px' }}
            >
              Every piece is crafted by hand with premium yarn, patience, and heartfelt dedication.
              Made to be loved, made to last.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Link
                to="/shop"
                className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-250 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  backgroundColor: '#57382D',
                  color: 'white',
                  boxShadow: '0 2px 12px rgba(87,56,45,0.25)',
                }}
              >
                Shop Collection
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-250 hover:-translate-y-0.5 hover:bg-[#F4DAD8]"
                style={{
                  border: '1.5px solid #C96F78',
                  color: '#57382D',
                  backgroundColor: 'transparent',
                }}
              >
                Custom Order
                <span className="transition-transform duration-200 group-hover:scale-110">🎀</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BENEFITS BAR
      ══════════════════════════════════════════════════════ */}
      <div ref={benefitsReveal.ref}>
        <div
          className="mx-4 md:mx-8 lg:mx-16 -mt-5 relative z-10 rounded-2xl overflow-hidden"
          style={{
            backgroundColor: '#FFF8F1',
            border: '1px solid #F4DAD8',
            boxShadow: '0 4px 24px rgba(87,56,45,0.08)',
            ...revealStyle(benefitsReveal.visible),
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-4"
                style={{
                  borderRight: i < 3 ? '1px solid #F4DAD8' : 'none',
                  borderBottom: i < 2 ? '1px solid #F4DAD8' : 'none',
                }}
              >
                {/* bow divider between items (desktop only) */}
                <span style={{ color: '#C96F78', flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <p className="text-sm font-semibold leading-tight" style={{ color: '#57382D' }}>
                    {b.title}
                  </p>
                  <p className="text-xs mt-0.5 leading-snug" style={{ color: '#A8785A' }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          EXPLORE OUR COLLECTIONS
      ══════════════════════════════════════════════════════ */}
      <section className="pt-14 pb-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto" ref={collectReveal.ref}>

        {/* Section heading */}
        <div
          className="flex flex-col items-center mb-10"
          style={revealStyle(collectReveal.visible)}
        >
          <div className="flex items-center gap-4 w-full justify-center mb-3">
            <span style={{ height: '1px', flex: 1, maxWidth: 120, backgroundColor: '#C96F78', opacity: 0.4 }} />
            <h2
              className="text-2xl md:text-3xl font-bold text-center"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#57382D' }}
            >
              Explore Our Collections
            </h2>
            <span style={{ height: '1px', flex: 1, maxWidth: 120, backgroundColor: '#C96F78', opacity: 0.4 }} />
          </div>
          <Bow size={28} />
        </div>

        {/* Arch cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <ArchCard
              key={cat.slug}
              slug={cat.slug}
              label={cat.label}
              image={CATEGORY_IMAGES[cat.slug] ?? '/product-images/coverpage.jpeg'}
              delay={i * 60}
              visible={collectReveal.visible}
              noMotion={noMotion}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BESTSELLERS
      ══════════════════════════════════════════════════════ */}
      {bestsellers.length > 0 && (
        <section
          className="py-14 px-4 md:px-8 lg:px-16"
          style={{ backgroundColor: '#FDF0ED' }}
          ref={bestReveal.ref}
        >
          <div className="max-w-7xl mx-auto">
            <div style={revealStyle(bestReveal.visible)}>
              <SectionHeading title="Our Bestsellers" sub="Most loved pieces, handmade just for you" />
            </div>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-8"
              style={revealStyle(bestReveal.visible, 120)}
            >
              {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="text-center mt-8" style={revealStyle(bestReveal.visible, 180)}>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ border: '1.5px solid #57382D', color: '#57382D' }}
              >
                View All <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          RECENTLY ADDED
      ══════════════════════════════════════════════════════ */}
      {recentlyAdded.length > 0 && (
        <section
          className="py-14 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto"
          ref={recentReveal.ref}
        >
          <div style={revealStyle(recentReveal.visible)}>
            <SectionHeading title="Recently Added" sub="Fresh arrivals from our studio" />
          </div>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-8"
            style={revealStyle(recentReveal.visible, 120)}
          >
            {recentlyAdded.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          CUSTOM ORDER CTA
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: '#F6E5D9' }}
        ref={ctaReveal.ref}
      >
        <div
          className="max-w-2xl mx-auto text-center"
          style={revealStyle(ctaReveal.visible)}
        >
          <Bow size={32} color="#C96F78" />
          <h2
            className="text-2xl md:text-4xl font-bold mt-4 mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#57382D' }}
          >
            Can't Find What You're Looking For?
          </h2>
          <p className="text-sm md:text-base mb-7 leading-relaxed" style={{ color: '#7A5C50' }}>
            Every Crochella piece can be customized — choose your colors, sizes, and designs.
            We love bringing your vision to life, one stitch at a time.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ backgroundColor: '#57382D', color: 'white', boxShadow: '0 2px 12px rgba(87,56,45,0.2)' }}
          >
            <MessageCircle size={16} />
            Request Custom Order
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-14 px-4 md:px-8 max-w-6xl mx-auto"
        ref={testimReveal.ref}
      >
        <div style={revealStyle(testimReveal.visible)}>
          <SectionHeading title="What Our Customers Say" centered />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: 'white',
                border: '1px solid #F4DAD8',
                boxShadow: '0 2px 12px rgba(87,56,45,0.06)',
                ...revealStyle(testimReveal.visible, i * 80),
              }}
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ color: '#F6C94A', fontSize: '1rem' }}>★</span>
                ))}
              </div>
              <p className="text-sm italic mb-4 leading-relaxed" style={{ color: '#7A5C50' }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: '#A8B5A0' }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#57382D' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#A8B5A0' }}>{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          INSTAGRAM GALLERY
      ══════════════════════════════════════════════════════ */}
      {galleryImages.length > 0 && (
        <section
          className="py-12 px-4"
          style={{ backgroundColor: '#FFF8F1' }}
          ref={igReveal.ref}
        >
          <div className="max-w-5xl mx-auto">
            <div style={revealStyle(igReveal.visible)}>
              <SectionHeading title="Follow Our Journey" sub="@crochella on Instagram" centered />
            </div>
            <div
              className="grid grid-cols-3 gap-2 md:gap-3 mt-8 mb-7"
              style={revealStyle(igReveal.visible, 100)}
            >
              {galleryImages.slice(0, 9).map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden img-zoom-wrapper">
                  <img
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="text-center" style={revealStyle(igReveal.visible, 160)}>
              <a
                href="https://instagram.com/crochella"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-[#F4DAD8]"
                style={{ border: '1.5px solid #57382D', color: '#57382D' }}
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   ARCH CARD
───────────────────────────────────────────────────────────────────────────── */
interface ArchCardProps {
  slug: string
  label: string
  image: string
  delay: number
  visible: boolean
  noMotion: boolean
}

function ArchCard({ slug, label, image, delay, visible, noMotion }: ArchCardProps) {
  const [hovered, setHovered] = useState(false)

  const animStyle: React.CSSProperties = noMotion
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }

  return (
    <Link
      to={`/category/${slug}`}
      className="block"
      style={animStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          borderRadius: '50% 50% 12px 12px / 40% 40% 12px 12px',
          overflow: 'hidden',
          border: `1.5px solid ${hovered ? '#C96F78' : '#F4DAD8'}`,
          boxShadow: hovered
            ? '0 12px 32px rgba(87,56,45,0.18)'
            : '0 2px 12px rgba(87,56,45,0.07)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          backgroundColor: '#FFF8F1',
          aspectRatio: '3/4',
        }}
      >
        {/* Image fills the arch */}
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={image}
            alt={label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 0.5s ease',
              display: 'block',
            }}
            loading="lazy"
          />
        </div>
      </div>

      {/* Label row below arch */}
      <div
        className="flex items-center justify-between mt-2 px-1"
        style={{ color: '#57382D' }}
      >
        <span
          className="text-xs font-semibold leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {label}
        </span>
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: hovered ? '#C96F78' : '#F4DAD8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background-color 0.25s ease',
            color: hovered ? 'white' : '#C96F78',
            fontSize: '10px',
          }}
        >
          →
        </span>
      </div>
    </Link>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION HEADING helper
───────────────────────────────────────────────────────────────────────────── */
function SectionHeading({
  title,
  sub,
  centered,
}: {
  title: string
  sub?: string
  centered?: boolean
}) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <h2
        className="text-xl md:text-2xl font-bold"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#57382D' }}
      >
        {title}
      </h2>
      {sub && (
        <p className="text-sm mt-1" style={{ color: '#A8785A' }}>
          {sub}
        </p>
      )}
    </div>
  )
}
