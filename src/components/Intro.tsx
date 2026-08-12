"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import HeroBackdrop from "@/components/HeroBackdrop";

function shouldPlay(): boolean {
  return typeof window !== "undefined";
}

export default function Intro() {
  const [show, setShow] = useState<boolean | null>(null);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setFading(true);
    setTimeout(() => setShow(false), 550);
  }, []);

  useEffect(() => {
    const play = shouldPlay();
    if (!play) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(false);
      return;
    }

    const id = setTimeout(() => setShow(true), 0);
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const value = Math.min((now - start) / 4200, 1);
      setProgress(value * 100);
      if (value < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(finish, 280);
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
      className="fixed inset-0 z-50 overflow-hidden bg-[#00161A] transition-opacity duration-600"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div className="absolute inset-0">
        <HeroBackdrop />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,122,50,0.22),transparent_36%)]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.08em] text-[#f8e7b9] drop-shadow-[0_0_30px_rgba(255,122,50,0.25)]">
          HACKER HOUSE
        </div>

        <div className="text-[10px] font-bold tracking-[0.42em] text-[#ff3f68] uppercase sm:text-xs">
          GOA • INDIA • 2026
        </div>

        <div className="mt-7 flex w-36 items-center justify-center sm:w-44">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-[#ff8a24]/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ff8a24] via-[#f6c161] to-[#ff3f68] transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 text-[9px] font-bold tracking-[0.26em] text-[#f8e7b9]/80 uppercase">
          Loading
        </div>
      </div>

      <button
        onClick={finish}
        className="absolute right-6 top-6 rounded-full border border-cream/40 bg-ink/50 px-5 py-2.5 text-sm font-bold text-cream backdrop-blur-sm transition hover:border-cream hover:bg-ink/70"
      >
        Skip
      </button>
    </div>
  );
}
