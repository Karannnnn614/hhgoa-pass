"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_DURATION = 5200;

export default function Intro() {
  const [show, setShow] = useState<boolean | null>(null);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [artReady, setArtReady] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const finished = useRef(false);
  const canSkip = artReady && logoReady;

  const finish = useCallback((automatic = false) => {
    if ((!canSkip && !automatic) || finished.current) return;
    finished.current = true;
    window.localStorage.setItem("hhgoa-intro-seen", "1");
    setFading(true);
    window.setTimeout(() => setShow(false), 550);
  }, [canSkip]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.localStorage.getItem("hhgoa-intro-seen") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(false);
      return;
    }

    const showTimer = window.setTimeout(() => setShow(true), 0);
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const value = Math.min((now - startedAt) / INTRO_DURATION, 1);
      setProgress(value * 100);
      if (value < 1) frame = window.requestAnimationFrame(tick);
      else setAnimationDone(true);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(showTimer);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!animationDone || finished.current) return;
    finish(true);
  }, [animationDone, finish]);

  if (show !== true) return null;

  return (
    <div
      aria-label={canSkip ? "Click anywhere to skip loading" : "Loading Hacker House Goa"}
      aria-live="polite"
      className={`intro-screen fixed inset-0 z-50 overflow-hidden bg-[#00161a] transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"} ${canSkip ? "cursor-pointer" : ""}`}
      onClick={() => finish()}
      role="button"
      tabIndex={canSkip ? 0 : -1}
      onKeyDown={(event) => {
        if (canSkip && (event.key === "Enter" || event.key === " ")) finish();
      }}
    >
      <picture className="absolute inset-0 block">
        <source media="(max-width: 767px)" srcSet="/intro-loading-mobile.png" />
        <img
          src="/intro-loading-desktop.png"
          alt="Goa loading artwork"
          className="intro-screen__background"
          onLoad={() => setArtReady(true)}
          onError={() => setArtReady(true)}
        />
      </picture>

      <div className="intro-screen__shade" />

      <div className="intro-screen__logo" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hacker-house-goa.png"
          alt=""
          onLoad={() => setLogoReady(true)}
          onError={() => setLogoReady(true)}
        />
      </div>

      <div className="intro-screen__progress" aria-hidden="true">
        <div className="intro-screen__progress-line" />
        <span
          className="intro-screen__progress-dot"
          style={{ left: `${progress}%` }}
        />
      </div>

      <div className="intro-screen__status">
        {canSkip ? "CLICK ANYWHERE TO SKIP" : "LOADING..."}
      </div>
    </div>
  );
}
