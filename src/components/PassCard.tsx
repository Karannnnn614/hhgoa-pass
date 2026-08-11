"use client";

import { forwardRef, useEffect, useState } from "react";
import PhotoSlot, { type Transform } from "./PhotoSlot";
import type { Photo } from "@/lib/photo";
import { builderId } from "@/lib/builderClass";
import plate from "@/lib/plate.json";

export type PassData = {
  name: string;
  title: string;
  team: string;
  handle: string;
  stack: string;
  photo: Photo | null;
  transform: Transform;
};

/* The card IS the frame artwork (public/plate.png) with the placeholder text
   removed. Everything below is positioned in the plate's own pixel space, so
   text lands exactly where the design intends. */
export const CARD_W = plate.W;
export const CARD_H = plate.H;

/* Anchors measured off a gridded render of the frame (1000x1632). */
const PAD_L = 78;
const NAME_BOTTOM = 1268; // name/title block sits just above the bottom box
const ROW_X = 170; // label column, right of the pink icons
const TEAM_ROW_CY = 1322;
const HANDLE_ROW_CY = 1418;
const ID_RIGHT = 96; // builder id, right side of the bottom box

/* Canvas ctx.font cannot resolve CSS vars, so name the face literally.
   next/font also registers a metric-matched fallback. */
const DISPLAY_FONT = '"Archivo Black", "Archivo Black Fallback", sans-serif';
const NAME_MAX_SIZE = 86;
const NAME_MIN_SIZE = 34;

function splitName(full: string): [string, string | null] {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ["YOUR", "NAME"];
  if (parts.length === 1) return [parts[0], null];
  return [parts[0], parts.slice(1).join(" ")];
}

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
    document.fonts?.ready.then(apply).catch(() => {});
  }, [key, maxWidth, max]);

  return size;
}

/** One row in the bottom box, centred on its printed icon. */
function BoxRow({
  cy,
  label,
  value,
}: Readonly<{ cy: number; label: string; value: string }>) {
  return (
    <div
      className="pointer-events-none absolute text-left"
      style={{ left: ROW_X, top: cy, transform: "translateY(-50%)" }}
    >
      <div
        style={{
          fontSize: 23,
          letterSpacing: "0.14em",
          color: "#F2EDE3",
          opacity: 0.62,
          lineHeight: 1.1,
        }}
      >
        {label}
      </div>
      <div
        className="font-bold"
        style={{
          fontSize: 34,
          color: "#F2EDE3",
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

const PassCard = forwardRef<
  HTMLDivElement,
  { data: PassData; onTransform?: (t: Transform) => void }
>(function PassCard({ data, onTransform }, ref) {
  const raw = data.name.trim() || "Your Name";
  const [line1, line2] = splitName(raw);
  const handle = data.handle.trim().replace(/^@/, "");
  const team = data.team.trim();
  const stack = data.stack.trim();
  // "Builder" is the default title, per the design.
  const title = data.title.trim() || "Builder";
  const id = builderId(raw, handle);

  const nameSize = useFittedSize(
    [line1.toUpperCase(), line2?.toUpperCase() ?? ""],
    CARD_W - PAD_L - 90,
    NAME_MAX_SIZE,
  );

  // Title line: title, then stack verbatim if given (no separator parsing —
  // whatever the user typed is exactly what prints).
  const subtitle = [title, stack].filter(Boolean).join("  ·  ");
  const subSize = subtitle.length > 40 ? 26 : 31;

  return (
    <div
      ref={ref}
      data-card
      style={{ width: CARD_W, height: CARD_H }}
      // text-left is explicit: the card must not inherit the page's
      // text-center, or every field drifts out of its designed slot.
      className="relative overflow-hidden text-left font-sans"
    >
      {/* the user's photo, behind the plate so the frame's green ring and
          artwork overlap it exactly as designed */}
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

      {/* the frame artwork */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/plate.png"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0"
        style={{ width: CARD_W, height: CARD_H }}
      />

      {/* ---- name + title, in the open area above the box ---- */}
      <div
        className="pointer-events-none absolute"
        style={{ left: PAD_L, right: 90, bottom: CARD_H - NAME_BOTTOM }}
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
          style={{
            marginTop: 18,
            fontSize: subSize,
            color: "#F2762F",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* ---- bottom box rows ---- */}
      <BoxRow cy={TEAM_ROW_CY} label="TEAM NAME" value={team || "—"} />
      <BoxRow
        cy={HANDLE_ROW_CY}
        label="X USERNAME"
        value={handle ? `@${handle}` : "—"}
      />

      {/* ---- builder id, right side of the bottom box ----
             The footer band is already full (HH · dates · tagline), so the
             credential lives in the box with the other identity fields. */}
      <div
        className="pointer-events-none absolute text-right"
        style={{
          right: ID_RIGHT,
          top: TEAM_ROW_CY,
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            fontSize: 23,
            letterSpacing: "0.14em",
            color: "#F2EDE3",
            opacity: 0.62,
            lineHeight: 1.1,
          }}
        >
          BUILDER ID
        </div>
        <div
          className="font-bold"
          style={{
            fontSize: 32,
            color: "#F2762F",
            marginTop: 6,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          {id}
        </div>
      </div>
    </div>
  );
});

export default PassCard;
