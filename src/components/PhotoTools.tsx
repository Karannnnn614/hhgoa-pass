"use client";

import type { Transform } from "./PhotoSlot";

function Btn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-cream/25 text-lg font-bold text-cream transition hover:border-pink hover:bg-pink/10 active:scale-95"
    >
      {children}
    </button>
  );
}

/** Visible controls for the photo slot — zoom, nudge, rotate-free reset. */
export default function PhotoTools({
  transform,
  onChange,
  onReplace,
}: {
  transform: Transform;
  onChange: (t: Transform) => void;
  onReplace: () => void;
}) {
  const clamp = (t: Transform): Transform => {
    const over = (t.zoom - 1) / 2 + 0.35;
    return {
      zoom: Math.min(3, Math.max(1, t.zoom)),
      x: Math.min(over, Math.max(-over, t.x)),
      y: Math.min(over, Math.max(-over, t.y)),
    };
  };

  const nudge = (dx: number, dy: number) =>
    onChange(clamp({ ...transform, x: transform.x + dx, y: transform.y + dy }));

  return (
    <div className="rounded-2xl border-2 border-cream/15 bg-ink/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-[0.24em] text-cream/55">
          ADJUST PHOTO
        </span>
        <button
          onClick={() => onChange({ x: 0, y: 0, zoom: 1 })}
          className="text-xs text-cream/50 underline underline-offset-4 hover:text-cream"
        >
          Reset
        </button>
      </div>

      {/* zoom */}
      <label className="block">
        <div className="mb-2 flex items-center justify-between text-xs text-cream/70">
          <span>Zoom</span>
          <span className="tabular-nums text-orange">
            {transform.zoom.toFixed(2)}×
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={transform.zoom}
          onChange={(e) =>
            onChange(clamp({ ...transform, zoom: Number(e.target.value) }))
          }
          className="w-full accent-pink"
        />
      </label>

      {/* nudge pad */}
      <div className="mt-5 flex items-center gap-5">
        <div className="grid grid-cols-3 gap-1.5">
          <div />
          <Btn onClick={() => nudge(0, -0.04)} label="Move photo up">
            ↑
          </Btn>
          <div />
          <Btn onClick={() => nudge(-0.04, 0)} label="Move photo left">
            ←
          </Btn>
          <Btn onClick={() => onChange({ x: 0, y: 0, zoom: transform.zoom })} label="Centre photo">
            ·
          </Btn>
          <Btn onClick={() => nudge(0.04, 0)} label="Move photo right">
            →
          </Btn>
          <div />
          <Btn onClick={() => nudge(0, 0.04)} label="Move photo down">
            ↓
          </Btn>
          <div />
        </div>

        <div className="flex-1 space-y-2">
          <button
            onClick={onReplace}
            className="w-full rounded-lg border-2 border-cream/25 px-3 py-2.5 text-sm font-bold text-cream transition hover:border-cream/50"
          >
            Replace photo
          </button>
          <p className="text-[11px] leading-snug text-cream/45">
            Or drag the photo on the card, and scroll / pinch to zoom.
          </p>
        </div>
      </div>
    </div>
  );
}
