import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useProductStore } from '../store/productStore'
import ProductCard from '../components/product/ProductCard'
import { CATEGORY_LABELS, type ProductCategory } from '../types'
import { formatPrice } from '../utils/helpers'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular',    label: 'Most Popular' },
]

// Category hero images mapped to product images we have
const CATEGORY_IMAGES: Record<string, string> = {
  'crochet-bags':     '/product-images/lilybag(1).jpeg',
  'crochet-coasters': '/product-images/coaster.jpeg',
  'table-mats':       '/product-images/table_mat.jpeg',
  'crochet-flowers':  '/product-images/aasan_flower.jpeg',
  'custom-creations': '/product-images/rose_earrings.jpeg',
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const products = useProductStore((s) => s.products)
  const isLoading = useProductStore((s) => s.isLoading)

  const [sortBy, setSortBy] = useState('newest')

  const categoryLabel = CATEGORY_LABELS[category as ProductCategory] ?? category ?? 'Category'
  const heroImage = CATEGORY_IMAGES[category ?? ''] ?? '/product-images/coverpage.jpeg'

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.is_available && p.category === category)

    switch (sortBy) {
      case 'price-asc':
        list = [...list].sort((a, b) => (a.discounted_price ?? a.price) - (b.discounted_price ?? b.price))
        break
      case 'price-desc':
        list = [...list].sort((a, b) => (b.discounted_price ?? b.price) - (a.discounted_price ?? a.price))
        break
      case 'popular':
        list = [...list].sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0))
        break
      case 'newest':
      default:
        list = [...list].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }
    return list
  }, [products, category, sortBy])

  // Price range for this category
  const prices = filtered.map((p) => p.discounted_price ?? p.price)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={heroImage}
          alt={categoryLabel}
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ background: 'rgba(73,59,53,0.45)' }}
        >
          <p
            className="text-sm font-medium tracking-widest uppercase mb-1"
            style={{ color: '#F5DDE3', fontFamily: 'Dancing Script, cursive' }}
          >
            Handmade Collection
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {categoryLabel}
          </h1>
          {prices.length > 0 && (
            <p className="text-sm mt-2 text-white/80">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'} ·{' '}
              {formatPrice(minPrice)} – {formatPrice(maxPrice)}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: '#A8B5A0' }}>
          <Link to="/" className="hover:text-[#493B35] transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#493B35] transition">Shop</Link>
          <span>/</span>
          <span className="font-medium" style={{ color: '#493B35' }}>{categoryLabel}</span>
        </nav>

        {/* ── Sort bar ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: '#7A6B63' }}>
            {isLoading
              ? 'Loading…'
              : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}
          </p>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-full border text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] cursor-pointer"
              style={{ borderColor: '#E9DCCB', color: '#493B35' }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#A8B5A0' }}
            />
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-[#F5DDE3]/60" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#E9DCCB] rounded-full w-1/3" />
                  <div className="h-4 bg-[#E9DCCB] rounded-full w-3/4" />
                  <div className="h-4 bg-[#E9DCCB] rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🧶</span>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
            >
              Coming Soon
            </h3>
            <p className="text-sm mb-6" style={{ color: '#A8B5A0' }}>
              We're working on beautiful {categoryLabel} just for you.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition inline-block"
              style={{ backgroundColor: '#A8B5A0' }}
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* ── Other categories ────────────────────────────────────────────── */}
        <div className="mt-16 pt-10" style={{ borderTop: '1px solid #E9DCCB' }}>
          <h3
            className="text-xl font-bold text-center mb-6"
            style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
          >
            Explore More Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {(Object.entries(CATEGORY_LABELS) as [ProductCategory, string][])
              .filter(([slug]) => slug !== category)
              .map(([slug, label]) => (
                <Link
                  key={slug}
                  to={`/category/${slug}`}
                  className="px-4 py-2 rounded-full text-sm font-medium border transition hover:bg-[#F5DDE3]"
                  style={{ borderColor: '#E9DCCB', color: '#493B35' }}
                >
                  {label}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
