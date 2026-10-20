export default function AnnouncementBar() {
  return (
    <div
      className="w-full overflow-hidden py-2 text-sm font-medium tracking-wide"
      style={{ backgroundColor: '#493B35', color: '#FFF9F2' }}
    >
      {/* Desktop: static centered text */}
      <p className="hidden md:block text-center">
        Handmade with Love | Every Stitch Tells a Story ✨
      </p>

      {/* Mobile: marquee animation */}
      <div className="md:hidden relative flex overflow-hidden">
        <span className="marquee-track whitespace-nowrap pr-16 animate-marquee">
          Handmade with Love | Every Stitch Tells a Story ✨ &nbsp;&nbsp;&nbsp;
          Handmade with Love | Every Stitch Tells a Story ✨ &nbsp;&nbsp;&nbsp;
        </span>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  )
}
