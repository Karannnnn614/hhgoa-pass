"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function shouldPlay(): boolean {
  return typeof window !== "undefined";
}

// Ease out cubic function for smooth deceleration
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Intro() {
  const [show, setShow] = useState<boolean | null>(null);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setFading(true);
    setTimeout(() => setShow(false), 400);
  }, []);

  useEffect(() => {
    const play = shouldPlay();
    if (!play) {
      setShow(false);
      return;
    }

    const id = setTimeout(() => setShow(true), 0);
    const start = performance.now();
    const DURATION = 1800; // Snappy 1.8 second loading time
    let frame = 0;

    const tick = (now: number) => {
      const linearProgress = Math.min((now - start) / DURATION, 1);
      const easedProgress = easeOutCubic(linearProgress);
      setProgress(easedProgress * 100);

      if (linearProgress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(finish, 120);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      clearTimeout(id);
      cancelAnimationFrame(frame);
    };
  }, [finish]);

  if (show === null || show === false) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#03090e] transition-opacity duration-400 ease-out select-none flex flex-col justify-end items-center"
      style={{ opacity: fading ? 0 : 1 }}
    >
      {/* Background Images for Mobile & Desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Mobile Loading Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/loading_mobile_vector.png"
          alt="Hacker House Goa Mobile Loading Screen"
          className="block md:hidden absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
        />

        {/* Desktop Loading Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/loading_screen_4k_pure_vector_preview.png"
          alt="Hacker House Goa Desktop Loading Screen"
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
        />

        {/* Atmospheric Glow Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#03090e]/15 to-[#03090e]/75 pointer-events-none" />
      </div>

      {/* Bottom Container: Fits Logo + Sun + Bar + Text together into the blank dark space */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 pb-4 sm:pb-8 md:pb-10 text-center max-w-[280px] sm:max-w-md md:max-w-lg mx-auto">
        {/* Logo Image */}
        <div className="relative mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
          {/* Subtle Ambient Glow behind Logo */}
          <div className="absolute -inset-4 rounded-full bg-radial from-[#ff8a24]/30 via-[#ff3f68]/15 to-transparent blur-xl opacity-75 pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Hacker House Goa Logo"
            className="relative w-32 sm:w-52 md:w-64 lg:w-[280px] max-w-[70vw] h-auto object-contain drop-shadow-[0_4px_20px_rgba(255,138,36,0.55)] transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Sun & Wave emblem icon */}
        <div className="mb-1.5 sm:mb-2 text-[#ff8a24] drop-shadow-[0_0_10px_rgba(255,138,36,0.75)]">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 5V11M12 17L15.8 20.8M36 17L32.2 20.8M6 29H11M42 29H37" stroke="url(#sun-emblem-grad)" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M16 29C16 24.5817 19.5817 21 24 21C28.4183 21 32 24.5817 32 29" stroke="url(#sun-emblem-grad)" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M9 35C12 33 15 33 18 35C21 37 24 37 27 35C30 33 33 33 36 35C39 37 42 37 45 35" stroke="url(#sun-emblem-grad)" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M12 41C14.5 39.5 17.5 39.5 20 41C22.5 42.5 25.5 42.5 28 41C30.5 39.5 33.5 39.5 36 41" stroke="url(#sun-emblem-grad)" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
            <defs>
              <linearGradient id="sun-emblem-grad" x1="6" y1="5" x2="42" y2="41" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff3f68" />
                <stop offset="0.5" stopColor="#ff8a24" />
                <stop offset="1" stopColor="#f6c161" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Dynamic Glowing Progress Bar */}
        <div className="relative w-full h-1.5 sm:h-2 flex items-center my-1 sm:my-1.5">
          {/* Track background */}
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md border border-white/15 overflow-hidden shadow-inner">
            {/* Filled Gradient Bar */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ff3f68] via-[#ff8a24] to-[#f6c161] shadow-[0_0_12px_rgba(255,138,36,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Glowing Orb / Spark Head */}
          {progress > 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#fffae6] shadow-[0_0_10px_#f6c161,0_0_20px_#ff8a24,0_0_30px_#ff3f68] pointer-events-none z-20"
              style={{ left: `${Math.min(Math.max(progress, 1), 99)}%` }}
            />
          )}
        </div>

        {/* Centered Loading Text */}
        <div className="mt-1.5 sm:mt-2 text-[9px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#f8e7b9] flex items-center justify-center leading-none pl-[0.25em] opacity-90 drop-shadow-[0_0_8px_rgba(255,138,36,0.4)]">
          <span>LOADING</span>
          <span className="inline-flex items-center ml-1 space-x-[2px] tracking-normal">
            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
          </span>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={finish}
        className="absolute right-4 top-4 sm:right-5 sm:top-5 z-30 rounded-full border border-[#ff8a24]/40 bg-black/50 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold text-[#f8e7b9] backdrop-blur-md transition hover:border-[#ff8a24] hover:bg-black/70 hover:scale-105 active:scale-95 shadow-lg"
      >
        Skip →
      </button>
    </div>
  );
}