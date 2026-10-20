import { useState, useEffect } from 'react'
import { Save, Eye, EyeOff } from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const siteConfig = useProductStore((s) => s.siteConfig)
  const updateConfig = useProductStore((s) => s.updateConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [showWhatsapp, setShowWhatsapp] = useState(false)

  const [form, setForm] = useState({
    announcement_text:   '',
    whatsapp_number:     '',
    instagram_url:       '',
    email:               '',
    shipping_fee:        '',
    free_shipping_above: '',
    cod_enabled:         true,
    razorpay_enabled:    false,
  })

  // Pre-fill from store
  useEffect(() => {
    if (siteConfig) {
      setForm({
        announcement_text:   siteConfig.announcement_text ?? 'Handmade with Love | Every Stitch Tells a Story ✨',
        whatsapp_number:     siteConfig.whatsapp_number ?? '',
        instagram_url:       siteConfig.instagram_url ?? '',
        email:               siteConfig.email ?? '',
        shipping_fee:        String(siteConfig.shipping_fee ?? '80'),
        free_shipping_above: String(siteConfig.free_shipping_above ?? '1500'),
        cod_enabled:         Boolean(siteConfig.cod_enabled ?? true),
        razorpay_enabled:    Boolean(siteConfig.razorpay_enabled ?? false),
      })
    }
  }, [siteConfig])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateConfig({
        announcement_text:   form.announcement_text,
        whatsapp_number:     form.whatsapp_number,
        instagram_url:       form.instagram_url,
        email:               form.email,
        shipping_fee:        Number(form.shipping_fee) || 80,
        free_shipping_above: Number(form.free_shipping_above) || 1500,
        cod_enabled:         form.cod_enabled,
        razorpay_enabled:    form.razorpay_enabled,
      })
      toast.success('Settings saved successfully!')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'Playfair Display, serif', color: '#493B35' }}
        >
          Store Settings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#A8B5A0' }}>
          Configure your storefront, payment options, and contact details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Announcement bar ───────────────────────────────────────────── */}
        <Section title="Announcement Bar">
          <FieldWrapper label="Announcement Text">
            <input
              type="text"
              name="announcement_text"
              value={form.announcement_text}
              onChange={handleChange}
              placeholder="Handmade with Love | Every Stitch Tells a Story ✨"
              className={inputClass}
            />
          </FieldWrapper>
          <p className="text-xs mt-1.5" style={{ color: '#A8B5A0' }}>
            Shown in the top bar across the site.
          </p>
        </Section>

        {/* ── Contact details ────────────────────────────────────────────── */}
        <Section title="Contact Details">
          <FieldWrapper label="WhatsApp Number">
            <div className="relative">
              <input
                type={showWhatsapp ? 'text' : 'password'}
                name="whatsapp_number"
                value={form.whatsapp_number}
                onChange={handleChange}
                placeholder="919876543210 (with country code, no +)"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowWhatsapp((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#A8B5A0' }}
              >
                {showWhatsapp ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-xs mt-1" style={{ color: '#A8B5A0' }}>
              Include country code, e.g. 919876543210 for India.
            </p>
          </FieldWrapper>

          <FieldWrapper label="Instagram URL">
            <input
              type="url"
              name="instagram_url"
              value={form.instagram_url}
              onChange={handleChange}
              placeholder="https://instagram.com/crochella"
              className={inputClass}
            />
          </FieldWrapper>

          <FieldWrapper label="Contact Email">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="hello@crochella.in"
              className={inputClass}
            />
          </FieldWrapper>
        </Section>

        {/* ── Shipping ───────────────────────────────────────────────────── */}
        <Section title="Shipping">
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Flat Shipping Fee (₹)">
              <input
                type="number"
                name="shipping_fee"
                value={form.shipping_fee}
                onChange={handleChange}
                min="0"
                placeholder="80"
                className={inputClass}
              />
            </FieldWrapper>
            <FieldWrapper label="Free Shipping Above (₹)">
              <input
                type="number"
                name="free_shipping_above"
                value={form.free_shipping_above}
                onChange={handleChange}
                min="0"
                placeholder="1500"
                className={inputClass}
              />
            </FieldWrapper>
          </div>
          <p className="text-xs mt-1" style={{ color: '#A8B5A0' }}>
            Orders above the free shipping threshold won't be charged shipping.
          </p>
        </Section>

        {/* ── Payment methods ────────────────────────────────────────────── */}
        <Section title="Payment Methods">
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="cod_enabled"
                checked={form.cod_enabled}
                onChange={handleChange}
                className="mt-0.5 accent-[#493B35] w-4 h-4"
              />
              <div>
                <span className="text-sm font-medium" style={{ color: '#493B35' }}>
                  Cash on Delivery
                </span>
                <p className="text-xs mt-0.5" style={{ color: '#A8B5A0' }}>
                  Customers pay when they receive the order.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="razorpay_enabled"
                checked={form.razorpay_enabled}
                onChange={handleChange}
                className="mt-0.5 accent-[#493B35] w-4 h-4"
              />
              <div>
                <span className="text-sm font-medium" style={{ color: '#493B35' }}>
                  Razorpay Online Payment
                </span>
                <p className="text-xs mt-0.5" style={{ color: '#A8B5A0' }}>
                  Requires <code className="text-xs bg-[#F5DDE3] px-1 rounded">VITE_RAZORPAY_KEY_ID</code> in
                  your environment variables.
                </p>
              </div>
            </label>
          </div>

          {form.razorpay_enabled && !import.meta.env.VITE_RAZORPAY_KEY_ID && (
            <div
              className="mt-3 p-3 rounded-xl text-xs"
              style={{ backgroundColor: '#FFF3CD', color: '#856404', border: '1px solid #FFE69C' }}
            >
              ⚠️ Razorpay is enabled but <strong>VITE_RAZORPAY_KEY_ID</strong> is not set.
              Add it to your <code>.env</code> file and restart the dev server.
            </div>
          )}
        </Section>

        {/* ── Environment info ───────────────────────────────────────────── */}
        <Section title="Environment">
          <div
            className="p-4 rounded-xl text-sm space-y-1.5"
            style={{ backgroundColor: '#FFF9F2', border: '1px solid #E9DCCB' }}
          >
            <Row label="Supabase" value={import.meta.env.VITE_SUPABASE_URL ? '✅ Connected' : '❌ Not configured'} />
            <Row
              label="Razorpay Key"
              value={import.meta.env.VITE_RAZORPAY_KEY_ID ? '✅ Set' : '❌ Not set'}
            />
            <Row
              label="Admin Password"
              value={import.meta.env.VITE_ADMIN_PASSWORD ? '🔒 Custom' : '⚠️ Default (crochella2024)'}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: '#A8B5A0' }}>
            These are read from environment variables at build time. Update your <code>.env</code> file to change them.
          </p>
        </Section>

        {/* Save button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition disabled:opacity-60"
            style={{ backgroundColor: '#493B35' }}
          >
            <Save size={15} />
            {isSaving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-2xl border p-5 space-y-4"
      style={{ borderColor: '#E9DCCB' }}
    >
      <h2 className="text-base font-semibold" style={{ color: '#493B35' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function FieldWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5" style={{ color: '#493B35' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: '#7A6B63' }}>{label}</span>
      <span className="font-medium" style={{ color: '#493B35' }}>{value}</span>
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] transition'
  + ' border-[#E9DCCB] text-[#493B35] placeholder:text-[#C5B8B1]'
