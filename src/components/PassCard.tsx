"use client";

import { forwardRef } from "react";
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
const NAME_BOTTOM_Y = 1190; // baseline block bottom of the role line
const ID_X = 175;
const ID_Y = 1318;
const DATE_X = 175;
const DATE_Y = 1412;
const QR = { x: 645, y: 1272, size: 232 };

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
  const id = builderId(raw, stack);

  const roleParts = stack
    .split(/[·•,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const roles = handle ? [...roleParts, `@${handle}`] : roleParts;

  const longest = Math.max(line1.length, line2?.length ?? 0);
  let nameSize = 104;
  if (longest > 12) nameSize = 76;
  else if (longest > 9) nameSize = 90;

  const roleText = roles.join("  •  ");
  const roleSize = roleText.length > 34 ? 26 : 31;

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

      {/* builder id value */}
      <div
        className="pointer-events-none absolute font-bold"
        style={{ left: ID_X, top: ID_Y, fontSize: 34, color: "#F2762F" }}
      >
        {id}
      </div>

      {/* event dates value */}
      <div
        className="pointer-events-none absolute font-bold"
        style={{ left: DATE_X, top: DATE_Y, fontSize: 32, color: "#F2EDE3" }}
      >
        28 OCT – 31 OCT 2026
      </div>

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
