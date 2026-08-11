export default function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#001D1F] pointer-events-none">
      <picture className="absolute inset-0 w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet="/hero-backdrop.webp"
          type="image/webp"
        />
        <img
          src="/hero-backdrop-mobile.webp"
          alt=""
          aria-hidden
          fetchPriority="high"
          className="w-full h-full object-cover object-center"
        />
      </picture>
    </div>
  );
}



