import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useProductStore } from '../store/productStore'
import { formatPrice, calculateShipping } from '../utils/helpers'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const siteConfig = useProductStore((s) => s.siteConfig)
  const navigate = useNavigate()

  const sub = subtotal()
  const freeAbove = Number(siteConfig?.free_shipping_above ?? 1500)
  const flatFee = Number(siteConfig?.shipping_fee ?? 80)
  const shipping = calculateShipping(sub, freeAbove, flatFee)
  const total = sub + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center gap-5 px-4 py-20">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#F5DDE3' }}
        >
          <ShoppingBag size={40} style={{ color: '#493B35' }} />
        </div>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
        >
          Your cart is empty
        </h2>
        <p className="text-sm" style={{ color: '#A8B5A0' }}>
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 rounded-full text-sm font-medium text-white transition"
          style={{ backgroundColor: '#A8B5A0' }}
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      {/* Hero */}
      <div
        className="py-10 text-center"
        style={{ background: 'linear-gradient(135deg, #F5DDE3 0%, #FFF9F2 100%)' }}
      >
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
        >
          Your Cart
        </h1>
        <p className="text-sm mt-1" style={{ color: '#A8B5A0' }}>
          {items.reduce((s, i) => s + i.quantity, 0)} item
          {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* ── Cart items ──────────────────────────────────────────────── */}
          <div className="space-y-4">
            {items.map((item) => {
              const price = item.product.discounted_price ?? item.product.price
              const itemTotal = price * item.quantity

              return (
                <div
                  key={`${item.product.id}|${item.selected_color}|${item.selected_size}`}
                  className="bg-white rounded-2xl border p-4 flex gap-4 items-start"
                  style={{ borderColor: '#E9DCCB' }}
                >
                  {/* Image */}
                  <Link to={`/shop/${item.product.slug}`} className="shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F5DDE3]">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🧶</div>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/shop/${item.product.slug}`}>
                      <h3
                        className="font-semibold text-sm leading-snug hover:underline"
                        style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
                      >
                        {item.product.name}
                      </h3>
                    </Link>

                    {/* Variants */}
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {item.selected_color && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#F5DDE3', color: '#493B35' }}
                        >
                          {item.selected_color}
                        </span>
                      )}
                      {item.selected_size && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#E9DCCB', color: '#493B35' }}
                        >
                          {item.selected_size}
                        </span>
                      )}
                    </div>

                    {item.customization_note && (
                      <p className="text-xs mt-1 italic" style={{ color: '#A8B5A0' }}>
                        Note: {item.customization_note}
                      </p>
                    )}

                    {/* Quantity controls + price row */}
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      <div
                        className="flex items-center rounded-full border overflow-hidden"
                        style={{ borderColor: '#E9DCCB' }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selected_color,
                              item.selected_size
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[#F5DDE3] transition"
                          style={{ color: '#493B35' }}
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span
                          className="w-8 text-center text-sm font-semibold"
                          style={{ color: '#493B35' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selected_color,
                              item.selected_size
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[#F5DDE3] transition"
                          style={{ color: '#493B35' }}
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="font-bold text-sm" style={{ color: '#493B35' }}>
                            {formatPrice(itemTotal)}
                          </span>
                          {item.quantity > 1 && (
                            <p className="text-xs" style={{ color: '#A8B5A0' }}>
                              {formatPrice(price)} each
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.selected_color, item.selected_size)
                          }
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 transition"
                          style={{ color: '#A8B5A0' }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium transition hover:underline mt-2"
              style={{ color: '#A8B5A0' }}
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* ── Order summary ─────────────────────────────────────────────── */}
          <div
            className="bg-white rounded-2xl border p-6 sticky top-24"
            style={{ borderColor: '#E9DCCB' }}
          >
            <h2
              className="text-lg font-semibold mb-5"
              style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
            >
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between" style={{ color: '#493B35' }}>
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between" style={{ color: '#493B35' }}>
                <span>Shipping</span>
                <span className={shipping === 0 ? 'font-medium' : 'font-medium'} style={{ color: shipping === 0 ? '#A8B5A0' : '#493B35' }}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs" style={{ color: '#A8B5A0' }}>
                  Add {formatPrice(freeAbove - sub)} more for free shipping
                </p>
              )}
            </div>

            <div
              className="flex justify-between mt-4 pt-4 font-bold text-base"
              style={{ borderTop: '1px solid #E9DCCB', color: '#493B35' }}
            >
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white text-sm transition hover:opacity-90"
              style={{ backgroundColor: '#493B35' }}
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs" style={{ color: '#A8B5A0' }}>
                Secure checkout · Handmade with ❤️ in India
              </p>
            </div>

            {/* Shipping note */}
            <div
              className="mt-4 p-3 rounded-xl text-xs"
              style={{ backgroundColor: '#F5DDE3', color: '#493B35' }}
            >
              🚚 Free shipping on orders above {formatPrice(freeAbove)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
