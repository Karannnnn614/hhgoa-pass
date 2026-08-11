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
  qr?: string; // data-url, generated async
};

/**
 * Splits a name across the design's two stacked lines. A single-word name
 * stays on one line — never pad it with a placeholder second line.
 */
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

  // Role line: mockup shows "Builder • Developer • AI/ML"
  const roleParts = stack
    .split(/[·•,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const roles = handle ? [...roleParts, `@${handle}`] : roleParts;

  const longest = Math.max(line1.length, line2?.length ?? 0);
  const nameSize = longest > 11 ? 84 : longest > 8 ? 100 : 118;

  return (
    <div
      ref={ref}
      data-card
      style={{ width: 1200, height: 1500, background: "#0B2420" }}
      className="relative overflow-hidden font-sans"
    >
      {/* ================= BACKGROUND ================= */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(172deg,#0C2723 0%,#0B2420 55%,#081D1A 100%)",
        }}
      />

      {/* teal cut-paper waves behind the photo */}
      <svg
        viewBox="0 0 1200 1500"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* upper teal band */}
        <path
          d="M96 430c70-36 150 10 210 44 90 50 150 96 128 150-20 50-120 58-210 34-96-26-160-70-166-130-4-44 12-76 38-98Z"
          fill="#1B5E63"
          opacity="0.55"
        />
        {/* broad mid wave */}
        <path
          d="M0 640c150-60 260 30 420 40 180 12 300-70 470-52 130 14 230 70 310 56v816H0Z"
          fill="#0E2C28"
        />
        <path
          d="M0 700c170-56 280 40 450 44 190 4 300-72 470-50 120 16 210 64 280 52v754H0Z"
          fill="#0A211E"
        />
      </svg>

      {/* sunset disc */}
      <div
        className="absolute"
        style={{
          left: 636,
          top: 470,
          width: 190,
          height: 190,
          borderRadius: "50%",
          background: "linear-gradient(180deg,#F5842C 0%,#F0682F 100%)",
        }}
      />
      {/* coral hill under the sun */}
      <svg
        className="absolute"
        style={{ left: 560, top: 600, width: 420, height: 120 }}
        viewBox="0 0 420 120"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 90c60-52 120-40 180-6 50 28 110 30 160 4 30-16 60-18 80-8v40H0V90Z"
          fill="#E8593C"
          opacity="0.9"
        />
      </svg>

      {/* birds */}
      <BirdMark className="absolute" style={{ left: 640, top: 452, width: 48 }} />
      <BirdMark className="absolute" style={{ left: 700, top: 430, width: 34 }} />

      {/* palm right of the sun */}
      <PalmMark
        className="absolute"
        style={{ left: 900, top: 430, width: 150, height: 210 }}
      />

      {/* ================= HEADER ================= */}
      {/* lanyard slot */}
      <div
        className="absolute"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          top: 58,
          width: 250,
          height: 46,
          borderRadius: 999,
          background: "#F3EDE4",
          border: "3px solid #16332C",
        }}
      />

      <div
        className="absolute font-bold"
        style={{
          right: 78,
          top: 92,
          fontSize: 30,
          letterSpacing: "0.18em",
          color: "#F5A03C",
        }}
      >
        BUILDER
      </div>

      {/* logo lockup */}
      <div className="absolute flex items-start gap-7" style={{ left: 84, top: 182 }}>
        <HouseMark className="h-28 w-28" />
        <div style={{ paddingTop: 4 }}>
          <div
            className="display"
            style={{ fontSize: 58, lineHeight: 0.9, color: "#F3EDE0" }}
          >
            Hacker
            <br />
            House
          </div>
          <div
            className="font-bold"
            style={{
              marginTop: 12,
              fontSize: 21,
              letterSpacing: "0.16em",
              color: "#E8336E",
            }}
          >
            GOA <span style={{ color: "#F5A03C" }}>·</span> INDIA{" "}
            <span style={{ color: "#F5A03C" }}>·</span> 2026
          </div>
        </div>
      </div>

      {/* small palm + seal, right */}
      <PalmMark
        className="absolute"
        style={{ right: 88, top: 176, width: 34, height: 48 }}
      />
      <SunsetSeal className="absolute" style={{ right: 74, top: 258, width: 140, height: 140 }} />

      {/* ================= PHOTO ================= */}
      <div className="absolute" style={{ left: 168, top: 420 }}>
        <div
          className="relative rounded-full"
          style={{
            width: 400,
            height: 400,
            padding: 4,
            background: "#F5A03C",
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

      {/* ================= COCONUT ISLAND ================= */}
      <CoconutIsland
        className="absolute"
        style={{ right: 58, top: 620, width: 470, height: 440 }}
      />

      {/* dotted path */}
      <svg
        className="absolute"
        style={{ left: 90, top: 640, width: 1020, height: 400 }}
        viewBox="0 0 1020 400"
        fill="none"
        aria-hidden
      >
        <path
          d="M18 40C60 150 180 190 300 210s260 30 340 90 180 70 340 30"
          stroke="#F5A03C"
          strokeWidth="5"
          strokeDasharray="1 22"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      {/* ================= NAME =================
          Bottom-anchored so one-line and two-line names both sit flush
          above the credential box. */}
      <div className="absolute" style={{ left: 84, right: 84, bottom: 424 }}>
        <div
          className="display"
          style={{ fontSize: nameSize, lineHeight: 0.92, color: "#F3E4C4" }}
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
          className="mt-6 flex flex-wrap items-center"
          style={{
            // shrink the role line as it gets longer so it never wraps
            // into the credential box below
            fontSize: roles.join(" • ").length > 34 ? 24 : 30,
            color: "#F3EDE0",
            gap: 14,
            maxWidth: 1032,
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

      {/* ================= CREDENTIAL BOX ================= */}
      <div
        className="absolute rounded-[26px]"
        style={{
          left: 84,
          right: 84,
          top: 1180,
          height: 216,
          border: "2px solid rgba(243,237,224,0.28)",
        }}
      >
        <div className="flex h-full items-center justify-between px-10">
          <div className="flex flex-col justify-center" style={{ gap: 26 }}>
            <div className="flex items-center" style={{ gap: 18 }}>
              <PersonIcon className="h-9 w-9 shrink-0" />
              <div>
                <div
                  style={{
                    fontSize: 20,
                    letterSpacing: "0.14em",
                    color: "#F3EDE0",
                    opacity: 0.9,
                  }}
                >
                  BUILDER ID
                </div>
                <div
                  className="font-bold"
                  style={{ fontSize: 30, color: "#F5A03C", marginTop: 4 }}
                >
                  {id}
                </div>
              </div>
            </div>

            <div className="flex items-center" style={{ gap: 18 }}>
              <CalendarIcon className="h-9 w-9 shrink-0" />
              <div>
                <div
                  style={{
                    fontSize: 20,
                    letterSpacing: "0.14em",
                    color: "#F3EDE0",
                    opacity: 0.9,
                  }}
                >
                  EVENT DATES
                </div>
                <div
                  className="font-bold"
                  style={{ fontSize: 28, color: "#F3EDE0", marginTop: 4 }}
                >
                  28 OCT – 31 OCT 2026
                </div>
              </div>
            </div>
          </div>

          {/* QR */}
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 168, height: 168, background: "#F3E4C4" }}
          >
            {data.qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.qr}
                alt=""
                style={{ width: 156, height: 156 }}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div
        className="absolute flex items-center justify-between"
        style={{ left: 84, right: 84, bottom: 44 }}
      >
        <div className="flex items-center" style={{ gap: 16 }}>
          <HHLogo className="h-11 w-20" />
          <span
            className="font-bold"
            style={{
              fontSize: 22,
              letterSpacing: "0.18em",
              color: "#F3EDE0",
              opacity: 0.85,
            }}
          >
            GOA 2026
          </span>
        </div>
        <div
          className="font-bold"
          style={{ fontSize: 22, letterSpacing: "0.12em" }}
        >
          <span style={{ color: "#F3EDE0" }}>CODE. BUILD. </span>
          <span style={{ color: "#F5A03C" }}>SUNSET. </span>
          <span style={{ color: "#F3EDE0" }}>REPEAT.</span>
        </div>
      </div>
    </div>
  );
});

export default PassCard;
