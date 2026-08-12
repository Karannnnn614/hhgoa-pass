"use client";

import { forwardRef, useEffect, useState } from "react";
import PhotoSlot, { type Transform } from "./PhotoSlot";
import type { Photo } from "@/lib/photo";
import { builderId } from "@/lib/builderClass";
import plate from "@/lib/plate.json";

export type PassData = {
  name?: string;
  title?: string;
  team?: string;
  handle?: string;
  stack?: string;
  photo: Photo | null;
  transform: Transform;

  firstName?: string;
  lastName?: string;
  profileTitle?: string;
  teamName?: string;
  xUsername?: string;
  passId?: string;
  qr?: string;
};

export const CARD_W = plate.W;
export const CARD_H = plate.H;

/* Anchors measured off a gridded render of the frame (1000x1632). */
const PAD_L = 78;
const NAME_BOTTOM = 1268;
const ROW_X = 170;
const TEAM_ROW_CY = 1338;
const HANDLE_ROW_CY = 1434;
const ID_RIGHT = 96;

const DISPLAY_FONT = '"Roboto Condensed", "Roboto Condensed Fallback", sans-serif';
const NAME_MAX_SIZE = 86;
const NAME_MIN_SIZE = 34;

function splitName(full: string): [string, string | null] {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ["YOUR", "NAME"];
  if (parts.length === 1) return [parts[0], null];
  return [parts[0], parts.slice(1).join(" ")];
}

function measureFit(key: string, maxWidth: number, max: number): number {
  if (typeof document === "undefined") return max;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return max;
  const parts = key.split("|").filter(Boolean);
  if (!parts.length) return max;

  for (let s = max; s >= NAME_MIN_SIZE; s--) {
    ctx.font = `700 ${s}px ${DISPLAY_FONT}`;
    if (Math.max(...parts.map((l) => ctx.measureText(l).width)) <= maxWidth) {
      return s;
    }
  }
  return NAME_MIN_SIZE;
}

function useFittedSize(lines: string[], maxWidth: number, max: number): number {
  const key = lines.join("|");
  const [size, setSize] = useState(() => measureFit(key, maxWidth, max));

  useEffect(() => {
    const apply = () => setSize(measureFit(key, maxWidth, max));
    apply();
    document.fonts?.ready.then(apply).catch(() => {});
  }, [key, maxWidth, max]);

  return size;
}

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
  const rawName = data.name || [data.firstName, data.lastName].filter(Boolean).join(" ");
  const raw = rawName.trim() || "Your Name";
  const [line1, line2] = splitName(raw);
  const handle = (data.handle || data.xUsername || "").trim().replace(/^@/, "");
  const team = (data.team || data.teamName || "").trim();
  const stack = (data.stack || "").trim();
  const title = (data.title || data.profileTitle || "").trim();
  const id = data.passId || builderId(raw, handle);

  const nameSize = useFittedSize(
    [line1.toUpperCase(), line2?.toUpperCase() ?? ""],
    CARD_W - PAD_L - 90,
    NAME_MAX_SIZE,
  );

  const subtitleItems = [title, stack]
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
  const subtitleLength = subtitleItems.join(" · ").length;
  const subSize = subtitleLength > 40 ? 26 : 31;

  // Expansion offset to mask out the inner ring gap baked into plate.png
  const OVERLAP_OFFSET = 8;
  const photoRadius = plate.photo.r + OVERLAP_OFFSET;

  return (
    <div
      ref={ref}
      data-card
      style={{ width: CARD_W, height: CARD_H }}
      className="relative overflow-hidden text-left font-sans"
    >
      {/* Frame artwork */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/plate.png"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 z-0"
        style={{ width: CARD_W, height: CARD_H }}
      />

      {/* Photo Slot (Slightly enlarged and placed over the artwork to mask the inner gap) */}
      <div
        className="absolute overflow-hidden rounded-full z-10"
        style={{
          left: plate.photo.cx - photoRadius,
          top: plate.photo.cy - photoRadius,
          width: photoRadius * 2,
          height: photoRadius * 2,
          background: "#0A1F1C",
          border: "4px solid #8CB83E", // Single clean outer green border
          boxSizing: "border-box",
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

      {/* Name + Title */}
      <div
        className="pointer-events-none absolute z-20"
        style={{ left: PAD_L, right: 90, bottom: CARD_H - NAME_BOTTOM }}
      >
        <div
          style={{
            fontFamily: 'var(--font-roboto-condensed), "Roboto Condensed", sans-serif',
            fontWeight: 800,
            textTransform: "uppercase",
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
            fontFamily: 'var(--font-roboto-condensed), "Roboto Condensed", sans-serif',
            marginTop: 18,
            fontSize: subSize,
            color: "#F2762F",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {subtitleItems.map((item, index) => (
            <span key={`${item}-${index}`}>
              {index > 0 && <span style={{ color: "#FF3F68", margin: "0 12px" }}>•</span>}
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Box Rows */}
      <div className="z-20 relative">
        <BoxRow cy={TEAM_ROW_CY} label="TEAM NAME" value={team || "—"} />
        <BoxRow
          cy={HANDLE_ROW_CY}
          label="X USERNAME"
          value={handle ? `@${handle}` : "—"}
        />
      </div>

      {/* Builder ID & QR */}
      <div
        className="pointer-events-none absolute z-20 flex flex-col items-end text-right"
        style={{
          right: ID_RIGHT,
          top: 1388,
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
            marginTop: 4,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          {id}
        </div>
        {data.qr && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={data.qr}
            alt="Pass QR Code"
            className="mt-2.5 rounded-lg border border-[#F2EDE3]/25 p-1 bg-[#00161A]"
            style={{ width: 120, height: 120 }}
          />
        )}
      </div>
    </div>
  );
});

export default PassCard;
