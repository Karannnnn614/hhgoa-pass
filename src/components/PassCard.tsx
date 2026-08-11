"use client";

import { forwardRef } from "react";
import PhotoSlot, { type Transform } from "./PhotoSlot";
import type { Photo } from "@/lib/photo";
import { builderId } from "@/lib/builderClass";
import CoconutIsland from "./CoconutIsland";
import {
  HouseMark,
  SunsetSeal,
  PalmMark,
  HHLogo,
  PersonIcon,
  CalendarIcon,
  BirdMark,
} from "./marks";

export type PassData = {
  name: string;
  stack: string;
  handle: string;
  photo: Photo | null;
  transform: Transform;
  qr?: string;
};

/* Card is authored at 1000x1500 (2:3, matching the reference badge) and
   exported at 2x. Every coordinate below is measured off the reference. */
export const CARD_W = 1000;
export const CARD_H = 1500;

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
  let nameSize = 92;
  if (longest > 11) nameSize = 74;
  else if (longest > 8) nameSize = 84;
  const roleSize = roles.join(" • ").length > 34 ? 24 : 27;

  return (
    <div
      ref={ref}
      data-card
      style={{ width: CARD_W, height: CARD_H, background: "#0A2622" }}
      className="relative overflow-hidden font-sans"
    >
      {/* ============ GROUND ============ */}
      <div
        className="absolute inset-0"
        style={{ background: "#0A2622" }}
      />

      {/* teal cut-paper waves, upper-left behind the photo */}
      <svg
        viewBox="0 0 1000 1500"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* pale teal sweep */}
        <path
          d="M0 330c90-26 150 18 196 66 44 46 60 104 30 150-32 48-120 60-226 40V330Z"
          fill="#2E7C82"
          opacity="0.62"
        />
        {/* deeper teal band under it */}
        <path
          d="M0 400c86-14 150 34 190 84 40 48 44 104 6 146-40 44-112 52-196 34V400Z"
          fill="#17565C"
          opacity="0.85"
        />
        {/* broad dark wave sweeping right, under the sun */}
        <path
          d="M0 690c120-64 230-6 340 22 120 30 220-40 330-66 96-22 200-6 330 30v824H0V690Z"
          fill="#093F3A"
          opacity="0.62"
        />
        <path
          d="M0 760c130-56 240 10 356 34 126 26 226-42 336-60 92-16 190 0 308 26v740H0V760Z"
          fill="#07302C"
          opacity="0.7"
        />
      </svg>

      {/* ---- sunset disc, right of the photo ---- */}
      <div
        className="absolute"
        style={{
          left: 606,
          top: 486,
          width: 196,
          height: 196,
          borderRadius: "50%",
          background: "#F2762F",
        }}
      />
      {/* coral dune crossing under the sun */}
      <svg
        className="absolute"
        style={{ left: 470, top: 570, width: 420, height: 130 }}
        viewBox="0 0 420 130"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 116c46-56 96-74 150-52 40 16 74 6 104-22 26-24 56-30 90-18l76 30v76H0v-14Z"
          fill="#E8563C"
        />
      </svg>

      {/* birds */}
      <BirdMark
        className="absolute"
        style={{ left: 596, top: 404, width: 52 }}
      />
      <BirdMark
        className="absolute"
        style={{ left: 668, top: 428, width: 34 }}
      />

      {/* palms behind, right */}
      <PalmMark
        className="absolute"
        style={{ left: 806, top: 388, width: 168, height: 226 }}
      />
      <PalmMark
        className="absolute"
        style={{ left: 806, top: 508, width: 104, height: 140 }}
      />

      {/* ============ HEADER ============ */}
      {/* lanyard slot */}
      <div
        className="absolute"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          top: 46,
          width: 214,
          height: 42,
          borderRadius: 999,
          border: "5px solid #F2EDE3",
        }}
      />

      <div
        className="absolute font-bold"
        style={{
          right: 74,
          top: 78,
          fontSize: 30,
          letterSpacing: "0.16em",
          color: "#F2762F",
        }}
      >
        BUILDER
      </div>

      {/* logo lockup */}
      <div
        className="absolute flex items-start"
        style={{ left: 118, top: 128, gap: 30 }}
      >
        <HouseMark style={{ width: 148, height: 130 }} />
        <div style={{ paddingTop: 26 }}>
          <div
            className="display"
            style={{ fontSize: 58, lineHeight: 0.94, color: "#F2EDE3" }}
          >
            Hacker
            <br />
            House
          </div>
          <div
            className="font-bold"
            style={{
              marginTop: 14,
              fontSize: 22,
              letterSpacing: "0.1em",
              color: "#E8336E",
            }}
          >
            GOA <span style={{ color: "#F2762F" }}>·</span> INDIA{" "}
            <span style={{ color: "#F2762F" }}>·</span> 2026
          </div>
        </div>
      </div>

      {/* tiny palm + seal, right */}
      <PalmMark
        className="absolute"
        style={{ right: 86, top: 128, width: 32, height: 46 }}
      />
      <SunsetSeal
        className="absolute"
        style={{ right: 62, top: 226, width: 130, height: 130 }}
      />

      {/* ============ PHOTO ============ */}
      <div className="absolute" style={{ left: 146, top: 352 }}>
        <div
          className="relative rounded-full"
          style={{
            width: 434,
            height: 434,
            padding: 3,
            background: "#F2762F",
          }}
        >
          {data.photo ? (
            <PhotoSlot
              photo={data.photo}
              transform={data.transform}
              onChange={onTransform}
              interactive={!!onTransform}
              className="h-full w-full rounded-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0A1F1C]">
              <PalmMark className="h-40 w-40 opacity-40" />
            </div>
          )}
        </div>
      </div>

      {/* ============ COCONUT ISLAND ============ */}
      <CoconutIsland
        className="absolute"
        style={{ left: 588, top: 664, width: 372, height: 348 }}
      />

      {/* dotted path, sweeping left-to-right under the photo */}
      <svg
        className="absolute"
        style={{ left: 60, top: 620, width: 900, height: 470 }}
        viewBox="0 0 900 470"
        fill="none"
        aria-hidden
      >
        <path
          d="M42 30C22 120 60 190 150 214c96 26 210 6 300 60 84 50 130 128 240 146"
          stroke="#F2762F"
          strokeWidth="5"
          strokeDasharray="0.5 24"
          strokeLinecap="round"
        />
      </svg>

      {/* ============ NAME ============
          Bottom-anchored to the credential box so one- and two-line names
          both sit flush above it and can never overlap. */}
      <div className="absolute" style={{ left: 120, right: 90, bottom: 372 }}>
        <div
          className="display"
          style={{ fontSize: nameSize, lineHeight: 0.98, color: "#F2E2BC" }}
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
          style={{
            marginTop: 22,
            fontSize: roleSize,
            color: "#F2EDE3",
            gap: 14,
          }}
        >
          {roles.map((r, i) => (
            <span key={i} className="flex items-center" style={{ gap: 14 }}>
              {i > 0 && <span style={{ color: "#E8336E" }}>•</span>}
              <span>{r}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============ CREDENTIAL BOX ============ */}
      <div
        className="absolute rounded-[22px]"
        style={{
          left: 120,
          right: 90,
          top: 1160,
          height: 218,
          border: "1.5px solid rgba(242,237,227,0.34)",
        }}
      >
        <div className="flex h-full items-center justify-between px-9">
          <div className="flex flex-col justify-center" style={{ gap: 30 }}>
            <div className="flex items-center" style={{ gap: 20 }}>
              <PersonIcon style={{ width: 38, height: 38, flexShrink: 0 }} />
              <div>
                <div
                  style={{
                    fontSize: 21,
                    letterSpacing: "0.06em",
                    color: "#F2EDE3",
                  }}
                >
                  BUILDER ID
                </div>
                <div
                  className="font-bold"
                  style={{ fontSize: 29, color: "#F2762F", marginTop: 6 }}
                >
                  {id}
                </div>
              </div>
            </div>

            <div className="flex items-center" style={{ gap: 20 }}>
              <CalendarIcon style={{ width: 38, height: 38, flexShrink: 0 }} />
              <div>
                <div
                  style={{
                    fontSize: 21,
                    letterSpacing: "0.06em",
                    color: "#F2EDE3",
                  }}
                >
                  EVENT DATES
                </div>
                <div
                  className="font-bold"
                  style={{ fontSize: 27, color: "#F2EDE3", marginTop: 6 }}
                >
                  28 OCT – 31 OCT 2026
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-center"
            style={{ width: 172, height: 172 }}
          >
            {data.qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.qr} alt="" style={{ width: 172, height: 172 }} />
            ) : null}
          </div>
        </div>
      </div>

      {/* ============ FOOTER ============ */}
      <div
        className="absolute flex items-center justify-between"
        style={{ left: 120, right: 90, bottom: 52 }}
      >
        <div className="flex items-center" style={{ gap: 18 }}>
          <HHLogo style={{ width: 76, height: 42 }} />
          <span
            className="font-bold"
            style={{
              fontSize: 23,
              letterSpacing: "0.1em",
              color: "#F2EDE3",
            }}
          >
            GOA 2026
          </span>
        </div>
        <div
          className="font-bold"
          style={{ fontSize: 23, letterSpacing: "0.06em" }}
        >
          <span style={{ color: "#F2EDE3" }}>CODE. BUILD. </span>
          <span style={{ color: "#F2762F" }}>SUNSET. </span>
          <span style={{ color: "#F2EDE3" }}>REPEAT.</span>
        </div>
      </div>
    </div>
  );
});

export default PassCard;
