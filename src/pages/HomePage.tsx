import { Link } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { CATEGORY_IMAGES } from '../data/products'
import type { ProductCategory } from '../types'
import ProductCard from '../components/product/ProductCard'
import SectionTitle from '../components/ui/SectionTitle'
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react'

const CATEGORIES: { slug: ProductCategory; label: string }[] = [
  { slug: 'crochet-bags', label: 'Crochet Bags' },
  { slug: 'crochet-coasters', label: 'Crochet Coasters' },
  { slug: 'table-mats', label: 'Table Mats' },
  { slug: 'thaal-posh', label: 'Thaal Posh' },
  { slug: 'crochet-flowers', label: 'Crochet Flowers' },
  { slug: 'crochet-toys', label: 'Crochet Toys' },
  { slug: 'scrunchies', label: 'Scrunchies' },
  { slug: 'custom-creations', label: 'Custom Creations' },
]

const TESTIMONIALS = [
  { quote: 'Beautiful quality! The lily bag is exactly what I wanted. Will definitely order again!', name: 'Priya S.', location: 'Mumbai' },
  { quote: 'Fast delivery and the coasters are absolutely adorable. Everyone keeps asking where I got them!', name: 'Meera K.', location: 'Pune' },
  { quote: 'The thaal posh was perfect for our pooja ceremony. So beautifully handcrafted. 10/10!', name: 'Anita P.', location: 'Ahmedabad' },
]

export default function HomePage() {
  const products = useProductStore((s) => s.products)
  const bestsellers = products.filter((p) => p.is_bestseller && p.is_available).slice(0, 4)
  const recentlyAdded = products.filter((p) => p.is_new && p.is_available).slice(0, 4)
  const galleryImages = products.flatMap((p) => p.images).filter(Boolean).slice(0, 9)

  return (
    <div style={{ backgroundColor: '#FFF9F2' }}>
      {/* ===== HERO ===== */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/product-images/coverpage.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="mb-4 text-lg md:text-xl" style={{ fontFamily: 'Dancing Script, cursive', color: '#493B35' }}>
            Welcome to Crochella
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}>
            Little Things,<br />Lovingly Handmade
          </h1>
          <p className="text-base md:text-lg mb-8 max-w-lg mx-auto" style={{ color: '#6B5247' }}>
            Every piece is crafted by hand with premium yarn, patience, and heartfelt dedication. Made to be loved, made to last.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#493B35', color: 'white' }}
            >
              Shop Collection <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5"
              style={{ border: '1.5px solid #493B35', color: '#493B35', backgroundColor: 'rgba(255,249,242,0.8)' }}
            >
              Custom Order <Sparkles size={18} />
            </Link>
          </div>
        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest" style={{ color: '#6B5247' }}>SCROLL</span>
          <div className="w-px h-12 animate-pulse" style={{ backgroundColor: '#A8B5A0' }} />
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <SectionTitle title="Shop by Category" subtitle="Explore our handcrafted collections" centered scriptText="What are you looking for?" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-square img-zoom-wrapper"
            >
              <img
                src={CATEGORY_IMAGES[cat.slug] ?? '/product-images/coverpage.jpeg'}
                alt={cat.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm md:text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {cat.label}
                </p>
                <p className="text-white/70 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      {bestsellers.length > 0 && (
        <section className="py-16 px-4" style={{ backgroundColor: '#F5DDE3' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <SectionTitle
                title="Our Bestsellers"
                subtitle="Most loved pieces, handmade just for you"
                scriptText="Fan favourites"
              />
              <Link
                to="/shop"
                className="hidden md:flex items-center gap-1 text-sm font-medium hover:underline mb-10"
                style={{ color: '#493B35' }}
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestsellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== RECENTLY ADDED ===== */}
      {recentlyAdded.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <SectionTitle
              title="Recently Added"
              subtitle="Fresh arrivals from our studio"
              scriptText="Just dropped"
            />
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-1 text-sm font-medium hover:underline mb-10"
              style={{ color: '#493B35' }}
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {recentlyAdded.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ===== CUSTOM ORDER CTA ===== */}
      <section className="py-20 px-4" style={{ backgroundColor: '#E9DCCB' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-3 text-lg" style={{ fontFamily: 'Dancing Script, cursive', color: '#6B5247' }}>
            Made just for you
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}>
            Can't Find What You're Looking For?
          </h2>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#6B5247' }}>
            Every Crochella piece can be customized — choose your colors, sizes, and designs.
            We love bringing your vision to life, one stitch at a time.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ backgroundColor: '#493B35', color: 'white' }}
          >
            <MessageCircle size={18} />
            Request Custom Order
          </Link>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <SectionTitle title="What Our Customers Say" centered scriptText="Happy hearts" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl"
              style={{ backgroundColor: 'white', border: '1px solid #E9DCCB' }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-sm italic mb-4 leading-relaxed" style={{ color: '#6B5247' }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#A8B5A0' }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#493B35' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#A8B5A0' }}>{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== INSTAGRAM GALLERY ===== */}
      {galleryImages.length > 0 && (
        <section className="py-16 px-4" style={{ backgroundColor: '#FFF9F2' }}>
          <div className="max-w-6xl mx-auto">
            <SectionTitle title="Follow Our Journey" subtitle="@crochella on Instagram" centered />
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-3 mb-8">
              {galleryImages.slice(0, 9).map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden img-zoom-wrapper">
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-center">
              <a
                href="https://instagram.com/crochella"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ border: '1.5px solid #493B35', color: '#493B35' }}
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
