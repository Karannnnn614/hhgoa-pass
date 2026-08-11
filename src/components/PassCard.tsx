"use client";

import { forwardRef } from "react";
import PhotoSlot, { type Transform } from "./PhotoSlot";
import type { Photo } from "@/lib/photo";
import plate from "@/lib/plate.json";

export type PassData = {
  firstName: string;
  lastName: string;
  profileTitle: string;
  teamName: string;
  xUsername: string;
  passId: string;
  photo: Photo | null;
  transform: Transform;
  qr?: string;
};

export const CARD_W = plate.W; // 1024
export const CARD_H = plate.H; // 1536

function PlaceholderGraphic() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full">
      <rect width="400" height="400" fill="#E3F5FF" />
      <path
        d="M 160 140 C 160 120, 185 105, 210 105 C 230 105, 245 115, 250 130 C 260 128, 275 135, 278 148 C 282 160, 272 172, 255 172 L 150 172 C 135 172, 125 160, 132 148 C 138 138, 148 138, 160 140 Z"
        fill="#FFFFFF"
      />
      <path
        d="M -20 280 Q 120 200 240 270 Q 320 320 420 240 L 420 420 L -20 420 Z"
        fill="#8AAE00"
      />
      <path
        d="M -20 330 Q 160 260 420 300 L 420 420 L -20 420 Z"
        fill="#729800"
      />
    </svg>
  );
}

const PassCard = forwardRef<
  HTMLDivElement,
  { data: PassData; onTransform?: (t: Transform) => void }
>(function PassCard({ data, onTransform }, ref) {
  const firstName = data.firstName.trim().toUpperCase();
  const lastName = data.lastName.trim().toUpperCase();
  const profileTitle = data.profileTitle.trim();
  const teamName = data.teamName.trim().toUpperCase();

  const cleanHandle = data.xUsername.trim().replace(/^@/, "");
  const xUsername = cleanHandle ? `@${cleanHandle.toUpperCase()}` : "";
  const passId = data.passId || "HHG26-BLD-1047";

  const titleParts = profileTitle
    ? profileTitle
      .split(/[•·|-]/)
      .map((s) => s.trim())
      .filter(Boolean)
    : [];

  return (
    <div
      ref={ref}
      data-card
      style={{ width: CARD_W, height: CARD_H, backgroundColor: "#00161A" }}
      className="relative overflow-hidden font-sans select-none"
    >
      {/* 1. Dynamic Profile Photo (Layered UNDER the base plate) */}
      <div
        className="absolute overflow-hidden rounded-full"
        style={{
          left: 160.5,
          top: 399,
          width: 382,
          height: 382,
          backgroundColor: "#E3F5FF",
          zIndex: 1,
        }}
      >
        {data.photo ? (
          <PhotoSlot
            photo={data.photo}
            transform={data.transform}
            onChange={onTransform}
            interactive={!!onTransform}
            className="h-full w-full"
          />
        ) : (
          <PlaceholderGraphic />
        )}
      </div>

      {/* 2. Base Artwork Plate Overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/base_plate.png"
        alt="Builder Pass Background"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ zIndex: 2 }}
      />

      {/* 3. Name Block */}
      <div
        className="pointer-events-none absolute flex flex-col justify-start"
        style={{
          left: 151,
          top: 940,
          width: 520,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
            fontSize: 58,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "0.01em",
            color: "#F8E7B9",
            textTransform: "uppercase",
            wordBreak: "break-word",
          }}
        >
          {firstName || "YOUR"}
          <br />
          {lastName || "NAME"}
        </h1>
      </div>

      {/* 4. Profile Titles / Roles */}
      <div
        className="pointer-events-none absolute flex items-center"
        style={{
          left: 151,
          top: 1082,
          width: 600,
          zIndex: 10,
        }}
      >
        {titleParts.length > 0 && (
          <p
            className="flex flex-wrap items-center font-bold"
            style={{
              fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
              fontSize: 22,
              color: "#F8E7B9",
              gap: 10,
            }}
          >
            {titleParts.map((part, i) => (
              <span key={i} className="flex items-center" style={{ gap: 10 }}>
                {i > 0 && <span style={{ color: "#F8E7B9" }}>-</span>}
                <span>{part}</span>
              </span>
            ))}
          </p>
        )}
      </div>

      {/* 5. Team Name */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: 238,
          top: 1184,
          width: 380,
          zIndex: 10,
        }}
      >
        {teamName && (
          <span
            className="block font-bold tracking-wide"
            style={{
              fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
              fontSize: 22,
              color: "#F8E7B9",
              textTransform: "uppercase",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {teamName}
          </span>
        )}
      </div>

      {/* 6. X Username */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: 238,
          top: 1272,
          width: 380,
          zIndex: 10,
        }}
      >
        {xUsername && (
          <span
            className="block font-bold tracking-wide"
            style={{
              fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
              fontSize: 22,
              color: "#F8E7B9",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {xUsername}
          </span>
        )}
      </div>

      {/* 7. QR Code Area */}
      {data.qr && (
        <div
          className="pointer-events-none absolute overflow-hidden rounded-md"
          style={{
            left: 672,
            top: 1148,
            width: 136,
            height: 136,
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.qr}
            alt="Pass QR Code"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {/* 8. Pass ID */}
      <div
        className="pointer-events-none absolute text-center"
        style={{
          left: 635,
          top: 1302,
          width: 210,
          zIndex: 10,
        }}
      >
        <span
          className="block font-mono font-bold"
          style={{
            fontFamily: 'var(--font-mono), "Space Mono", "Courier New", monospace',
            fontSize: 18,
            letterSpacing: "0.06em",
            color: "#FF914D",
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {passId}
        </span>
      </div>
    </div>
  );
});

export default PassCard;
