import { useEffect, useState } from 'react'
import { Search, ChevronDown, ChevronUp, RefreshCw, Package } from 'lucide-react'
import { useOrderStore } from '../../store/orderStore'
import { FULFILLMENT_STATUS_LABELS, type FulfillmentStatus, type Order } from '../../types'
import { formatPrice } from '../../utils/helpers'

const STATUS_COLORS: Record<FulfillmentStatus, string> = {
  'order-received': 'bg-amber-100 text-amber-700',
  'confirmed':       'bg-blue-100 text-blue-700',
  'preparing':       'bg-purple-100 text-purple-700',
  'shipped':         'bg-sky-100 text-sky-700',
  'delivered':       'bg-green-100 text-green-700',
  'cancelled':       'bg-red-100 text-red-700',
}

const PAYMENT_COLORS: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700',
  paid:     'bg-green-100 text-green-700',
  failed:   'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminOrders() {
  const { orders, isLoading, fetchOrders, updateOrderStatus } = useOrderStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search.trim() ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.mobile.includes(search)

    const matchStatus = statusFilter === 'all' || o.fulfillmentStatus === statusFilter

    return matchSearch && matchStatus
  })

  async function handleStatusChange(orderId: string, status: FulfillmentStatus) {
    setUpdating(orderId)
    try {
      await updateOrderStatus(orderId, status)
    } finally {
      setUpdating(null)
    }
  }

  // Summary counts
  const counts = orders.reduce((acc, o) => {
    acc[o.fulfillmentStatus] = (acc[o.fulfillmentStatus] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
          >
            Orders
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#A8B5A0' }}>
            {orders.length} total orders
          </p>
        </div>
        <button
          onClick={() => fetchOrders()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition hover:bg-[#F5DDE3]"
          style={{ borderColor: '#E9DCCB', color: '#493B35' }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
            statusFilter === 'all' ? 'text-white' : 'bg-white border border-[#E9DCCB] text-[#493B35] hover:bg-[#F5DDE3]'
          }`}
          style={statusFilter === 'all' ? { backgroundColor: '#493B35' } : {}}
        >
          All ({orders.length})
        </button>
        {(Object.entries(FULFILLMENT_STATUS_LABELS) as [FulfillmentStatus, string][]).map(
          ([slug, label]) => (
            <button
              key={slug}
              onClick={() => setStatusFilter(statusFilter === slug ? 'all' : slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                statusFilter === slug ? 'text-white' : 'bg-white border border-[#E9DCCB] text-[#493B35] hover:bg-[#F5DDE3]'
              }`}
              style={statusFilter === slug ? { backgroundColor: '#493B35' } : {}}
            >
              {label} ({counts[slug] ?? 0})
            </button>
          )
        )}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: '#A8B5A0' }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, or phone…"
          className="w-full pl-9 pr-4 py-2.5 rounded-full border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]"
          style={{ borderColor: '#E9DCCB', color: '#493B35' }}
        />
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse border border-[#E9DCCB]">
              <div className="h-4 bg-[#E9DCCB] rounded w-1/4 mb-2" />
              <div className="h-3 bg-[#F5DDE3] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package size={40} className="mx-auto mb-3" style={{ color: '#E9DCCB' }} />
          <p className="font-semibold" style={{ color: '#493B35' }}>No orders found</p>
          <p className="text-sm mt-1" style={{ color: '#A8B5A0' }}>
            {search ? 'Try a different search term.' : 'Orders will appear here once customers start ordering.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              isExpanded={expandedId === order.id}
              onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
              onStatusChange={handleStatusChange}
              isUpdating={updating === order.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Individual order row ─────────────────────────────────────────────────────

interface OrderRowProps {
  order: Order
  isExpanded: boolean
  onToggle: () => void
  onStatusChange: (id: string, status: FulfillmentStatus) => Promise<void>
  isUpdating: boolean
}

function OrderRow({ order, isExpanded, onToggle, onStatusChange, isUpdating }: OrderRowProps) {
  const addr = order.deliveryAddress
  const addressStr = [addr.street, addr.city, addr.state, addr.pinCode].filter(Boolean).join(', ')

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-sm"
      style={{ borderColor: '#E9DCCB' }}
    >
      {/* ── Row summary (always visible) ────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-4 p-4 cursor-pointer"
        onClick={onToggle}
        role="button"
        aria-expanded={isExpanded}
      >
        {/* Order number + date */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: '#493B35' }}>
            #{order.orderNumber}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#A8B5A0' }}>
            {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Customer */}
        <div className="min-w-[140px]">
          <p className="text-sm font-medium" style={{ color: '#493B35' }}>
            {order.customerName}
          </p>
          <p className="text-xs" style={{ color: '#A8B5A0' }}>
            {order.mobile}
          </p>
        </div>

        {/* Total */}
        <div className="text-sm font-bold" style={{ color: '#493B35' }}>
          {formatPrice(order.total)}
        </div>

        {/* Payment status */}
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${PAYMENT_COLORS[order.paymentStatus] ?? 'bg-gray-100 text-gray-700'}`}
        >
          {order.paymentMethod === 'cod' ? 'COD' : '💳'} {order.paymentStatus}
        </span>

        {/* Fulfillment status */}
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.fulfillmentStatus] ?? 'bg-gray-100 text-gray-700'}`}
        >
          {FULFILLMENT_STATUS_LABELS[order.fulfillmentStatus]}
        </span>

        {/* Toggle icon */}
        <div style={{ color: '#A8B5A0' }}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* ── Expanded details ─────────────────────────────────────────────── */}
      {isExpanded && (
        <div
          className="px-4 pb-5 pt-2 space-y-4"
          style={{ borderTop: '1px solid #F5DDE3' }}
        >
          {/* Customer details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1.5" style={{ color: '#A8B5A0' }}>
                Customer
              </p>
              <p className="text-sm" style={{ color: '#493B35' }}>{order.customerName}</p>
              <p className="text-sm" style={{ color: '#493B35' }}>{order.mobile}</p>
              {order.email && <p className="text-sm" style={{ color: '#493B35' }}>{order.email}</p>}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1.5" style={{ color: '#A8B5A0' }}>
                Delivery Address
              </p>
              <p className="text-sm" style={{ color: '#493B35' }}>{addressStr}</p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A8B5A0' }}>
                Customer Notes
              </p>
              <p
                className="text-sm px-3 py-2 rounded-xl"
                style={{ backgroundColor: '#FFF9F2', color: '#493B35', border: '1px solid #E9DCCB' }}
              >
                {order.notes}
              </p>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#A8B5A0' }}>
              Items Ordered
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: '#FFF9F2', border: '1px solid #E9DCCB' }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover object-center shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#493B35' }}>
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ color: '#A8B5A0' }}>
                      Qty: {item.quantity}
                      {item.selectedColor && ` · ${item.selectedColor}`}
                      {item.selectedSize && ` · ${item.selectedSize}`}
                    </p>
                    {item.customizationNote && (
                      <p className="text-xs italic" style={{ color: '#A8B5A0' }}>
                        {item.customizationNote}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold shrink-0" style={{ color: '#493B35' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals summary */}
            <div className="mt-3 pt-3 space-y-1 text-sm" style={{ borderTop: '1px solid #E9DCCB' }}>
              <div className="flex justify-between" style={{ color: '#493B35' }}>
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between" style={{ color: '#493B35' }}>
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
              </div>
              <div
                className="flex justify-between font-bold pt-1"
                style={{ borderTop: '1px solid #E9DCCB', color: '#493B35' }}
              >
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status update */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#A8B5A0' }}>
              Update Order Status
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(FULFILLMENT_STATUS_LABELS) as [FulfillmentStatus, string][]).map(
                ([slug, label]) => (
                  <button
                    key={slug}
                    disabled={order.fulfillmentStatus === slug || isUpdating}
                    onClick={() => onStatusChange(order.id, slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition disabled:opacity-60 disabled:cursor-default ${
                      order.fulfillmentStatus === slug
                        ? STATUS_COLORS[slug]
                        : 'bg-white border border-[#E9DCCB] text-[#493B35] hover:bg-[#F5DDE3]'
                    }`}
                  >
                    {isUpdating && order.fulfillmentStatus !== slug ? '' : ''}
                    {label}
                    {order.fulfillmentStatus === slug && ' ✓'}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Razorpay info */}
          {order.razorpayPaymentId && (
            <p className="text-xs" style={{ color: '#A8B5A0' }}>
              Razorpay TxnID: {order.razorpayPaymentId}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
