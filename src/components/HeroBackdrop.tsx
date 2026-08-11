export default function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#001D1F] pointer-events-none">
      <picture className="absolute inset-0 w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet="/Landing%20Page%20with%20only%20bg%20final.png"
          type="image/png"
        />
        <img
          src="/hero-backdrop-mobile.webp"
          alt=""
          aria-hidden
          fetchPriority="high"
          className="h-full w-full object-cover object-center md:object-fill"
        />
      </picture>
    </div>
  );
}



