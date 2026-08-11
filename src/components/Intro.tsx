"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SEEN = "hhgoa-intro-seen";

/**
 * Full-screen intro that plays once, then hands over to the landing.
 * Skipped entirely on mobile, for reduced-motion, and on repeat visits —
 * so the mp4 is only ever fetched when it will actually be watched.
 */
/** Decided once, lazily, on the client. Server render is always null. */
function shouldPlay(): boolean {
  if (typeof window === "undefined") return false;
  return !(
    sessionStorage.getItem(SEEN) === "1" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.innerWidth < 768
  );
}

export default function Intro() {
  // lazy initialiser: no setState-in-effect, no cascading render
  const [show, setShow] = useState<boolean | null>(null);
  const [fading, setFading] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    sessionStorage.setItem(SEEN, "1");
    setFading(true);
    setTimeout(() => setShow(false), 620);
  }, []);

  useEffect(() => {
    // Decided after mount (needs sessionStorage + viewport), so it can't be
    // a lazy initialiser without risking a hydration mismatch.
    const play = shouldPlay();
    if (!play) finished.current = true;
    const id = setTimeout(() => setShow(play), 0);

    // Hard cap: never hold the user longer than the clip runs.
    const cap = play ? setTimeout(finish, 9000) : undefined;
    return () => {
      clearTimeout(id);
      if (cap) clearTimeout(cap);
    };
  }, [finish]);

  if (show === null || show === false) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink transition-opacity duration-600"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <video
        ref={video}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/hero-poster.webp"
        onEnded={finish}
        onError={finish}
        className="h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <button
        onClick={finish}
        className="absolute right-6 top-6 rounded-full border border-cream/40 bg-ink/50 px-5 py-2.5 text-sm font-bold text-cream backdrop-blur-sm transition hover:border-cream hover:bg-ink/70"
      >
        Skip intro →
      </button>
    </div>
  );
}
