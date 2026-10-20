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
  const displayPrice = product.discounted_price ?? product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.is_available || product.stock_quantity === 0) return
    addItem(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Link
      to={`/shop/${product.slug}`}
      className={`product-card group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* Image */}
      <div className="relative img-zoom-wrapper aspect-square bg-gray-50">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F5DDE3' }}>
            <span style={{ fontFamily: 'Dancing Script, cursive', color: '#493B35', fontSize: '1.2rem' }}>
              Crochella
            </span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_new && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: '#A8B5A0' }}>
              New
            </span>
          )}
          {product.discounted_price && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: '#E57373' }}>
              Sale
            </span>
          )}
          {!product.is_available || product.stock_quantity === 0 ? (
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: '#9E9E9E' }}>
              Sold Out
            </span>
          ) : null}
        </div>

        {/* Add to cart hover button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available || product.stock_quantity === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{ backgroundColor: '#493B35', color: 'white' }}
          >
            <ShoppingBag size={14} />
            {product.is_available && product.stock_quantity > 0 ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs mb-1" style={{ color: '#A8B5A0', fontWeight: 500 }}>
          {CATEGORY_LABELS[product.category as ProductCategory] ?? product.category}
        </p>
        <h3 className="font-medium text-sm mb-2 line-clamp-2" style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold" style={{ color: '#493B35', fontSize: '0.95rem' }}>
            {formatPrice(displayPrice)}
          </span>
          {product.discounted_price && (
            <span className="text-xs line-through" style={{ color: '#9E9E9E' }}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {product.colors.length > 0 && (
          <p className="text-xs mt-1" style={{ color: '#9E9E9E' }}>
            {product.colors.length} color{product.colors.length > 1 ? 's' : ''} available
          </p>
        )}
      </div>
    </Link>
  )
}
