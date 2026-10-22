import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Heart, ArrowRight } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'
import { CATEGORY_LABELS } from '../../types'
import type { Product, ProductCategory } from '../../types'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'

interface ShopProductCardProps {
  product: Product
}

/**
 * Pinterest-inspired arched product card for the Shop page.
 *
 * The image lives inside a semicircular-arch container (matching the
 * homepage's ArchCard shape) with subtle border, soft shadow, and a
 * gentle zoom on hover.  Product name, price, and action buttons sit
 * clearly below the photograph — never overlapping it.
 *
 * The homepage's ProductCard is intentionally left untouched; this is a
 * separate component so the homepage design is not altered.
 */
export default function ShopProductCard({ product }: ShopProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [activeImg, setActiveImg] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const displayPrice = product.discounted_price ?? product.price
  const hasMultiple = product.images.length > 1
  const isOutOfStock = !product.is_available || product.stock_quantity === 0

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return
    addItem(product, 1)
    toast.success(`${product.name} added to cart! 🛍️`)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted((w) => {
      toast.success(w ? 'Removed from wishlist' : 'Added to wishlist! 💝', { duration: 1800 })
      return !w
    })
  }

  return (
    <div
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActiveImg(0) }}
      style={{
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* ══════════════════════════════════════════════════════
          ARCHED IMAGE CONTAINER
      ══════════════════════════════════════════════════════ */}
      <Link to={`/shop/${product.slug}`}>
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '4 / 5',
            borderRadius: '50% 50% 12px 12px / 30% 30% 12px 12px',
            border: `1.5px solid ${hovered ? '#C96F78' : '#F4DAD8'}`,
            backgroundColor: '#FFF8F1',
            boxShadow: hovered
              ? '0 12px 32px rgba(87,56,45,0.18)'
              : '0 2px 12px rgba(87,56,45,0.07)',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          }}
        >
          {product.images.length > 0 ? (
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center',
                transform: hovered ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform 0.5s ease',
              }}
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: '#F4DAD8' }}
            >
              <span
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  color: '#57382D',
                  fontSize: '1.1rem',
                }}
              >
                Crochella
              </span>
            </div>
          )}

          {/* Badges (top-left) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.is_new && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: '#A8B5A0' }}
              >
                New
              </span>
            )}
            {product.discounted_price && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: '#C96F78' }}
              >
                Sale
              </span>
            )}
            {isOutOfStock && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: '#9E9E9E' }}
              >
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist button (top-right) */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: wishlisted
                ? 'rgba(201,111,120,0.18)'
                : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(4px)',
              color: wishlisted ? '#C96F78' : '#57382D',
              border: wishlisted ? '1px solid rgba(201,111,120,0.3)' : '1px solid transparent',
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={wishlisted ? '#C96F78' : 'none'} />
          </button>

          {/* Image dots (bottom, on hover, for multi-image products) */}
          {hasMultiple && hovered && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 z-10">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`View image ${i + 1}`}
                  onMouseEnter={(e) => { e.preventDefault(); e.stopPropagation(); setActiveImg(i) }}
                  onClick={(e) => e.preventDefault()}
                  style={{
                    width: activeImg === i ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor:
                      activeImg === i ? '#57382D' : 'rgba(255,255,255,0.8)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'width 0.2s ease, background-color 0.2s ease',
                  }}
                />
              ))}
            </div>
          )}

          {/* Static image count badge (bottom-right, when not hovering) */}
          {hasMultiple && !hovered && (
            <div
              className="absolute bottom-3 right-3 text-[10px] font-medium px-1.5 py-0.5 rounded-full z-10"
              style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: 'white' }}
            >
              1/{product.images.length}
            </div>
          )}
        </div>
      </Link>

      {/* ══════════════════════════════════════════════════════
          INFO AREA  (below the arch — never overlaps the photo)
      ══════════════════════════════════════════════════════ */}
      <div className="pt-3 px-1">
        {/* Category */}
        <p
          className="text-[10px] font-medium mb-0.5 uppercase tracking-wider"
          style={{ color: '#C96F78' }}
        >
          {CATEGORY_LABELS[product.category as ProductCategory] ?? product.category}
        </p>

        {/* Name (links to product page) */}
        <Link to={`/shop/${product.slug}`}>
          <h3
            className="text-sm font-semibold leading-snug mb-1.5 transition-colors duration-200 hover:text-[#C96F78]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: '#57382D',
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold" style={{ color: '#57382D' }}>
            {formatPrice(displayPrice)}
          </span>
          {product.discounted_price && (
            <span className="text-xs line-through" style={{ color: '#A8B5A0' }}>
              {formatPrice(product.price)}
            </span>
          )}
          {isOutOfStock && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#F6E5D9', color: '#9E9E9E' }}
            >
              Sold Out
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <p className="text-[10px] mb-2" style={{ color: '#A8B5A0' }}>
            {product.colors.length} color{product.colors.length > 1 ? 's' : ''} available
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          {/* View Details */}
          <Link
            to={`/shop/${product.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:shadow-md hover:border-[#C96F78]"
            style={{
              border: '1.5px solid #57382D',
              color: '#57382D',
              backgroundColor: 'transparent',
            }}
          >
            View Details
            <ArrowRight size={12} />
          </Link>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isOutOfStock ? '#F6E5D9' : '#57382D',
              color: isOutOfStock ? '#9E9E9E' : 'white',
              border: 'none',
            }}
          >
            <ShoppingBag size={12} />
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
