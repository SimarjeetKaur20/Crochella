import React, { useState } from 'react';
import { useProductStore } from '../store/productStore';

// ── Constants ──────────────────────────────────────────────────────────────────
const PRODUCT_CATEGORIES = [
  'Bags & Totes',
  'Scrunchies & Hair Accessories',
  'Home Décor',
  'Amigurumi / Stuffed Toys',
  'Clothing & Tops',
  'Jewellery & Accessories',
  'Baby Items',
  'Custom / Other',
];

// ── FAQ data ───────────────────────────────────────────────────────────────────
const FAQS = [
  {
    question: 'How long does delivery take?',
    answer:
      'We typically prepare and ship your order within 3–7 business days. Delivery time depends on your location (usually 2–5 days after dispatch). We ship pan India via trusted couriers and will share your tracking number on WhatsApp.',
  },
  {
    question: 'Can I customize colours or designs?',
    answer:
      "Absolutely! Customisation is our speciality. You can request specific yarn colours, sizes, or entirely new designs. Just fill out the enquiry form below or message us on WhatsApp and we'll discuss your vision.",
  },
  {
    question: 'What is your return / exchange policy?',
    answer:
      'Since every item is handmade to order, we do not accept returns for change of mind. However, if your item arrives damaged or is significantly different from what was agreed, please contact us within 48 hours with photos and we will make it right.',
  },
  {
    question: 'Do you ship pan India?',
    answer:
      'Yes! We ship to all states and union territories across India. Standard shipping is ₹80, and orders above ₹1,500 get free shipping.',
  },
  {
    question: 'Can I place a bulk or wholesale order?',
    answer:
      "Yes, we love bulk orders! Reach out via WhatsApp or the enquiry form with your requirements (quantity, items, timeline) and we'll give you a custom quote with wholesale pricing.",
  },
];

