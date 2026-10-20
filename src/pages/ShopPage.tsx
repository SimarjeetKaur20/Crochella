import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useProductStore } from '../store/productStore'
import ProductCard from '../components/product/ProductCard'
import { CATEGORY_LABELS, type ProductCategory } from '../types'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular',    label: 'Most Popular' },
]

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: 'Above ₹2,000', min: 2000, max: Infinity },
]

export default function ShopPage() {
  const products = useProductStore((s) => s.products)
  const isLoading = useProductStore((s) => s.isLoading)
  const [searchParams, setSearchParams] = useSearchParams()

  // Read query params
  const qSearch   = searchParams.get('q') ?? ''
  const qCategory = searchParams.get('category') ?? ''

  const [search, setSearch]             = useState(qSearch)
  const [activeCategory, setActiveCategory] = useState<string>(qCategory)
  const [priceRange, setPriceRange]     = useState(0) // index into PRICE_RANGES
  const [sortBy, setSortBy]             = useState('newest')
  const [showFilters, setShowFilters]   = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)

  // Sync URL search param → local state
  useEffect(() => {
    if (qSearch) setSearch(qSearch)
    if (qCategory) setActiveCategory(qCategory)
  }, [qSearch, qCategory])

  const categories = Object.entries(CATEGORY_LABELS) as [ProductCategory, string][]

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.is_available)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory)
    }

    if (availableOnly) {
      list = list.filter((p) => p.stock_quantity > 0)
    }

    const range = PRICE_RANGES[priceRange]
    list = list.filter((p) => {
      const price = p.discounted_price ?? p.price
      return price >= range.min && price <= range.max
    })

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
  }, [products, search, activeCategory, priceRange, sortBy, availableOnly])

  function clearFilters() {
    setSearch('')
    setActiveCategory('')
    setPriceRange(0)
    setSortBy('newest')
    setAvailableOnly(false)
    setSearchParams({})
  }

  const hasActiveFilters = search || activeCategory || priceRange !== 0 || availableOnly

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <div
        className="relative py-16 text-center"
        style={{ background: 'linear-gradient(135deg, #F5DDE3 0%, #FFF9F2 60%, #E9DCCB 100%)' }}
      >
        <p
          className="text-sm font-medium tracking-widest uppercase mb-2"
          style={{ color: '#A8B5A0', fontFamily: 'Dancing Script, cursive' }}
        >
          Handmade with Love
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold mb-3"
          style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
        >
          Shop Our Collection
        </h1>
        <p className="text-base max-w-md mx-auto" style={{ color: '#7A6B63' }}>
          Every piece is lovingly handcrafted, one stitch at a time.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: '#A8B5A0' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]"
              style={{ borderColor: '#E9DCCB', color: '#493B35' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#A8B5A0' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((f) => !f)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition"
              style={{
                borderColor: showFilters ? '#493B35' : '#E9DCCB',
                backgroundColor: showFilters ? '#493B35' : 'white',
                color: showFilters ? 'white' : '#493B35',
              }}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#F5DDE3]" />
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-full border text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] cursor-pointer"
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
        </div>

        {/* ── Filter panel ────────────────────────────────────────────────── */}
        {showFilters && (
          <div
            className="bg-white rounded-2xl border p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ borderColor: '#E9DCCB' }}
          >
            {/* Categories */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A8B5A0' }}>
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    activeCategory === '' ? 'text-white' : 'bg-[#F5DDE3] text-[#493B35] hover:bg-[#edcdd5]'
                  }`}
                  style={activeCategory === '' ? { backgroundColor: '#493B35' } : {}}
                >
                  All
                </button>
                {categories.map(([slug, label]) => (
                  <button
                    key={slug}
                    onClick={() => setActiveCategory(activeCategory === slug ? '' : slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      activeCategory === slug ? 'text-white' : 'bg-[#F5DDE3] text-[#493B35] hover:bg-[#edcdd5]'
                    }`}
                    style={activeCategory === slug ? { backgroundColor: '#493B35' } : {}}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A8B5A0' }}>
                Price Range
              </p>
              <div className="flex flex-col gap-2">
                {PRICE_RANGES.map((r, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === i}
                      onChange={() => setPriceRange(i)}
                      className="accent-[#493B35]"
                    />
                    <span className="text-sm" style={{ color: '#493B35' }}>
                      {r.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability + clear */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A8B5A0' }}>
                Availability
              </p>
              <label className="flex items-center gap-2 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="accent-[#493B35] w-4 h-4"
                />
                <span className="text-sm" style={{ color: '#493B35' }}>
                  In Stock Only
                </span>
              </label>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-rose-500 hover:text-rose-600 transition flex items-center gap-1"
                >
                  <X size={12} /> Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Category pills (quick) ──────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition shrink-0 ${
              activeCategory === '' ? 'text-white' : 'bg-white text-[#493B35] border border-[#E9DCCB] hover:bg-[#F5DDE3]'
            }`}
            style={activeCategory === '' ? { backgroundColor: '#493B35' } : {}}
          >
            All Products
          </button>
          {categories.map(([slug, label]) => (
            <button
              key={slug}
              onClick={() => setActiveCategory(activeCategory === slug ? '' : slug)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition shrink-0 ${
                activeCategory === slug ? 'text-white' : 'bg-white text-[#493B35] border border-[#E9DCCB] hover:bg-[#F5DDE3]'
              }`}
              style={activeCategory === slug ? { backgroundColor: '#493B35' } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Results count ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm" style={{ color: '#7A6B63' }}>
            {isLoading ? (
              'Loading products…'
            ) : (
              <>
                Showing <strong>{filtered.length}</strong>{' '}
                {filtered.length === 1 ? 'product' : 'products'}
                {activeCategory && (
                  <> in <strong>{CATEGORY_LABELS[activeCategory as ProductCategory]}</strong></>
                )}
              </>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium hover:text-rose-500 transition flex items-center gap-1"
              style={{ color: '#A8B5A0' }}
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* ── Product Grid ────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#F5DDE3]/60" />
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
              No products found
            </h3>
            <p className="text-sm mb-6" style={{ color: '#A8B5A0' }}>
              Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition"
              style={{ backgroundColor: '#A8B5A0' }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
