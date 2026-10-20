import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Plus,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import { useOrderStore } from '../../store/orderStore'
import { CATEGORY_LABELS } from '../../types'
import type { FulfillmentStatus } from '../../types'

const STATUS_COLORS: Record<FulfillmentStatus, { bg: string; text: string }> = {
  'order-received': { bg: '#E9DCCB', text: '#493B35' },
  confirmed: { bg: '#A8B5A0', text: '#2D211C' },
  preparing: { bg: '#fef08a', text: '#713f12' },
  shipped: { bg: '#bfdbfe', text: '#1e40af' },
  delivered: { bg: '#bbf7d0', text: '#14532d' },
  cancelled: { bg: '#fecaca', text: '#7f1d1d' },
}

const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = {
  'order-received': 'Order Received',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div
      className="rounded-2xl p-6 flex items-start gap-4"
      style={{ background: '#fff', border: '1px solid #E9DCCB' }}
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: color }}
      >
        <Icon size={22} style={{ color: '#2D211C' }} />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: '#A8B5A0' }}>
          {label}
        </p>
        <p className="text-2xl font-bold mt-0.5" style={{ color: '#2D211C' }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: '#A8B5A0' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { products } = useProductStore()
  const { orders, fetchOrders } = useOrderStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const totalProducts = products.length
  const totalOrders = orders.length

  const revenue = orders
    .filter(o => o.fulfillmentStatus === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  const pendingOrders = orders.filter(
    o => o.fulfillmentStatus === 'order-received' || o.fulfillmentStatus === 'confirmed'
  ).length

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const lowStockProducts = products.filter(p => p.stock_quantity < 3)

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={totalProducts}
          color="#F5DDE3"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          color="#E9DCCB"
        />
        <StatCard
          icon={TrendingUp}
          label="Revenue"
          value={`₹${revenue.toLocaleString('en-IN')}`}
          sub="From delivered orders"
          color="#A8B5A0"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={pendingOrders}
          sub="Awaiting action"
          color="#fef08a"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: '#493B35', color: '#FFF9F2' }}
        >
          <Plus size={16} />
          Add Product
        </Link>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-[#E9DCCB]"
          style={{ borderColor: '#E9DCCB', color: '#493B35' }}
        >
          View All Orders
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div
          className="xl:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: '#fff', border: '1px solid #E9DCCB' }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between border-b"
            style={{ borderColor: '#E9DCCB' }}
          >
            <h2 className="font-semibold text-sm" style={{ color: '#2D211C' }}>
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-medium hover:underline"
              style={{ color: '#A8B5A0' }}
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: '#A8B5A0' }}>
                No orders yet
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#FFF9F2' }}>
                    {['Order #', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: '#A8B5A0' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => {
                    const sc = STATUS_COLORS[order.fulfillmentStatus]
                    return (
                      <tr
                        key={order.id}
                        className="border-t hover:bg-[#FFF9F2] transition-colors"
                        style={{ borderColor: '#E9DCCB' }}
                      >
                        <td
                          className="px-5 py-3 font-medium"
                          style={{ color: '#2D211C' }}
                        >
                          #{order.orderNumber}
                        </td>
                        <td className="px-5 py-3" style={{ color: '#493B35' }}>
                          {order.customerName}
                        </td>
                        <td className="px-5 py-3 font-semibold" style={{ color: '#2D211C' }}>
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: sc?.bg ?? '#eee', color: sc?.text ?? '#333' }}
                          >
                            {FULFILLMENT_STATUS_LABELS[order.fulfillmentStatus]}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs" style={{ color: '#A8B5A0' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div
          className="rounded-2xl"
          style={{ background: '#fff', border: '1px solid #E9DCCB' }}
        >
          <div
            className="px-6 py-4 flex items-center gap-2 border-b"
            style={{ borderColor: '#E9DCCB' }}
          >
            <AlertTriangle size={16} style={{ color: '#ef4444' }} />
            <h2 className="font-semibold text-sm" style={{ color: '#2D211C' }}>
              Low Stock Alert
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: '#A8B5A0' }}>
                All products well-stocked 🎉
              </p>
            ) : (
              lowStockProducts.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl"
                  style={{ background: '#FFF9F2', border: '1px solid #E9DCCB' }}
                >
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: '#2D211C' }}
                    >
                      {p.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#A8B5A0' }}>
                      {CATEGORY_LABELS[p.category]}
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{
                      background: p.stock_quantity === 0 ? '#fecaca' : '#fef08a',
                      color: p.stock_quantity === 0 ? '#7f1d1d' : '#713f12',
                    }}
                  >
                    {p.stock_quantity === 0 ? 'Out' : `${p.stock_quantity} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
