import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { DeliveryAddress } from '../types';
import toast from 'react-hot-toast';

// ── Indian states ──────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
];

const SHIPPING_THRESHOLD = 1500;
const SHIPPING_FEE = 80;

// ── Razorpay types ─────────────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: any;
  }
}

// ── Form field interface ───────────────────────────────────────────────────────
interface CheckoutForm {
  fullName: string;
  mobile: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  notes: string;
}

type PaymentMethod = 'cod' | 'razorpay';

const initialForm: CheckoutForm = {
  fullName: '',
  mobile: '',
  email: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
  notes: '',
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(!!window.Razorpay);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Component ──────────────────────────────────────────────────────────────────
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const { placeOrder } = useOrderStore();
  const siteConfig = useProductStore((s) => s.siteConfig);
  const { items, subtotal, clearCart } = useCartStore();

  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const sub = subtotal();
  const shipping = sub >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = sub + shipping;

  const razorpayEnabled =
    !!siteConfig?.razorpay_enabled && !!import.meta.env.VITE_RAZORPAY_KEY_ID;
  const codEnabled = !!siteConfig?.cod_enabled;

  // Pre-select COD when it's the only option
  useEffect(() => {
    if (codEnabled && !razorpayEnabled && paymentMethod === null) {
      setPaymentMethod('cod');
    }
  }, [codEnabled, razorpayEnabled, paymentMethod]);

  // Pre-load Razorpay script
  useEffect(() => {
    if (razorpayEnabled) {
      loadRazorpayScript().then(setRazorpayReady);
    }
  }, [razorpayEnabled]);

  // ── Validation ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const newErrors: Partial<CheckoutForm> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!form.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(form.mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!form.street.trim()) newErrors.street = 'Street address is required.';
    if (!form.city.trim()) newErrors.city = 'City is required.';
    if (!form.state) newErrors.state = 'Please select a state.';
    if (!form.pinCode.trim()) {
      newErrors.pinCode = 'PIN code is required.';
    } else if (!/^\d{6}$/.test(form.pinCode.trim())) {
      newErrors.pinCode = 'Enter a valid 6-digit PIN code.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Field change handler ──────────────────────────────────────────────────
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  // ── Place order (COD) ──────────────────────────────────────────────────────
  async function submitCOD() {
    setIsSubmitting(true);
    try {
      const address: DeliveryAddress = {
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state,
        pinCode: form.pinCode.trim(),
      };
      const orderNumber = await placeOrder({
        customerName: form.fullName.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim() || undefined,
        deliveryAddress: address,
        notes: form.notes.trim() || undefined,
        paymentMethod: 'cod',
        items,
        subtotal: sub,
        shippingFee: shipping,
        total,
      });
      clearCart();
      navigate(`/order-confirmation/${orderNumber}`);
    } catch (err: any) {
      toast.error(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Place order (Razorpay) ────────────────────────────────────────────────
  async function submitRazorpay() {
    if (!razorpayReady || !window.Razorpay) {
      toast.error('Razorpay is not available. Please try COD or refresh the page.');
      return;
    }
    setIsSubmitting(true);
    try {
      const address: DeliveryAddress = {
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state,
        pinCode: form.pinCode.trim(),
      };

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100, // paise
        currency: 'INR',
        name: siteConfig?.announcement_text ? 'Crochella' : 'Crochella',
        description: 'Handmade crochet order',
        prefill: {
          name: form.fullName.trim(),
          contact: form.mobile.trim(),
          email: form.email.trim() || undefined,
        },
        theme: { color: '#A8B5A0' },
        handler: async (response: any) => {
          try {
            const orderNumber = await placeOrder({
              customerName: form.fullName.trim(),
              mobile: form.mobile.trim(),
              email: form.email.trim() || undefined,
              deliveryAddress: address,
              notes: form.notes.trim() || undefined,
              paymentMethod: 'razorpay',
              razorpayPaymentId: response.razorpay_payment_id,
              items,
              subtotal: sub,
              shippingFee: shipping,
              total,
            });
            clearCart();
            navigate(`/order-confirmation/${orderNumber}`);
          } catch (err: any) {
            toast.error(err?.message ?? 'Order creation failed after payment. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast('Payment cancelled. You can retry or choose COD.', { icon: 'ℹ️' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to initiate payment. Please try again.');
      setIsSubmitting(false);
    }
  }

  // ── Submit handler ─────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }
    if (!validate()) {
      toast.error('Please fix the errors below.');
      return;
    }
    if (paymentMethod === 'razorpay') {
      await submitRazorpay();
    } else {
      await submitCOD();
    }
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
    name: keyof CheckoutForm;
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

  // ── Empty cart guard ───────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center gap-4 px-4">
        <span className="text-6xl">🧶</span>
        <h2 className="text-2xl font-semibold text-[#493B35]">Your cart is empty</h2>
        <p className="text-[#A8B5A0]">Add some items before checking out.</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-2 px-6 py-2.5 bg-[#A8B5A0] text-white rounded-full font-medium hover:bg-[#93a08b] transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFF9F2] py-10 px-4 md:px-8">
      {/* Page header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-[#493B35]">Checkout</h1>
        <p className="text-[#A8B5A0] mt-1">Almost there — fill in your details to place your order 🧶</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* ── LEFT: Customer & Delivery ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E9DCCB] p-6 md:p-8 space-y-6">

            {/* Personal info */}
            <div>
              <h2 className="text-lg font-semibold text-[#493B35] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#F5DDE3] flex items-center justify-center text-sm font-bold text-[#493B35]">1</span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Full Name" name="fullName" required placeholder="Priya Sharma" />
                </div>
                <Field label="Mobile Number" name="mobile" type="tel" required placeholder="9876543210" maxLength={10} />
                <Field label="Email Address" name="email" type="email" placeholder="priya@email.com" />
              </div>
            </div>

            <hr className="border-[#E9DCCB]" />

            {/* Delivery address */}
            <div>
              <h2 className="text-lg font-semibold text-[#493B35] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#F5DDE3] flex items-center justify-center text-sm font-bold text-[#493B35]">2</span>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Street Address" name="street" required placeholder="123, MG Road, Apartment 4B" />
                </div>
                <Field label="City" name="city" required placeholder="Mumbai" />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#493B35]">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={`px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] transition ${
                      errors.state ? 'border-rose-400' : 'border-[#E9DCCB]'
                    }`}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-rose-500 mt-0.5">{errors.state}</p>}
                </div>
                <Field label="PIN Code" name="pinCode" required placeholder="400001" maxLength={6} />
              </div>
            </div>

            <hr className="border-[#E9DCCB]" />

            {/* Notes */}
            <div>
              <h2 className="text-lg font-semibold text-[#493B35] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#F5DDE3] flex items-center justify-center text-sm font-bold text-[#493B35]">3</span>
                Order Notes <span className="text-sm font-normal text-[#A8B5A0]">(Optional)</span>
              </h2>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Customization instructions, color preferences, gift messages…"
                className="w-full px-3 py-2 rounded-lg border border-[#E9DCCB] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#A8B5A0] transition resize-none"
              />
            </div>
          </div>

          {/* ── RIGHT: Order Summary ─────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E9DCCB] p-6">
              <h2 className="text-lg font-semibold text-[#493B35] mb-4">Order Summary</h2>

              {/* Cart items */}
              <ul className="space-y-3 mb-4">
                {items.map((item) => {
                  const price = item.product.discounted_price ?? item.product.price
                  return (
                  <li key={`${item.product.id}|${item.selected_color}|${item.selected_size}`} className="flex items-center gap-3">
                    {item.product.images[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover object-center border border-[#E9DCCB] flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#493B35] truncate">{item.product.name}</p>
                      <p className="text-xs text-[#A8B5A0]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#493B35] whitespace-nowrap">
                      ₹{(price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </li>
                  )
                })}
              </ul>

              <hr className="border-[#E9DCCB] mb-3" />

              {/* Pricing */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#493B35]">
                  <span>Subtotal</span>
                  <span>₹{sub.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#493B35]">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-[#A8B5A0] font-medium">FREE 🎉</span>
                  ) : (
                    <span className="text-[#493B35]">₹{shipping}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#A8B5A0]">
                    Free shipping on orders above ₹1,500
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-3 pt-3 border-t border-[#E9DCCB] text-base font-bold text-[#493B35]">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E9DCCB] p-6">
              <h2 className="text-lg font-semibold text-[#493B35] mb-4">Payment Method</h2>

              <div className="space-y-3">
                {/* COD */}
                {codEnabled && (
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-[#A8B5A0] bg-[#A8B5A0]/10'
                        : 'border-[#E9DCCB] hover:border-[#A8B5A0]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#A8B5A0] w-4 h-4"
                    />
                    <span className="text-xl">💵</span>
                    <div>
                      <p className="text-sm font-medium text-[#493B35]">Cash on Delivery</p>
                      <p className="text-xs text-[#A8B5A0]">Pay when your order arrives</p>
                    </div>
                  </label>
                )}

                {/* Razorpay */}
                {siteConfig?.razorpay_enabled && (
                  razorpayEnabled ? (
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === 'razorpay'
                          ? 'border-[#A8B5A0] bg-[#A8B5A0]/10'
                          : 'border-[#E9DCCB] hover:border-[#A8B5A0]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="accent-[#A8B5A0] w-4 h-4"
                      />
                      <span className="text-xl">💳</span>
                      <div>
                        <p className="text-sm font-medium text-[#493B35]">Pay Online</p>
                        <p className="text-xs text-[#A8B5A0]">UPI, Cards, Net Banking via Razorpay</p>
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#E9DCCB] bg-[#FFF9F2]">
                      <span className="text-xl">💳</span>
                      <div>
                        <p className="text-sm font-medium text-[#493B35]">Pay Online</p>
                        <p className="text-xs text-[#A8B5A0]">Coming soon — not configured yet</p>
                      </div>
                    </div>
                  )
                )}

                {!codEnabled && !razorpayEnabled && (
                  <p className="text-sm text-rose-500 text-center py-2">
                    No payment methods are currently enabled. Please contact the store.
                  </p>
                )}
              </div>
            </div>

            {/* Place order */}
            <button
              type="submit"
              disabled={isSubmitting || (!codEnabled && !razorpayEnabled)}
              className="w-full py-3.5 bg-[#493B35] text-white rounded-2xl font-semibold text-base hover:bg-[#3a2e2a] disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Placing Order…
                </>
              ) : (
                <>🎀 Place Order</>
              )}
            </button>

            <p className="text-xs text-center text-[#A8B5A0]">
              🔒 Your information is safe with us
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
