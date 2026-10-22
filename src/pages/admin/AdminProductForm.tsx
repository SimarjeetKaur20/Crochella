import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Upload, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { CATEGORY_LABELS } from '../../types'
import type { Product, ProductCategory } from '../../types'

type FormData = Omit<Product, 'id' | 'created_at' | 'updated_at'>

const DEFAULT_FORM: FormData = {
  name: '',
  slug: '',
  description: '',
  category: 'crochet-bags',
  price: 0,
  discounted_price: undefined,
  images: [],
  colors: [],
  sizes: [],
  stock_quantity: 0,
  sku: '',
  preparation_time: '',
  customization_options: '',
  is_available: true,
  is_featured: false,
  is_bestseller: false,
  is_new: false,
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const val = input.trim()
    if (val && !values.includes(val)) {
      onChange([...values, val])
    }
    setInput('')
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
        {label}
      </label>
      <div
        className="flex flex-wrap gap-2 p-2.5 rounded-lg border min-h-[44px]"
        style={{ background: '#FFF9F2', borderColor: '#E9DCCB' }}
      >
        {values.map(v => (
          <span
            key={v}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: '#F5DDE3', color: '#493B35' }}
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter(x => x !== v))}
              className="hover:opacity-70"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag()
            }
          }}
          placeholder={placeholder || 'Type and press Enter'}
          className="flex-1 min-w-24 text-sm outline-none bg-transparent"
          style={{ color: '#2D211C' }}
        />
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
        style={{ background: checked ? '#A8B5A0' : '#E9DCCB' }}
      >
        <span
          className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
        />
      </button>
      <span className="text-sm font-medium" style={{ color: '#493B35' }}>
        {label}
      </span>
    </label>
  )
}

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { products, addProduct, updateProduct } = useProductStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = Boolean(id)
  const existingProduct = id ? products.find(p => p.id === id) : undefined

  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [slugManual, setSlugManual] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  useEffect(() => {
    if (existingProduct) {
      const { id: _id, created_at: _c, updated_at: _u, ...rest } = existingProduct
      setForm(rest)
      setSlugManual(true)
    }
  }, [existingProduct])

  useEffect(() => {
    if (!slugManual && form.name) {
      setForm(prev => ({ ...prev, slug: slugify(prev.name) }))
    }
  }, [form.name, slugManual])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.slug.trim()) e.slug = 'Slug is required'
    if (!form.price || form.price <= 0) e.price = 'Price must be greater than 0'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const remaining = 10 - form.images.length
    const toUpload = Array.from(files).slice(0, remaining)

    if (isSupabaseConfigured && supabase) {
      setUploading(true)
      try {
        const urls: string[] = []
        for (const file of toUpload) {
          const ext = file.name.split('.').pop()
          const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const { error } = await supabase.storage
            .from('product-images')
            .upload(path, file, { cacheControl: '3600', upsert: false })
          if (error) throw error
          const { data } = supabase.storage.from('product-images').getPublicUrl(path)
          urls.push(data.publicUrl)
        }
        set('images', [...form.images, ...urls])
      } catch (err) {
        setToast({ type: 'error', message: 'Image upload failed. Check Supabase storage bucket.' })
      } finally {
        setUploading(false)
      }
    } else {
      // Local object URLs — temporary
      const urls = toUpload.map(f => URL.createObjectURL(f))
      set('images', [...form.images, ...urls])
      setToast({
        type: 'error',
        message: '⚠️ Using temporary URLs — images will be lost on refresh. Set up Supabase for persistent storage.',
      })
    }
  }

  const removeImage = (index: number) => {
    const next = form.images.filter((_, i) => i !== index)
    set('images', next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (isEdit && id) {
      updateProduct(id, { ...form, updated_at: new Date().toISOString() })
    } else {
      addProduct({
        ...form,
      })
    }

    setToast({ type: 'success', message: `Product ${isEdit ? 'updated' : 'added'} successfully!` })
    setTimeout(() => navigate('/admin/products'), 1200)
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg text-sm outline-none border transition-all'
  const inputStyle = (hasError?: string) => ({
    background: '#FFF9F2',
    borderColor: hasError ? '#ef4444' : '#E9DCCB',
    color: '#2D211C',
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium"
          style={{
            background: toast.type === 'success' ? '#bbf7d0' : '#fecaca',
            color: toast.type === 'success' ? '#14532d' : '#7f1d1d',
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-lg hover:bg-[#E9DCCB] transition-colors"
        >
          <ArrowLeft size={18} style={{ color: '#493B35' }} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: '#2D211C' }}>
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section
          className="rounded-2xl p-6 space-y-5"
          style={{ background: '#fff', border: '1px solid #E9DCCB' }}
        >
          <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#A8B5A0' }}>
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Handcrafted Boho Bag"
                className={inputClass}
                style={inputStyle(errors.name)}
              />
              {errors.name && <p className="text-xs mt-1 text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={e => { setSlugManual(true); set('slug', e.target.value) }}
                placeholder="handcrafted-boho-bag"
                className={inputClass}
                style={inputStyle(errors.slug)}
              />
              {errors.slug && <p className="text-xs mt-1 text-red-500">{errors.slug}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
              Category
            </label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value as ProductCategory)}
              className={inputClass}
              style={inputStyle()}
            >
              {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe your product…"
              rows={4}
              className={inputClass}
              style={inputStyle()}
            />
          </div>
        </section>

        {/* Pricing */}
        <section
          className="rounded-2xl p-6 space-y-5"
          style={{ background: '#fff', border: '1px solid #E9DCCB' }}
        >
          <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#A8B5A0' }}>
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.price || ''}
                onChange={e => set('price', Number(e.target.value))}
                placeholder="0"
                min={0}
                className={inputClass}
                style={inputStyle(errors.price)}
              />
              {errors.price && <p className="text-xs mt-1 text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
                Discounted Price (₹)
              </label>
              <input
                type="number"
                value={form.discounted_price || ''}
                onChange={e =>
                  set('discounted_price', e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="Optional"
                min={0}
                className={inputClass}
                style={inputStyle()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
                Stock Quantity
              </label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={e => set('stock_quantity', Number(e.target.value))}
                placeholder="0"
                min={0}
                className={inputClass}
                style={inputStyle()}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
                SKU
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={e => set('sku', e.target.value)}
                placeholder="e.g. CRC-BAG-001"
                className={inputClass}
                style={inputStyle()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
                Preparation Time
              </label>
              <input
                type="text"
                value={form.preparation_time}
                onChange={e => set('preparation_time', e.target.value)}
                placeholder="e.g. 3-5 days"
                className={inputClass}
                style={inputStyle()}
              />
            </div>
          </div>
        </section>

        {/* Variants */}
        <section
          className="rounded-2xl p-6 space-y-5"
          style={{ background: '#fff', border: '1px solid #E9DCCB' }}
        >
          <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#A8B5A0' }}>
            Variants & Options
          </h2>

          <TagInput
            label="Colors"
            values={form.colors}
            onChange={v => set('colors', v)}
            placeholder="Type a color, press Enter"
          />

          <TagInput
            label="Sizes"
            values={form.sizes}
            onChange={v => set('sizes', v)}
            placeholder="Type a size, press Enter"
          />

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#493B35' }}>
              Customization Options
            </label>
            <textarea
              value={form.customization_options}
              onChange={e => set('customization_options', e.target.value)}
              placeholder="Describe available customizations…"
              rows={3}
              className={inputClass}
              style={inputStyle()}
            />
          </div>
        </section>

        {/* Images */}
        <section
          className="rounded-2xl p-6 space-y-4"
          style={{ background: '#fff', border: '1px solid #E9DCCB' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#A8B5A0' }}>
              Product Images
            </h2>
            <span className="text-xs" style={{ color: '#A8B5A0' }}>
              {form.images.length}/10
            </span>
          </div>

          {!isSupabaseConfigured && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg text-xs"
              style={{ background: '#fef08a', color: '#713f12' }}
            >
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              Supabase not configured — images will use temporary URLs that won't persist after refresh.
              Set up Supabase Storage for persistent image hosting.
            </div>
          )}

          {/* Image previews */}
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`Product ${i + 1}`}
                    className="w-20 h-20 rounded-xl object-cover object-center"
                    style={{ border: '1px solid #E9DCCB' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {form.images.length < 10 && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={e => handleImageUpload(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-3 w-full px-4 py-6 rounded-xl border-2 border-dashed text-sm font-medium transition-colors hover:bg-[#FFF9F2] disabled:opacity-60"
                style={{ borderColor: '#E9DCCB', color: '#A8B5A0' }}
              >
                <Upload size={18} />
                {uploading ? 'Uploading…' : 'Click to upload images (up to 10)'}
              </button>
            </>
          )}
        </section>

        {/* Flags */}
        <section
          className="rounded-2xl p-6 space-y-4"
          style={{ background: '#fff', border: '1px solid #E9DCCB' }}
        >
          <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#A8B5A0' }}>
            Visibility & Badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Toggle label="Available" checked={form.is_available} onChange={v => set('is_available', v)} />
            <Toggle label="Featured" checked={form.is_featured} onChange={v => set('is_featured', v)} />
            <Toggle label="Bestseller" checked={form.is_bestseller} onChange={v => set('is_bestseller', v)} />
            <Toggle label="New" checked={form.is_new} onChange={v => set('is_new', v)} />
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-6">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#493B35', color: '#FFF9F2' }}
          >
            {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-[#E9DCCB]"
            style={{ borderColor: '#E9DCCB', color: '#493B35' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
