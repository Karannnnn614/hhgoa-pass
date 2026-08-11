/**
 * The supplied artwork is a full landing-page comp — it carries its own nav
 * and "HACKER HOUSE" wordmark, so it can't sit behind live text. What's used
 * here is the scenery strip cropped out of it (sunset, sea, cliffs, shacks),
 * anchored to the bottom as a horizon. The mp4 plays as the intro instead.
 */
export default function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {/* deep green ground */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#0B2420 0%,#0C2723 45%,#0A1F1C 100%)",
        }}
      />

      {/* sunset glow rising from the horizon */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(105% 55% at 50% 96%, rgba(245,160,60,0.34) 0%, rgba(232,51,110,0.15) 40%, rgba(7,22,19,0) 72%)",
        }}
      />

      {/* scenery band along the bottom */}
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet="/hero-band.webp"
          type="image/webp"
        />
        <img
          src="/hero-band-mobile.webp"
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute bottom-0 left-0 w-full object-cover"
          style={{
            height: "46vh",
            objectPosition: "center bottom",
            opacity: 0.85,
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 34%, #000 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 34%, #000 100%)",
          }}
        />
      </picture>

      {/* readability scrim over the type zone */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/35 to-ink/70" />
    </div>
  );
}
