import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import { CATEGORY_LABELS } from '../../types'
import type { ProductCategory } from '../../types'

type SortKey = 'name' | 'price' | 'stock_quantity' | 'created_at'
type SortDir = 'asc' | 'desc'

const ALL = '__all__'

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey
  sortKey: SortKey
  sortDir: SortDir
}) {
  if (sortKey !== col) return <ChevronsUpDown size={14} className="opacity-40" />
  return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
}

export default function AdminProducts() {
  const navigate = useNavigate()
  const { products, updateProduct, deleteProduct } = useProductStore()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | typeof ALL>(ALL)
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteMode, setDeleteMode] = useState<'single' | 'batch'>('single')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === ALL || p.category === categoryFilter
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      let va: string | number = a[sortKey] as string | number
      let vb: string | number = b[sortKey] as string | number
      if (sortKey === 'created_at') {
        va = new Date(va as string).getTime()
        vb = new Date(vb as string).getTime()
      }
      if (typeof va === 'string' && typeof vb === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      }
      return sortDir === 'asc'
        ? (va as number) - (vb as number)
        : (vb as number) - (va as number)
    })

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(p => p.id)))
    }
  }

  const handleDeleteSingle = (id: string) => {
    setDeleteMode('single')
    setDeleteTargetId(id)
  }

  const handleDeleteBatch = () => {
    setDeleteMode('batch')
    setDeleteTargetId(null)
  }

  const confirmDelete = useCallback(() => {
    if (deleteMode === 'single' && deleteTargetId) {
      deleteProduct(deleteTargetId)
    } else if (deleteMode === 'batch') {
      selected.forEach(id => deleteProduct(id))
      setSelected(new Set())
    }
    setDeleteTargetId(null)
  }, [deleteMode, deleteTargetId, selected, deleteProduct])

  const thClass =
    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#2D211C' }}>
            Products
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#A8B5A0' }}>
            {products.length} products total
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: '#493B35', color: '#FFF9F2' }}
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap gap-3 p-4 rounded-xl"
        style={{ background: '#fff', border: '1px solid #E9DCCB' }}
      >
        <div className="relative flex-1 min-w-48">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#A8B5A0' }}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none border"
            style={{
              background: '#FFF9F2',
              borderColor: '#E9DCCB',
              color: '#2D211C',
            }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as ProductCategory | typeof ALL)}
          className="px-3 py-2 rounded-lg text-sm outline-none border"
          style={{
            background: '#FFF9F2',
            borderColor: '#E9DCCB',
            color: '#2D211C',
          }}
        >
          <option value={ALL}>All Categories</option>
          {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map(cat => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>

        {selected.size > 0 && (
          <button
            onClick={handleDeleteBatch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            Delete Selected ({selected.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid #E9DCCB' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: '#FFF9F2' }}>
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                    style={{ accentColor: '#493B35' }}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-12" style={{ color: '#A8B5A0' }}>
                  Image
                </th>
                <th
                  className={thClass}
                  style={{ color: '#A8B5A0' }}
                  onClick={() => handleSort('name')}
                >
                  <span className="inline-flex items-center gap-1">
                    Name <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A8B5A0' }}>
                  Category
                </th>
                <th
                  className={thClass}
                  style={{ color: '#A8B5A0' }}
                  onClick={() => handleSort('price')}
                >
                  <span className="inline-flex items-center gap-1">
                    Price <SortIcon col="price" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th
                  className={thClass}
                  style={{ color: '#A8B5A0' }}
                  onClick={() => handleSort('stock_quantity')}
                >
                  <span className="inline-flex items-center gap-1">
                    Stock <SortIcon col="stock_quantity" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A8B5A0' }}>
                  Available
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A8B5A0' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-sm"
                    style={{ color: '#A8B5A0' }}
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map(product => (
                  <tr
                    key={product.id}
                    className="border-t hover:bg-[#FFF9F2] transition-colors"
                    style={{ borderColor: '#E9DCCB' }}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        style={{ accentColor: '#493B35' }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          style={{ border: '1px solid #E9DCCB' }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xs"
                          style={{ background: '#F5DDE3', color: '#A8B5A0' }}
                        >
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: '#2D211C' }}>
                      {product.name}
                      {product.is_featured && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: '#F5DDE3', color: '#493B35' }}>
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#A8B5A0' }}>
                      {CATEGORY_LABELS[product.category]}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: '#2D211C' }}>
                      ₹{product.price.toLocaleString('en-IN')}
                      {product.discounted_price && (
                        <span className="block text-xs font-normal line-through" style={{ color: '#A8B5A0' }}>
                          ₹{product.discounted_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: product.stock_quantity === 0
                            ? '#fecaca'
                            : product.stock_quantity < 3
                            ? '#fef08a'
                            : '#bbf7d0',
                          color: product.stock_quantity === 0
                            ? '#7f1d1d'
                            : product.stock_quantity < 3
                            ? '#713f12'
                            : '#14532d',
                        }}
                      >
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          updateProduct(product.id, { is_available: !product.is_available })
                        }
                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                        style={{
                          background: product.is_available ? '#A8B5A0' : '#E9DCCB',
                        }}
                      >
                        <span
                          className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                          style={{
                            transform: product.is_available ? 'translateX(18px)' : 'translateX(2px)',
                          }}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="p-1.5 rounded-lg hover:bg-[#E9DCCB] transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} style={{ color: '#493B35' }} />
                        </button>
                        <button
                          onClick={() => handleDeleteSingle(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      {(deleteTargetId || deleteMode === 'batch') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
          <div
            className="rounded-2xl p-6 w-full max-w-sm shadow-xl"
            style={{ background: '#fff', border: '1px solid #E9DCCB' }}
          >
            <h3 className="font-semibold text-base" style={{ color: '#2D211C' }}>
              Delete {deleteMode === 'batch' ? `${selected.size} products` : 'product'}?
            </h3>
            <p className="text-sm mt-2" style={{ color: '#A8B5A0' }}>
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setDeleteTargetId(null); setDeleteMode('single') }}
                className="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[#FFF9F2]"
                style={{ borderColor: '#E9DCCB', color: '#493B35' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
