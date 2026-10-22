import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'
import { CATEGORY_LABELS } from '../../types'
import type { Product, ProductCategory } from '../../types'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [activeImg, setActiveImg] = useState(0)
  const [hovered, setHovered] = useState(false)

  const displayPrice = product.discounted_price ?? product.price
  const hasMultiple = product.images.length > 1

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.is_available || product.stock_quantity === 0) return
    addItem(product, 1)
    toast.success(`${product.name} added to cart! 🛍️`)
  }

  return (
    <Link
      to={`/shop/${product.slug}`}
      className={`group block bg-white rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
      style={{
        boxShadow: hovered ? '0 12px 32px rgba(87,56,45,0.14)' : '0 2px 8px rgba(87,56,45,0.07)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        border: '1px solid #F4DAD8',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActiveImg(0) }}
    >
      {/* ── Image area ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', backgroundColor: '#FFF8F1' }}>
        {product.images.length > 0 ? (
          <img
            src={product.images[activeImg]}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{
              objectPosition: 'center',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F4DAD8' }}>
            <span style={{ fontFamily: 'Dancing Script, cursive', color: '#57382D', fontSize: '1.1rem' }}>
              Crochella
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.is_new && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#A8B5A0' }}>
              New
            </span>
          )}
          {product.discounted_price && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#C96F78' }}>
              Sale
            </span>
          )}
          {(!product.is_available || product.stock_quantity === 0) && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#9E9E9E' }}>
              Sold Out
            </span>
          )}
        </div>

        {/* Image dots — show on hover when multiple images exist */}
        {hasMultiple && hovered && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
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
                  backgroundColor: activeImg === i ? '#57382D' : 'rgba(255,255,255,0.8)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.2s ease, background-color 0.2s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* Image count badge (static, bottom-right, only when multiple) */}
        {hasMultiple && !hovered && (
          <div
            className="absolute bottom-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: 'white' }}
          >
            1/{product.images.length}
          </div>
        )}

        {/* Add to cart hover button */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-center pb-3"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available || product.stock_quantity === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-50"
            style={{ backgroundColor: '#57382D', color: 'white', boxShadow: '0 4px 12px rgba(87,56,45,0.3)' }}
          >
            <ShoppingBag size={12} />
            {product.is_available && product.stock_quantity > 0 ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-3">
        <p className="text-[10px] font-medium mb-0.5 uppercase tracking-wider" style={{ color: '#C96F78' }}>
          {CATEGORY_LABELS[product.category as ProductCategory] ?? product.category}
        </p>
        <h3
          className="text-sm font-semibold leading-snug mb-1.5"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#57382D' }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: '#57382D' }}>
            {formatPrice(displayPrice)}
          </span>
          {product.discounted_price && (
            <span className="text-xs line-through" style={{ color: '#A8B5A0' }}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {product.colors.length > 0 && (
          <p className="text-[10px] mt-1" style={{ color: '#A8B5A0' }}>
            {product.colors.length} color{product.colors.length > 1 ? 's' : ''} available
          </p>
        )}
      </div>
    </Link>
  )
}
