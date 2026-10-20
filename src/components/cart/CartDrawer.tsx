import { useCartStore } from '../../store/cartStore'
import { useProductStore } from '../../store/productStore'
import { formatPrice, calculateShipping } from '../../utils/helpers'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore()
  const siteConfig = useProductStore((s) => s.siteConfig)

  const sub = subtotal()
  const shipping = calculateShipping(sub, siteConfig.free_shipping_above, siteConfig.shipping_fee)
  const total = sub + shipping

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col shadow-2xl"
        style={{ width: '100%', maxWidth: '420px', backgroundColor: '#FFF9F2' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#E9DCCB' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: '#493B35' }} />
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}>
              Your Cart
            </h2>
            <span className="text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5DDE3', color: '#493B35' }}>
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: '#493B35' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} style={{ color: '#E9DCCB' }} />
              <div>
                <p className="text-lg font-medium mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}>
                  Your cart is empty
                </p>
                <p className="text-sm" style={{ color: '#A8B5A0' }}>
                  Add some beautiful handmade pieces!
                </p>
              </div>
              <button
                onClick={closeCart}
                className="btn-primary text-sm px-6 py-2.5"
                style={{ backgroundColor: '#493B35', color: 'white', borderRadius: '9999px', fontWeight: 500 }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => {
                const price = item.product.discounted_price ?? item.product.price
                return (
                  <div key={idx} className="flex gap-3 p-3 rounded-xl" style={{ backgroundColor: 'white', border: '1px solid #E9DCCB' }}>
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: '#F5DDE3' }}>
                      {item.product.images[0] && (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2" style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}>
                        {item.product.name}
                      </p>
                      {item.selected_color && (
                        <p className="text-xs mt-0.5" style={{ color: '#A8B5A0' }}>Color: {item.selected_color}</p>
                      )}
                      {item.selected_size && (
                        <p className="text-xs" style={{ color: '#A8B5A0' }}>Size: {item.selected_size}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        {/* Qty */}
                        <div className="flex items-center gap-1 rounded-full" style={{ border: '1px solid #E9DCCB' }}>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selected_color, item.selected_size)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selected_color, item.selected_size)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        {/* Price */}
                        <span className="text-sm font-semibold" style={{ color: '#493B35' }}>
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.product.id, item.selected_color, item.selected_size)}
                      className="p-1.5 rounded-full hover:bg-red-50 transition-colors self-start"
                      style={{ color: '#E57373' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t space-y-3" style={{ borderColor: '#E9DCCB', backgroundColor: 'white' }}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#6B5247' }}>Subtotal</span>
                <span style={{ color: '#493B35', fontWeight: 500 }}>{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B5247' }}>Shipping</span>
                <span style={{ color: shipping === 0 ? '#A8B5A0' : '#493B35', fontWeight: 500 }}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs" style={{ color: '#A8B5A0' }}>
                  Free shipping on orders above {formatPrice(siteConfig.free_shipping_above)}
                </p>
              )}
              <div className="flex justify-between font-semibold text-base pt-2 border-t" style={{ borderColor: '#E9DCCB', color: '#493B35' }}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/cart"
                onClick={closeCart}
                className="flex-1 py-3 text-center text-sm font-medium rounded-full border transition-all hover:-translate-y-0.5"
                style={{ borderColor: '#493B35', color: '#493B35' }}
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="flex-1 py-3 text-center text-sm font-medium rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: '#493B35', color: 'white' }}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
