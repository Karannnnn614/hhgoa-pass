"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import PassCard, { type PassData } from "./PassCard";
import type { Transform } from "./PhotoSlot";

/**
 * Renders the card at true export size (1200x1500) and CSS-scales it to fit
 * the available width. The rasteriser then sees export-resolution DOM.
 */
const ScaledCard = forwardRef<
  HTMLDivElement,
  { data: PassData; onTransform: (t: Transform) => void }
>(function ScaledCard({ data, onTransform }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / 1200);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className="card-in sheen relative overflow-hidden rounded-[28px] shadow-2xl shadow-black/60"
      style={{ aspectRatio: "1200 / 1500" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 1500,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          visibility: scale ? "visible" : "hidden",
        }}
      >
        <PassCard ref={ref} data={data} onTransform={onTransform} />
      </div>
    </div>
  );
});

export default ScaledCard;
