interface SectionTitleProps {
  title: string
  subtitle?: string
  centered?: boolean
  scriptText?: string
}

export default function SectionTitle({ title, subtitle, centered = false, scriptText }: SectionTitleProps) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      {scriptText && (
        <p className="mb-1 text-base" style={{ fontFamily: 'Dancing Script, cursive', color: '#A8B5A0' }}>
          {scriptText}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-base max-w-xl" style={{ color: '#6B5247', ...(centered ? { margin: '0 auto' } : {}) }}>
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-0.5 w-16 rounded-full ${centered ? 'mx-auto' : ''}`} style={{ backgroundColor: '#F5DDE3' }} />
    </div>
  )
}
