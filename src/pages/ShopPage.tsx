import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useProductStore } from '../store/productStore'
import ShopProductCard from '../components/product/ShopProductCard'
import { CATEGORY_LABELS, type ProductCategory } from '../types'
import { sectionReveal, staggerContainer, cardReveal, panelExpand } from '../utils/motion'
import Bow from '../components/ui/Bow'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
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
  const prefersReducedMotion = useReducedMotion()

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

  /* ── shared pill styles ── */
  const pillBase =
    'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0'
  const pillInactive =
    'bg-white text-[#57382D] border border-[#F4DAD8] hover:bg-[#F4DAD8] hover:shadow-sm'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F1' }}>
      {/* ══════════════════════════════════════════════════════
          PAGE HERO
      ══════════════════════════════════════════════════════ */}
      <div
        className="relative py-16 text-center"
        style={{ background: 'linear-gradient(135deg, #F4DAD8 0%, #FFF8F1 60%, #F6E5D9 100%)' }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionReveal(prefersReducedMotion)}
        >
          <div className="mb-3 flex justify-center">
            <Bow size={28} />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#57382D' }}
          >
            A Little Handmade Happiness
          </h1>
          {/* Heart divider */}
          <div
            className="flex items-center justify-center gap-2 mb-3"
            style={{ color: '#C96F78' }}
          >
            <span style={{ height: '1px', width: '40px', backgroundColor: '#F4DAD8', display: 'block' }} />
            ♥
            <span style={{ height: '1px', width: '40px', backgroundColor: '#F4DAD8', display: 'block' }} />
          </div>
          <p className="text-base max-w-md mx-auto" style={{ color: '#7A5C50' }}>
            Explore thoughtful crochet creations, lovingly made stitch by stitch.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ══════════════════════════════════════════════════════
            TOOLBAR  (search · filter toggle · sort)
        ══════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionReveal(prefersReducedMotion)}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6"
        >
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
              placeholder="Find something lovely..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] transition-shadow duration-300"
              style={{ borderColor: '#F4DAD8', color: '#57382D' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 hover:text-[#C96F78]"
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 hover:shadow-md"
              style={{
                borderColor: showFilters ? '#57382D' : '#F4DAD8',
                backgroundColor: showFilters ? '#57382D' : 'white',
                color: showFilters ? 'white' : '#57382D',
              }}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C96F78' }} />
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-full border text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] cursor-pointer transition-shadow duration-300"
                style={{ borderColor: '#F4DAD8', color: '#57382D' }}
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
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            FILTER PANEL  (smooth expand / collapse)
        ══════════════════════════════════════════════════════ */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={panelExpand(prefersReducedMotion)}
              style={{ overflow: 'hidden' }}
            >
              <div
                className="bg-white rounded-2xl border p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6"
                style={{ borderColor: '#F4DAD8' }}
              >
                {/* Categories */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: '#A8B5A0' }}
                  >
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveCategory('')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        activeCategory === ''
                          ? 'text-white'
                          : 'bg-[#F4DAD8] text-[#57382D] hover:bg-[#F6E5D9]'
                      }`}
                      style={activeCategory === '' ? { backgroundColor: '#57382D' } : {}}
                    >
                      All
                    </button>
                    {categories.map(([slug, label]) => (
                      <button
                        key={slug}
                        onClick={() => setActiveCategory(activeCategory === slug ? '' : slug)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          activeCategory === slug
                            ? 'text-white'
                            : 'bg-[#F4DAD8] text-[#57382D] hover:bg-[#F6E5D9]'
                        }`}
                        style={activeCategory === slug ? { backgroundColor: '#57382D' } : {}}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: '#A8B5A0' }}
                  >
                    Price Range
                  </p>
                  <div className="flex flex-col gap-2">
                    {PRICE_RANGES.map((r, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:text-[#C96F78]"
                      >
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === i}
                          onChange={() => setPriceRange(i)}
                          className="accent-[#57382D]"
                        />
                        <span className="text-sm" style={{ color: '#57382D' }}>
                          {r.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability + clear */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: '#A8B5A0' }}
                  >
                    Availability
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer mb-6">
                    <input
                      type="checkbox"
                      checked={availableOnly}
                      onChange={(e) => setAvailableOnly(e.target.checked)}
                      className="accent-[#57382D] w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: '#57382D' }}>
                      In Stock Only
                    </span>
                  </label>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-medium transition-colors duration-200 flex items-center gap-1 hover:opacity-80"
                      style={{ color: '#C96F78' }}
                    >
                      <X size={12} /> Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════
            CATEGORY CHIPS  (quick filter row)
        ══════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionReveal(prefersReducedMotion)}
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide"
        >
          <button
            onClick={() => setActiveCategory('')}
            className={`${pillBase} ${
              activeCategory === '' ? 'text-white' : pillInactive
            }`}
            style={activeCategory === '' ? { backgroundColor: '#57382D', borderColor: '#57382D' } : {}}
          >
            All Products
          </button>
          {categories.map(([slug, label]) => (
            <button
              key={slug}
              onClick={() => setActiveCategory(activeCategory === slug ? '' : slug)}
              className={`${pillBase} ${
                activeCategory === slug ? 'text-white' : pillInactive
              }`}
              style={activeCategory === slug ? { backgroundColor: '#57382D', borderColor: '#57382D' } : {}}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            RESULTS COUNT
        ══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm" style={{ color: '#7A5C50' }}>
            {isLoading ? (
              'Loading products…'
            ) : (
              <>
                Showing <strong style={{ color: '#57382D' }}>{filtered.length}</strong>{' '}
                {filtered.length === 1 ? 'product' : 'products'}
                {activeCategory && (
                  <>
                    {' '}in <strong style={{ color: '#57382D' }}>{CATEGORY_LABELS[activeCategory as ProductCategory]}</strong>
                  </>
                )}
              </>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium transition-colors duration-200 flex items-center gap-1 hover:text-[#C96F78]"
              style={{ color: '#A8B5A0' }}
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════
            PRODUCT GRID  (staggered entrance, arched cards)
        ══════════════════════════════════════════════════════ */}
        {isLoading ? (
          /* ── Loading skeletons (matching arched card shape) ── */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                {/* Arched image placeholder */}
                <div
                  className="animate-pulse"
                  style={{
                    aspectRatio: '4 / 5',
                    borderRadius: '50% 50% 12px 12px / 30% 30% 12px 12px',
                    backgroundColor: 'rgba(244, 218, 216, 0.5)',
                    border: '1px solid #F4DAD8',
                  }}
                />
                {/* Text + button placeholders */}
                <div className="pt-3 px-1 space-y-2 animate-pulse">
                  <div className="h-3 bg-[#F6E5D9] rounded-full w-1/3" />
                  <div className="h-4 bg-[#F6E5D9] rounded-full w-3/4" />
                  <div className="h-4 bg-[#F6E5D9] rounded-full w-1/2" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-8 bg-[#F6E5D9] rounded-full flex-1" />
                    <div className="h-8 bg-[#F6E5D9] rounded-full flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* ── Empty state ── */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionReveal(prefersReducedMotion)}
            className="text-center py-20"
          >
            <span className="text-6xl block mb-4">🧶</span>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: '#57382D' }}
            >
              No products found
            </h3>
            <p className="text-sm mb-6" style={{ color: '#A8B5A0' }}>
              Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#57382D' }}
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          /* ── Grid with staggered children ── */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(prefersReducedMotion)}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {filtered.map((product) => (
              <motion.div key={product.id} variants={cardReveal(prefersReducedMotion)}>
                <ShopProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
