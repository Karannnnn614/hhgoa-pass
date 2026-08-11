"use client";

import { forwardRef, useEffect, useState } from "react";
import PhotoSlot, { type Transform } from "./PhotoSlot";
import type { Photo } from "@/lib/photo";
import { builderId } from "@/lib/builderClass";
import plate from "@/lib/plate.json";

export type PassData = {
  name: string;
  stack: string;
  handle: string;
  photo: Photo | null;
  transform: Transform;
  qr?: string;
};

/* The card IS the mockup artwork (public/plate.png) with the sample portrait
   and text removed. Everything below is positioned in the plate's own pixel
   space, so text lands exactly where the original design had it. */
export const CARD_W = plate.W;
export const CARD_H = plate.H;

/* Text anchors, measured off the gridded plate. */
const NAME_LEFT = 62;
const NAME_BOTTOM_Y = 1215; // bottom of the role line
/* Canvas ctx.font cannot resolve CSS vars, so name the face literally.
   next/font also registers a metric-matched fallback, so include it — the
   pair is what the .display class actually computes to. */
const DISPLAY_FONT = '"Archivo Black", "Archivo Black Fallback", sans-serif';

/* Name type. 92 is the largest size the design comfortably carries; longer
   names step down from here. Measured, not guessed. */
const NAME_MAX_SIZE = 92;
const NAME_MIN_SIZE = 40;

/* The plate's pink icons are fixed art, so each credential row is centred on
   its icon rather than positioned by guesswork. Icon centres measured off
   the plate: person y=1332, calendar y=1431. */
const ROW_X = 175;
const ID_ROW_CY = 1332;
const DATE_ROW_CY = 1431;
const QR = { x: 648, y: 1280, size: 224 };

/**
 * Largest font size (<= max) at which every line fits within maxWidth.
 * Measured on a canvas with the real display font, so wide names like
 * "KUMARASWAMY" shrink correctly where a character count would not.
 */
/** Measures the widest line and returns the largest size that fits. */
function measureFit(key: string, maxWidth: number, max: number): number {
  if (typeof document === "undefined") return max;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return max;
  const parts = key.split("|").filter(Boolean);
  if (!parts.length) return max;

  for (let s = max; s >= NAME_MIN_SIZE; s--) {
    ctx.font = `400 ${s}px ${DISPLAY_FONT}`;
    if (Math.max(...parts.map((l) => ctx.measureText(l).width)) <= maxWidth) {
      return s;
    }
  }
  return NAME_MIN_SIZE;
}

function useFittedSize(lines: string[], maxWidth: number, max: number): number {
  const key = lines.join("|");
  /* Computed during the initial render, not in an effect: an effect would
     paint one oversized frame first, which the rasteriser can capture. */
  const [size, setSize] = useState(() => measureFit(key, maxWidth, max));

  useEffect(() => {
    const apply = () => setSize(measureFit(key, maxWidth, max));
    apply();
    // Re-measure once the webfont is ready — the first pass may have measured
    // the fallback face.
    document.fonts?.ready.then(apply).catch(() => {});
  }, [key, maxWidth, max]);

  return size;
}

