import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Share2, Clock, Palette, Ruler } from 'lucide-react'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'
import ProductCard from '../components/product/ProductCard'
import { CATEGORY_LABELS, type ProductCategory } from '../types'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const products = useProductStore((s) => s.products)
  const addItem = useCartStore((s) => s.addItem)

  const product = products.find((p) => p.slug === slug)

  const [currentImage, setCurrentImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [customNote, setCustomNote] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center gap-4 px-4">
        <span className="text-6xl">🧶</span>
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
        >
          Product not found
        </h2>
        <p style={{ color: '#A8B5A0' }}>This item may have been removed or is unavailable.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition"
          style={{ backgroundColor: '#A8B5A0' }}
        >
          Back to Shop
        </button>
      </div>
    )
  }

  // After this point product is guaranteed to be defined
  const p = product!

  // Related products — same category, exclude current
  const related = products
    .filter((prod) => prod.category === p.category && prod.id !== p.id && prod.is_available)
    .slice(0, 4)

  const displayPrice = p.discounted_price ?? p.price
  const isOutOfStock = !p.is_available || p.stock_quantity === 0

  function prevImage() {
    setCurrentImage((i) => (i === 0 ? p.images.length - 1 : i - 1))
  }
  function nextImage() {
    setCurrentImage((i) => (i === p.images.length - 1 ? 0 : i + 1))
  }

  function handleAddToCart() {
    if (isOutOfStock) return
    if (p.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color.')
      return
    }
    if (p.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size.')
      return
    }
    addItem(p, quantity, selectedColor || undefined, selectedSize || undefined, customNote || undefined)
    toast.success(`${p.name} added to cart! 🛍️`)
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: p.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto px-4 md:px-8 py-4"
        style={{ borderBottom: '1px solid #E9DCCB' }}
      >
        <nav className="flex items-center gap-2 text-xs" style={{ color: '#A8B5A0' }}>
          <Link to="/" className="hover:text-[#493B35] transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#493B35] transition">Shop</Link>
          <span>/</span>
          <Link
            to={`/category/${p.category}`}
            className="hover:text-[#493B35] transition"
          >
            {CATEGORY_LABELS[p.category as ProductCategory] ?? p.category}
          </Link>
          <span>/</span>
          <span className="font-medium" style={{ color: '#493B35' }}>
            {p.name}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ── Image Gallery ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-md aspect-square" style={{ backgroundColor: '#FFF8F1' }}>
              {p.images.length > 0 ? (
                <img
                  src={p.images[currentImage]}
                  alt={p.name}
                  className="w-full h-full object-contain transition-opacity duration-300"
                  style={{ objectPosition: 'center' }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: '#F5DDE3' }}
                >
                  🧶
                </div>
              )}

              {/* Prev / Next arrows */}
              {p.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} style={{ color: '#493B35' }} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} style={{ color: '#493B35' }} />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {p.is_new && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#A8B5A0' }}>
                    New Arrival
                  </span>
                )}
                {p.discounted_price && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#E57373' }}>
                    Sale
                  </span>
                )}
                {isOutOfStock && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#9E9E9E' }}>
                    Sold Out
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {p.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {p.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                      currentImage === i ? 'border-[#493B35]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${p.name} view ${i + 1}`} className="w-full h-full object-cover object-center" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ───────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Category + name */}
            <div>
              <Link
                to={`/category/${p.category}`}
                className="text-xs font-semibold tracking-widest uppercase hover:underline"
                style={{ color: '#A8B5A0' }}
              >
                {CATEGORY_LABELS[p.category as ProductCategory] ?? p.category}
              </Link>
              <h1
                className="text-3xl md:text-4xl font-bold mt-1 leading-tight"
                style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
              >
                {p.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold" style={{ color: '#493B35' }}>
                {formatPrice(displayPrice)}
              </span>
              {p.discounted_price && (
                <>
                  <span className="text-lg line-through" style={{ color: '#9E9E9E' }}>
                    {formatPrice(p.price)}
                  </span>
                  <span
                    className="text-sm font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: '#E57373' }}
                  >
                    {Math.round(((p.price - p.discounted_price) / p.price) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: '#7A6B63' }}>
              {p.description}
            </p>

            {/* Color selection */}
            {p.colors.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold mb-2.5" style={{ color: '#493B35' }}>
                  <Palette size={15} />
                  Color
                  {selectedColor && (
                    <span className="font-normal ml-1" style={{ color: '#A8B5A0' }}>
                      — {selectedColor}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                      className={`px-3.5 py-1.5 rounded-full text-sm border transition ${
                        selectedColor === color
                          ? 'text-white border-transparent'
                          : 'bg-white hover:bg-[#F5DDE3]'
                      }`}
                      style={
                        selectedColor === color
                          ? { backgroundColor: '#493B35', borderColor: '#493B35' }
                          : { borderColor: '#E9DCCB', color: '#493B35' }
                      }
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {p.sizes.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold mb-2.5" style={{ color: '#493B35' }}>
                  <Ruler size={15} />
                  Size
                  {selectedSize && (
                    <span className="font-normal ml-1" style={{ color: '#A8B5A0' }}>
                      — {selectedSize}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`px-4 py-1.5 rounded-full text-sm border transition ${
                        selectedSize === size
                          ? 'text-white border-transparent'
                          : 'bg-white hover:bg-[#F5DDE3]'
                      }`}
                      style={
                        selectedSize === size
                          ? { backgroundColor: '#493B35', borderColor: '#493B35' }
                          : { borderColor: '#E9DCCB', color: '#493B35' }
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization note */}
            {p.customization_options && (
              <div>
                <label
                  className="text-sm font-semibold block mb-2"
                  style={{ color: '#493B35' }}
                >
                  Customization Notes (optional)
                </label>
                <p className="text-xs mb-2" style={{ color: '#A8B5A0' }}>
                  {p.customization_options}
                </p>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. I'd like this in ocean blue…"
                  className="w-full px-3 py-2 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] resize-none"
                  style={{ borderColor: '#E9DCCB', color: '#493B35' }}
                />
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 pt-2">
              {/* Quantity selector */}
              <div
                className="flex items-center gap-1 rounded-full border px-2 py-1"
                style={{ borderColor: '#E9DCCB' }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium hover:bg-[#F5DDE3] transition"
                  style={{ color: '#493B35' }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold" style={{ color: '#493B35' }}>
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(p.stock_quantity || 10, q + 1))
                  }
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium hover:bg-[#F5DDE3] transition"
                  style={{ color: '#493B35' }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isOutOfStock ? '#E9DCCB' : '#493B35',
                  color: isOutOfStock ? '#9E9E9E' : 'white',
                }}
              >
                <ShoppingBag size={16} />
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                className="w-12 h-12 rounded-full border flex items-center justify-center transition"
                style={{
                  borderColor: '#E9DCCB',
                  color: wishlisted ? '#E57373' : '#A8B5A0',
                  backgroundColor: wishlisted ? '#fff0f0' : 'white',
                }}
                aria-label="Add to wishlist"
              >
                <Heart size={18} fill={wishlisted ? '#E57373' : 'none'} />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-full border flex items-center justify-center transition hover:bg-[#F5DDE3]"
                style={{ borderColor: '#E9DCCB', color: '#A8B5A0' }}
                aria-label="Share product"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Info pills */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ backgroundColor: '#F5DDE3' }}
              >
                <Clock size={16} style={{ color: '#493B35' }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#493B35' }}>
                    Preparation Time
                  </p>
                  <p className="text-xs" style={{ color: '#7A6B63' }}>
                    {p.preparation_time}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ backgroundColor: '#E9DCCB' }}
              >
                <ShoppingBag size={16} style={{ color: '#493B35' }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#493B35' }}>
                    In Stock
                  </p>
                  <p className="text-xs" style={{ color: '#7A6B63' }}>
                    {p.stock_quantity > 0
                      ? `${p.stock_quantity} available`
                      : 'Sold out'}
                  </p>
                </div>
              </div>
            </div>

            {/* SKU */}
            {p.sku && (
              <p className="text-xs" style={{ color: '#A8B5A0' }}>
                SKU: {p.sku}
              </p>
            )}
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="text-center mb-8">
              <p
                className="text-sm font-medium mb-1"
                style={{ fontFamily: 'Dancing Script, cursive', color: '#A8B5A0' }}
              >
                You Might Also Love
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
              >
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
