import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useProductStore } from '../store/productStore'
import ProductCard from '../components/product/ProductCard'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const products = useProductStore((s) => s.products)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        p.is_available &&
        (p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q))
    )
  }, [products, query])

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      {/* Hero */}
      <div
        className="py-12 text-center"
        style={{ background: 'linear-gradient(135deg, #F5DDE3 0%, #FFF9F2 100%)' }}
      >
        <p className="text-sm uppercase tracking-widest mb-1" style={{ color: '#A8B5A0' }}>
          Search Results
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
        >
          {query ? `"${query}"` : 'All Products'}
        </h1>
        {query && (
          <p className="text-sm mt-2" style={{ color: '#A8B5A0' }}>
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {!query ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-4" style={{ color: '#E9DCCB' }} />
            <p style={{ color: '#A8B5A0' }}>Type something in the search bar above.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🔍</span>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
            >
              No results for "{query}"
            </h3>
            <p className="text-sm mb-6" style={{ color: '#A8B5A0' }}>
              Try different keywords or browse our full collection.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition inline-block"
              style={{ backgroundColor: '#A8B5A0' }}
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