// ── Accordion item ─────────────────────────────────────────────────────────────
const AccordionItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#E9DCCB] rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
        aria-expanded={open}
      >
        <span className="font-medium text-[#493B35] text-sm md:text-base">{question}</span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#F5DDE3] flex items-center justify-center text-[#493B35] ml-3 transition-transform duration-200 ${
            open ? 'rotate-45' : ''
          }`}
        >
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-[#493B35]/80 leading-relaxed border-t border-[#E9DCCB] pt-4">
          {answer}
        </div>
      )}
    </div>
  );
};

// ── Contact method card ────────────────────────────────────────────────────────
interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  label: string;
  bgColor: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon, title, subtitle, href, label, bgColor }) => (
  <div className={`${bgColor} rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-[#E9DCCB]`}>
    <div className="w-14 h-14 rounded-full bg-white/70 flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-[#493B35] mb-0.5">{title}</h3>
      <p className="text-xs text-[#493B35]/60">{subtitle}</p>
    </div>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 px-5 py-2 bg-[#493B35] text-white rounded-full text-sm font-medium hover:bg-[#3a2e2a] transition"
    >
      {label}
    </a>
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────
interface EnquiryForm {
  name: string;
  phone: string;
  email: string;
  category: string;
  description: string;
}

const ContactPage: React.FC = () => {
  const siteConfig = useProductStore((s) => s.siteConfig);

  const whatsappNumber = siteConfig?.whatsapp_number ?? '';
  const emailAddress = siteConfig?.email ?? 'simarjeetkaur20012006@gmail.com';

  const INSTAGRAM_PERSONAL = 'https://www.instagram.com/simarwhoneversleeps/?hl=en';
  const INSTAGRAM_CROCHELLA = 'https://www.instagram.com/_crochellla/?hl=en';

  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const waBaseUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : 'https://wa.me/';

  const [form, setForm] = useState<EnquiryForm>({
    name: '',
    phone: '',
    email: '',
    category: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<EnquiryForm>>({});
  const [submitted, setSubmitted] = useState(false);

  // ── Field handler ──────────────────────────────────────────────────────────
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EnquiryForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate(): boolean {
    const newErrors: Partial<EnquiryForm> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number.';
    }
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!form.description.trim()) newErrors.description = 'Please describe what you want.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit handler ─────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitted(true);

    const waText = [
      `Hi Crochella! 🧶 I'm interested in a custom order.`,
      `*Name:* ${form.name.trim()}`,
      `*Phone:* ${form.phone.trim()}`,
      form.email.trim() ? `*Email:* ${form.email.trim()}` : '',
      form.category ? `*Category:* ${form.category}` : '',
      `*What I'm looking for:*\n${form.description.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

    const waUrl = `${waBaseUrl}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  // ── Field component ────────────────────────────────────────────────────────
  const Field = ({
    label,
    name,
    type = 'text',
    required,
    placeholder,
    maxLength,
  }: {
    label: string;
    name: keyof EnquiryForm;
    type?: string;
    required?: boolean;
    placeholder?: string;
    maxLength?: number;
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#493B35]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] transition ${
          errors[name] ? 'border-rose-400' : 'border-[#E9DCCB]'
        }`}
      />
      {errors[name] && <p className="text-xs text-rose-500 mt-0.5">{errors[name]}</p>}
    </div>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#FFF9F2] min-h-screen">

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-4 text-center bg-[#F5DDE3]">
        <div className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-[#E9DCCB]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#A8B5A0]/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#A8B5A0] mb-3">Say Hello</p>
          <h1 className="text-5xl font-bold text-[#493B35] mb-3">Let's Connect 🌸</h1>
          <p className="text-[#493B35]/70 text-base">
            Have a question, want a custom order, or just want to chat about crochet? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* ── 2. Contact method cards ──────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#493B35] text-center mb-8">Reach Us On</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* WhatsApp */}
            <ContactCard
              bgColor="bg-[#F0FBF4]"
              icon={
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.847L.057 23.428a.75.75 0 00.921.921l5.628-1.476A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.955 9.955 0 01-5.078-1.38l-.363-.215-3.758.985.999-3.658-.237-.378A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              }
              title="WhatsApp"
              subtitle={whatsappNumber ? `+${cleanPhone}` : 'Chat with us directly'}
              href={waBaseUrl}
              label="Message Us"
            />

            {/* Instagram — two accounts */}
            <div className="bg-[#FDF5F8] rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-[#E9DCCB]">
              <div className="w-14 h-14 rounded-full bg-white/70 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
                  <defs>
                    <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f09433" />
                      <stop offset="25%" stopColor="#e6683c" />
                      <stop offset="50%" stopColor="#dc2743" />
                      <stop offset="75%" stopColor="#cc2366" />
                      <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" stroke="url(#ig-grad)" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#dc2743" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#493B35] mb-0.5">Instagram</h3>
                <p className="text-xs text-[#493B35]/60">Follow our crochet journey</p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-1">
                <a
                  href={INSTAGRAM_PERSONAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#493B35] text-white rounded-full text-sm font-medium hover:bg-[#3a2e2a] transition"
                >
                  Personal Instagram
                </a>
                <a
                  href={INSTAGRAM_CROCHELLA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#493B35] text-white rounded-full text-sm font-medium hover:bg-[#3a2e2a] transition"
                >
                  Crochella Instagram
                </a>
              </div>
            </div>

            {/* Email */}
            <ContactCard
              bgColor="bg-[#F5F5FF]"
              icon={
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#6B7FD4]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 8l10 6 10-6" />
                </svg>
              }
              title="Email"
              subtitle={emailAddress}
              href={`mailto:${emailAddress}`}
              label="Send Email"
            />
          </div>
        </div>
      </section>

      {/* ── 3. Custom order enquiry form ─────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#E9DCCB]/20">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#A8B5A0] mb-2">Custom Orders</p>
            <h2 className="text-2xl font-bold text-[#493B35]">Tell Us What You're Looking For</h2>
            <p className="text-[#493B35]/60 text-sm mt-2">
              Fill in the details below and we'll follow up on WhatsApp with a quote!
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl border border-[#E9DCCB] shadow-sm p-10 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h3 className="text-xl font-bold text-[#493B35] mb-2">We've received your enquiry!</h3>
              <p className="text-sm text-[#493B35]/70 mb-6">
                A WhatsApp chat has been opened with your details pre-filled. We'll get back to you soon!
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', phone: '', email: '', category: '', description: '' });
                  setErrors({});
                }}
                className="px-6 py-2.5 bg-[#F5DDE3] text-[#493B35] rounded-full font-medium hover:bg-[#edcdd5] transition text-sm"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-2xl border border-[#E9DCCB] shadow-sm p-6 md:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Your Name" name="name" required placeholder="Priya Sharma" />
                <Field label="Phone Number" name="phone" type="tel" required placeholder="9876543210" maxLength={10} />
              </div>
              <Field label="Email Address" name="email" type="email" placeholder="priya@email.com" />

              {/* Category dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#493B35]">Product Type / Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg border border-[#E9DCCB] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] transition"
                >
                  <option value="">Select a category (optional)</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#493B35]">
                  Describe What You Want <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="E.g. A sage green tote bag with flower motifs, approximately 40cm tall, with a zipper closure…"
                  className={`px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] transition resize-none ${
                    errors.description ? 'border-rose-400' : 'border-[#E9DCCB]'
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-rose-500 mt-0.5">{errors.description}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#493B35] text-white rounded-xl font-semibold hover:bg-[#3a2e2a] transition flex items-center justify-center gap-2 shadow"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.847L.057 23.428a.75.75 0 00.921.921l5.628-1.476A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.955 9.955 0 01-5.078-1.38l-.363-.215-3.758.985.999-3.658-.237-.378A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Send Enquiry via WhatsApp
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── 4. FAQ ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#A8B5A0] mb-2">FAQs</p>
            <h2 className="text-2xl font-bold text-[#493B35]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          {/* Unanswered questions nudge */}
          <p className="text-center text-sm text-[#A8B5A0] mt-8">
            Still have questions?{' '}
            <a
              href={waBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#493B35] font-medium underline underline-offset-2 hover:text-[#A8B5A0] transition"
            >
              Chat with us on WhatsApp →
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
