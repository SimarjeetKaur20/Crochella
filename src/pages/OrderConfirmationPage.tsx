import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { FULFILLMENT_STATUS_LABELS } from '../types';

// ── Badge helper ───────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const label = FULFILLMENT_STATUS_LABELS[status as keyof typeof FULFILLMENT_STATUS_LABELS] ?? status;
  const colorMap: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    crafting: 'bg-purple-100 text-purple-700',
    quality_check: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-sky-100 text-sky-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {label}
    </span>
  );
};

// ── Component ──────────────────────────────────────────────────────────────────
const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();

  const orders = useOrderStore((s) => s.orders);
  const siteConfig = useProductStore((s) => s.siteConfig);

  const order = orders.find((o) => o.orderNumber === orderNumber);

  const whatsappNumber = siteConfig?.whatsapp_number ?? '';
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi! I just placed an order on Crochella. My order number is #${orderNumber}. 😊`
      )}`
    : `https://wa.me/?text=${encodeURIComponent(`Order #${orderNumber} placed on Crochella!`)}`;

  // ── Fallback when order not in store ──────────────────────────────────────
  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#A8B5A0]/20 flex items-center justify-center mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl font-bold text-[#493B35] mb-2">Order Placed Successfully!</h1>
        <p className="text-[#A8B5A0] mb-6 max-w-md">
          Thank you for your order. We'll start crafting with love!
        </p>
        <div className="bg-white border border-[#E9DCCB] rounded-2xl px-8 py-5 mb-6 shadow-sm">
          <p className="text-sm text-[#A8B5A0] mb-1">Your Order Number</p>
          <p className="text-2xl font-bold text-[#493B35] tracking-wide">#{orderNumber}</p>
          <p className="text-xs text-[#A8B5A0] mt-2">Keep this number safe for reference.</p>
        </div>
        <p className="text-sm text-[#A8B5A0] mb-8 max-w-sm">
          Your order will be ready in <strong>3–7 days</strong>. We'll notify you on WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] text-white rounded-full font-medium flex items-center gap-2 hover:bg-[#1ebe5d] transition shadow"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.847L.057 23.428a.75.75 0 00.921.921l5.628-1.476A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.955 9.955 0 01-5.078-1.38l-.363-.215-3.758.985.999-3.658-.237-.378A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Contact on WhatsApp
          </a>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-[#F5DDE3] text-[#493B35] rounded-full font-medium hover:bg-[#edcdd5] transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ── Full order detail view ────────────────────────────────────────────────
  const addr = order.deliveryAddress;
  const addressStr = [addr.street, addr.city, addr.state, addr.pinCode].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">

        {/* ── Hero checkmark ────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex w-24 h-24 rounded-full bg-[#A8B5A0] items-center justify-center mb-5 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#493B35] mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-[#A8B5A0] text-base max-w-sm mx-auto">
            Thank you for your order. We'll start crafting with love!
          </p>
        </div>

        {/* ── Order number card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E9DCCB] shadow-sm p-6 mb-5 text-center">
          <p className="text-xs uppercase tracking-widest text-[#A8B5A0] mb-1">Order Number</p>
          <p className="text-3xl font-bold text-[#493B35] tracking-wide">#{order.orderNumber}</p>
          <p className="text-xs text-[#A8B5A0] mt-2">Keep this number safe for reference.</p>
        </div>

        {/* ── Customer & delivery ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E9DCCB] shadow-sm p-6 mb-5 space-y-3">
          <h2 className="text-base font-semibold text-[#493B35] mb-2">Delivery Details</h2>
          <div className="text-sm space-y-1">
            <p>
              <span className="text-[#A8B5A0]">Name: </span>
              <span className="font-medium text-[#493B35]">{order.customerName}</span>
            </p>
            <p>
              <span className="text-[#A8B5A0]">Phone: </span>
              <span className="font-medium text-[#493B35]">{order.mobile}</span>
            </p>
            {order.email && (
              <p>
                <span className="text-[#A8B5A0]">Email: </span>
                <span className="font-medium text-[#493B35]">{order.email}</span>
              </p>
            )}
            <p>
              <span className="text-[#A8B5A0]">Address: </span>
              <span className="font-medium text-[#493B35]">{addressStr}</span>
            </p>
          </div>
        </div>

        {/* ── Items ordered ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E9DCCB] shadow-sm p-6 mb-5">
          <h2 className="text-base font-semibold text-[#493B35] mb-4">Items Ordered</h2>
          <ul className="space-y-3">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover object-center border border-[#E9DCCB] flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#493B35] truncate">{item.name}</p>
                  <p className="text-xs text-[#A8B5A0]">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-[#493B35] whitespace-nowrap">
                  ₹{((item.price ?? 0) * item.quantity).toLocaleString('en-IN')}
                </p>
              </li>
            ))}
          </ul>

          <hr className="border-[#E9DCCB] my-4" />

          {/* Totals */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-[#493B35]">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#493B35]">
              <span>Shipping</span>
              {(order.shippingFee ?? 0) === 0 ? (
                <span className="text-[#A8B5A0]">FREE</span>
              ) : (
                <span>₹{order.shippingFee?.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-[#E9DCCB] text-base font-bold text-[#493B35]">
            <span>Total Paid</span>
            <span>₹{order.total?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* ── Payment info ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E9DCCB] shadow-sm p-6 mb-5">
          <h2 className="text-base font-semibold text-[#493B35] mb-3">Payment</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-[#493B35]">
              {order.paymentMethod === 'razorpay' ? '💳 Paid Online (Razorpay)' : '💵 Cash on Delivery'}
            </span>
            {order.fulfillmentStatus && <StatusBadge status={order.fulfillmentStatus} />}
          </div>
          {order.paymentMethod === 'razorpay' && order.razorpayPaymentId && (
            <p className="text-xs text-[#A8B5A0] mt-1">Txn ID: {order.razorpayPaymentId}</p>
          )}
        </div>

        {/* ── Preparation note ──────────────────────────────────────────── */}
        <div className="bg-[#F5DDE3]/50 border border-[#F5DDE3] rounded-2xl p-5 mb-6 text-center">
          <p className="text-2xl mb-2">🧶</p>
          <p className="text-sm font-medium text-[#493B35]">
            Your order will be ready in <strong>3–7 days</strong>.
          </p>
          <p className="text-xs text-[#A8B5A0] mt-1">
            We'll notify you on WhatsApp once it ships!
          </p>
        </div>

        {/* ── Action buttons ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#1ebe5d] transition shadow"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.847L.057 23.428a.75.75 0 00.921.921l5.628-1.476A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.955 9.955 0 01-5.078-1.38l-.363-.215-3.758.985.999-3.658-.237-.378A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Contact on WhatsApp
          </a>
          <Link
            to="/shop"
            className="px-6 py-3 bg-[#F5DDE3] text-[#493B35] rounded-full font-medium flex items-center justify-center hover:bg-[#edcdd5] transition text-center"
          >
            Continue Shopping 🛍️
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
