import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span style={{ color: '#C5B5AF' }}>/</span>
          )}
          {item.href && index < items.length - 1 ? (
            <Link
              to={item.href}
              className="transition-colors hover:underline"
              style={{ color: '#A8B5A0' }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: index === items.length - 1 ? '#493B35' : '#A8B5A0', fontWeight: index === items.length - 1 ? 500 : 400 }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
