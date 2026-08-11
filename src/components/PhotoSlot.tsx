"use client";

import { useRef, useState } from "react";
import type { Photo } from "@/lib/photo";

export type Transform = { x: number; y: number; zoom: number };

/**
 * Cover-fits the photo into a circular slot, then lets the user nudge it.
 * x/y are offsets in slot-fractions so the transform survives rasterising
 * at 2x without recomputation.
 */
export default function PhotoSlot({
  photo,
  transform,
  onChange,
  interactive = true,
  className = "",
}: {
  photo: Photo;
  transform: Transform;
  onChange?: (t: Transform) => void;
  interactive?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const clamp = (t: Transform): Transform => {
    // Keep the photo covering the slot: offsets bounded by the overflow.
    const over = (t.zoom - 1) / 2 + 0.35;
    return {
      zoom: Math.min(3, Math.max(1, t.zoom)),
      x: Math.min(over, Math.max(-over, t.x)),
      y: Math.min(over, Math.max(-over, t.y)),
    };
  };

  const size = () => ref.current?.getBoundingClientRect().width ?? 1;

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive || !onChange) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      ox: transform.x,
      oy: transform.y,
    };
    setGrabbing(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!interactive || !onChange || !drag.current) return;
    const s = size();
    onChange(
      clamp({
        ...transform,
        x: drag.current.ox + (e.clientX - drag.current.x) / s,
        y: drag.current.oy + (e.clientY - drag.current.y) / s,
      }),
    );
  };

  const endDrag = () => {
    drag.current = null;
    setGrabbing(false);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!interactive || !onChange) return;
    onChange(clamp({ ...transform, zoom: transform.zoom - e.deltaY * 0.0016 }));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!interactive || !onChange || e.touches.length !== 2) return;
    const [a, b] = [e.touches[0], e.touches[1]];
    pinch.current = {
      dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      zoom: transform.zoom,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!interactive || !onChange || e.touches.length !== 2 || !pinch.current)
      return;
    const [a, b] = [e.touches[0], e.touches[1]];
    const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    onChange(
      clamp({ ...transform, zoom: pinch.current.zoom * (d / pinch.current.dist) }),
    );
  };

  // cover-fit: the short edge fills the slot
  const ratio = photo.width / photo.height;
  const coverW = ratio >= 1 ? `${ratio * 100 * transform.zoom}%` : `${100 * transform.zoom}%`;
  const coverH = ratio >= 1 ? `${100 * transform.zoom}%` : `${(100 / ratio) * transform.zoom}%`;

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={() => (pinch.current = null)}
      className={`no-select relative overflow-hidden ${
        interactive ? (grabbing ? "cursor-grabbing" : "cursor-grab") : ""
      } ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt="Your photo"
        draggable={false}
        style={{
          position: "absolute",
          width: coverW,
          height: coverH,
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${transform.x * 100}%, ${
            transform.y * 100
          }%)`,
          objectFit: "cover",
        }}
      />
    </div>
  );
}
