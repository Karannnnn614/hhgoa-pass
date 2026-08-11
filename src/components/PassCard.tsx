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
      {/* Cloud */}
      <path
        d="M 160 140 C 160 120, 185 105, 210 105 C 230 105, 245 115, 250 130 C 260 128, 275 135, 278 148 C 282 160, 272 172, 255 172 L 150 172 C 135 172, 125 160, 132 148 C 138 138, 148 138, 160 140 Z"
        fill="#FFFFFF"
      />
      {/* Hills */}
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
  const passId = data.passId || "HH26-BLD-1047";

  // Parse title into parts for pink bullet separator styling
  const titleParts = profileTitle
    ? profileTitle
        .split(/[•·|]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      ref={ref}
      data-card
      style={{ width: CARD_W, height: CARD_H }}
      className="relative overflow-hidden font-sans select-none"
    >
      {/* 1. Base artwork plate (static design from reference/1.png) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/base_plate.png"
        alt="Builder Pass Background"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* 2. Dynamic Profile Photo Area (inside olive green/white ring) */}
      <div
        className="absolute overflow-hidden rounded-full"
        style={{
          left: plate.photo.cx - plate.photo.r, // 157.5px
          top: plate.photo.cy - plate.photo.r,  // 395px
          width: plate.photo.r * 2,             // 390px
          height: plate.photo.r * 2,            // 390px
          backgroundColor: "#E3F5FF",
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

      {/* 3. Dynamic Name (First Name & Last Name on separate lines) */}
      <div
        className="pointer-events-none absolute flex flex-col justify-start"
        style={{
          left: 148,
          top: 932,
          width: 500,
        }}
      >
        <h1
          className="font-black tracking-tight"
          style={{
            fontFamily: 'var(--font-display), "Archivo Black", sans-serif',
            fontSize: 82,
            lineHeight: 0.96,
            color: "#F5E8C8",
            textTransform: "uppercase",
            wordBreak: "break-word",
          }}
        >
          {firstName || "YOUR"}
          <br />
          {lastName || "NAME"}
        </h1>
      </div>

      {/* 4. Dynamic Profile Title / Roles Line */}
      <div
        className="pointer-events-none absolute flex items-center"
        style={{
          left: 148,
          top: 1090,
          width: 600,
        }}
      >
        {titleParts.length > 0 && (
          <p
            className="flex flex-wrap items-center font-bold tracking-normal"
            style={{
              fontSize: 25,
              color: "#F5E8C8",
              gap: 10,
            }}
          >
            {titleParts.map((part, i) => (
              <span key={i} className="flex items-center" style={{ gap: 10 }}>
                {i > 0 && <span style={{ color: "#FF4265" }}>•</span>}
                <span>{part}</span>
              </span>
            ))}
          </p>
        )}
      </div>

      {/* 5. Dynamic Team Name */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: 238,
          top: 1195,
          width: 360,
        }}
      >
        {teamName && (
          <span
            className="block font-extrabold tracking-wide"
            style={{
              fontSize: 27,
              color: "#F5E8C8",
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

      {/* 6. Dynamic X Username */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: 238,
          top: 1274,
          width: 360,
        }}
      >
        {xUsername && (
          <span
            className="block font-extrabold tracking-wide"
            style={{
              fontSize: 27,
              color: "#F5E8C8",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {xUsername}
          </span>
        )}
      </div>

      {/* 7. Dynamic QR Code */}
      {data.qr && (
        <div
          className="pointer-events-none absolute overflow-hidden rounded-md"
          style={{
            left: 672,
            top: 1152,
            width: 152,
            height: 152,
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

      {/* 8. Dynamic Pass ID */}
      <div
        className="pointer-events-none absolute text-center"
        style={{
          left: 645,
          top: 1330,
          width: 206,
        }}
      >
        <span
          className="block font-mono font-bold tracking-wider"
          style={{
            fontFamily: 'var(--font-mono), "Space Mono", "Courier New", monospace',
            fontSize: 21,
            color: "#FF7A32",
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
