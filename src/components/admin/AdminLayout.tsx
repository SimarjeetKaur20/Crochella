import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package, exact: false },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
]

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/orders': 'Orders',
  '/admin/settings': 'Settings',
}

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/admin/products/edit/')) return 'Edit Product'
  return 'Admin'
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('crochella-admin-auth')
    navigate('/')
  }

  const pageTitle = getPageTitle(location.pathname)

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#FFF9F2' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col w-60 transition-transform duration-300
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ background: '#2D211C', minWidth: 240 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white border-opacity-10">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#F5DDE3', opacity: 0.7 }}>
              Crochella
            </p>
            <p className="text-sm font-semibold text-white mt-0.5">Admin Panel</p>
          </div>
          <button
            className="lg:hidden text-white opacity-60 hover:opacity-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#493B35]'
                    : 'text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: '#F5DDE3', color: '#493B35' } : {}
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white border-opacity-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header
          className="flex items-center justify-between px-4 lg:px-8 py-4 border-b"
          style={{ background: '#FFF9F2', borderColor: '#E9DCCB' }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-md hover:bg-[#E9DCCB] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} style={{ color: '#493B35' }} />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: '#2D211C' }}>
              {pageTitle}
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium" style={{ color: '#493B35' }}>
              {formattedDate}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#A8B5A0' }}>
              {formattedTime}
            </p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
