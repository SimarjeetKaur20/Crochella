import React from 'react';
import { Link } from 'react-router-dom';

// ── Value cards data ───────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: '🧶',
    title: 'Handmade with Love',
    description:
      'Every piece is crafted by hand, stitch by stitch, with genuine care and attention to detail.',
  },
  {
    icon: '✨',
    title: 'Premium Quality',
    description:
      'We use only soft, durable yarns sourced for their feel and colour-fastness so your piece lasts for years.',
  },
  {
    icon: '🎨',
    title: 'Custom Creations',
    description:
      'Want a specific colour, size, or design? We love bringing your vision to life with bespoke orders.',
  },
  {
    icon: '🚀',
    title: 'Fast Delivery',
    description:
      'Pan-India shipping within 3–7 days. We pack every order with love and a personal thank-you note.',
  },
];

// ── Process steps data ─────────────────────────────────────────────────────────
const PROCESS_STEPS = [
  { icon: '🛒', step: '01', title: 'Choose Your Design', desc: 'Browse our collection or describe your dream piece to us.' },
  { icon: '🧵', step: '02', title: 'We Craft', desc: 'Our artisan gets to work, hand-crocheting your item with love and precision.' },
  { icon: '🔍', step: '03', title: 'Quality Check', desc: 'Every knot, edge, and finish is inspected before we pack it.' },
  { icon: '📦', step: '04', title: 'Delivered with Love', desc: 'Your order arrives beautifully packed, ready to make you smile.' },
];

// ── Component ──────────────────────────────────────────────────────────────────
const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FFF9F2] min-h-screen">

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4 text-center bg-[#F5DDE3]">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#E9DCCB]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#A8B5A0]/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest text-[#A8B5A0] mb-3">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#493B35] leading-tight mb-4">
            About Crochella
          </h1>
          <p className="text-[#493B35]/70 text-lg max-w-xl mx-auto">
            A small studio where every loop is a little act of love, and every finished piece tells a story.
          </p>
          {/* Decorative yarn emoji strip */}
          <div className="flex justify-center gap-2 mt-6 text-2xl opacity-60">
            {['🧶', '🌸', '✂️', '🌿', '🎀'].map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Story section ────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image (left) */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#F5DDE3] to-[#E9DCCB] flex items-center justify-center overflow-hidden shadow-md">
              {/* Placeholder illustration */}
              <div className="text-center px-8">
                <p className="text-8xl mb-4">🧶</p>
                <p className="text-[#493B35]/50 text-sm font-medium italic">A stitch of heart in every piece</p>
              </div>
            </div>
            {/* Floating accent */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl bg-[#A8B5A0] flex items-center justify-center shadow-lg">
              <span className="text-3xl">🌿</span>
            </div>
          </div>

          {/* Text (right) */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#A8B5A0] mb-3">Our Beginning</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#493B35] mb-5 leading-snug">
              Every Stitch Has a Story
            </h2>
            <div className="space-y-4 text-[#493B35]/80 leading-relaxed text-base">
              <p>
                Crochella was born at a kitchen table, under warm lamp-light, with a single skein of blush-pink yarn and a dream.
                What started as a lockdown hobby — relearning the crochet stitches my grandmother once taught me — quickly grew into something bigger.
              </p>
              <p>
                Friends began requesting bags, scrunchies, and little amigurumi friends. Soon, strangers found us on Instagram and fell in love with our soft, hand-crafted pieces.
                Each order felt like gifting a little piece of home to someone far away.
              </p>
              <p>
                Today, Crochella is still a one-artisan studio at heart. We believe in the magic of slow, intentional making — no machines, no mass production.
                Just hands, yarn, and genuine joy in the craft.
              </p>
            </div>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '500+', label: 'Happy Customers' },
                { value: '1200+', label: 'Orders Fulfilled' },
                { value: '100%', label: 'Handmade' },
              ].map((stat) => (
                <div key={stat.label} className="text-center bg-[#F5DDE3]/50 rounded-xl py-3 px-2">
                  <p className="text-xl font-bold text-[#493B35]">{stat.value}</p>
                  <p className="text-xs text-[#A8B5A0] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Values ───────────────────────────────────────────────────── */}
      <section className="bg-[#E9DCCB]/30 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#A8B5A0] mb-2">What We Stand For</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#493B35]">Our Values</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((val) => (
            <div
              key={val.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#E9DCCB] flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-full bg-[#F5DDE3] flex items-center justify-center mb-4 text-2xl">
                {val.icon}
              </div>
              <h3 className="font-semibold text-[#493B35] mb-2">{val.title}</h3>
              <p className="text-sm text-[#493B35]/70 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Process ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#A8B5A0] mb-2">The Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#493B35]">How We Make Your Order</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line on large screens */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-[#E9DCCB] z-0" />

            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative z-10">
                {/* Icon circle */}
                <div className="w-20 h-20 rounded-full bg-[#F5DDE3] border-4 border-white shadow-md flex flex-col items-center justify-center mb-4">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <span className="text-xs font-bold text-[#A8B5A0] tracking-widest mb-1">{step.step}</span>
                <h3 className="font-semibold text-[#493B35] mb-2">{step.title}</h3>
                <p className="text-sm text-[#493B35]/70 leading-relaxed max-w-[180px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#493B35] text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-5xl mb-5">🎀</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Shop?</h2>
          <p className="text-[#E9DCCB]/80 mb-8 leading-relaxed">
            Explore our collection of handmade crochet pieces — each one crafted just for you, with love.
          </p>
          <Link
            to="/shop"
            className="inline-block px-10 py-3.5 bg-[#F5DDE3] text-[#493B35] rounded-full font-semibold text-base hover:bg-white transition shadow-lg"
          >
            Browse Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