/** One "icon: label / value" row, vertically centred on the plate's icon. */
function CredentialRow({
  x,
  cy,
  label,
  value,
  valueColor,
  valueSize,
}: Readonly<{
  x: number;
  cy: number;
  label: string;
  value: string;
  valueColor: string;
  valueSize: number;
}>) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: x, top: cy, transform: "translateY(-50%)" }}
    >
      <div
        style={{
          fontSize: 25,
          letterSpacing: "0.05em",
          color: "#F2EDE3",
          lineHeight: 1.1,
        }}
      >
        {label}
      </div>
      <div
        className="font-bold"
        style={{
          fontSize: valueSize,
          color: valueColor,
          marginTop: 6,
          lineHeight: 1.1,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function splitName(full: string): [string, string | null] {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ["YOUR", "NAME"];
  if (parts.length === 1) return [parts[0], null];
  return [parts[0], parts.slice(1).join(" ")];
}

const PassCard = forwardRef<
  HTMLDivElement,
  { data: PassData; onTransform?: (t: Transform) => void }
>(function PassCard({ data, onTransform }, ref) {
  const raw = data.name.trim() || "Your Name";
  const [line1, line2] = splitName(raw);
  const stack = data.stack.trim() || "Builder · Developer";
  const handle = data.handle.trim().replace(/^@/, "");
  const id = builderId(raw, handle);

  const roleParts = stack
    .split(/[·•,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const roles = handle ? [...roleParts, `@${handle}`] : roleParts;

  const nameSize = useFittedSize(
    [line1.toUpperCase(), line2?.toUpperCase() ?? ""],
    CARD_W - NAME_LEFT - 78,
    NAME_MAX_SIZE,
  );

  const roleText = roles.join("  •  ");
  // same guard for the role line; it sits on one line and must not overflow
  const roleSize = Math.min(
    28,
    Math.max(19, Math.floor((CARD_W - NAME_LEFT - 78) / (roleText.length * 0.52))),
  );

  return (
    <div
      ref={ref}
      data-card
      style={{ width: CARD_W, height: CARD_H }}
      className="relative overflow-hidden font-sans"
    >
      {/* ---- the user's photo, behind the plate so the plate's ring and
              artwork overlap it exactly as in the original design ---- */}
      <div
        className="absolute overflow-hidden rounded-full"
        style={{
          left: plate.photo.cx - plate.photo.r,
          top: plate.photo.cy - plate.photo.r,
          width: plate.photo.r * 2,
          height: plate.photo.r * 2,
          background: "#0A1F1C",
        }}
      >
        {data.photo && (
          <PhotoSlot
            photo={data.photo}
            transform={data.transform}
            onChange={onTransform}
            interactive={!!onTransform}
            className="h-full w-full"
          />
        )}
      </div>

      {/* ---- the artwork plate ---- */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/plate.png"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0"
        style={{ width: CARD_W, height: CARD_H }}
      />

      {/* ---- live text ---- */}
      {/* name + role, bottom-anchored so 1- and 2-line names both sit right */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: NAME_LEFT,
          right: 70,
          bottom: CARD_H - NAME_BOTTOM_Y,
        }}
      >
        <div
          className="display"
          style={{
            fontSize: nameSize,
            lineHeight: 1.0,
            color: "#F2E2BC",
            letterSpacing: "-0.01em",
          }}
        >
          {line1.toUpperCase()}
          {line2 && (
            <>
              <br />
              {line2.toUpperCase()}
            </>
          )}
        </div>

        <div
          className="flex flex-wrap items-center"
          style={{ marginTop: 20, fontSize: roleSize, color: "#F2EDE3", gap: 12 }}
        >
          {roles.map((rItem, i) => (
            <span
              key={rItem + i}
              className="flex items-center"
              style={{ gap: 12 }}
            >
              {i > 0 && <span style={{ color: "#E8336E" }}>•</span>}
              <span>{rItem}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Credential rows. Each is vertically centred on its plate icon via
          translateY(-50%), so the label/value pair can never drift into the
          row below regardless of font size. */}
      <CredentialRow
        x={ROW_X}
        cy={ID_ROW_CY}
        label="BUILDER ID"
        value={id}
        valueColor="#F2762F"
        valueSize={34}
      />
      <CredentialRow
        x={ROW_X}
        cy={DATE_ROW_CY}
        label="EVENT DATES"
        value="28 OCT – 31 OCT 2026"
        valueColor="#F2EDE3"
        valueSize={32}
      />

      {/* QR */}
      {data.qr && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.qr}
          alt=""
          aria-hidden
          className="pointer-events-none absolute"
          style={{ left: QR.x, top: QR.y, width: QR.size, height: QR.size }}
        />
      )}
    </div>
  );
});

export default PassCard;
