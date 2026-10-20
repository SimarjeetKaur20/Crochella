import { type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none'
  
  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
  }

  const variants = {
    primary: 'text-white hover:-translate-y-0.5 hover:shadow-lg',
    outline: 'border-current border-1.5 hover:-translate-y-0.5',
    ghost: 'hover:bg-black/5',
  }

  const styles = {
    primary: { backgroundColor: '#493B35', color: 'white' },
    outline: { backgroundColor: 'transparent', color: '#493B35', border: '1.5px solid #493B35' },
    ghost: { backgroundColor: 'transparent', color: '#493B35' },
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={styles[variant]}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}
