"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import PassCard, { CARD_H, CARD_W, type PassData } from "./PassCard";
import type { Transform } from "./PhotoSlot";

/**
 * Renders the card at true export size and CSS-scales it to fit the
 * available width, so the rasteriser always sees export-resolution DOM.
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
    const fit = () => setScale(el.clientWidth / CARD_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className="card-in sheen relative overflow-hidden rounded-[28px] shadow-2xl shadow-black/60"
      style={{ aspectRatio: `${CARD_W} / ${CARD_H}` }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: CARD_W,
          height: CARD_H,
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
