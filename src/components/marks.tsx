/* Line-art marks drawn to match the event identity: single-stroke,
   pink/orange, no fills. Used on the card and the hero. */

export function HouseMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" fill="none" className={className} aria-hidden>
      {/* sun rising behind the roof */}
      <circle cx="46" cy="18" r="10" stroke="#F5A03C" strokeWidth="1.7" />

      {/* palm, left */}
      <path d="M11 50V27" stroke="#E8336E" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M11 27c-6-5-9-3-10 1M11 27c6-5 9-3 10 1M11 27c-3-6 0-9 3-10M11 27c3-5 7-5 10-3"
        stroke="#E8336E"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Goan house: wide body, tiled roof, arched openings */}
      <path
        d="M18 50V29l16-9 16 9v21"
        stroke="#F5A03C"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* roof eave line */}
      <path
        d="M15 30l19-11 19 11"
        stroke="#F5A03C"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* ground */}
      <path d="M12 50h44" stroke="#F5A03C" strokeWidth="1.8" strokeLinecap="round" />
      {/* arched doorway */}
      <path
        d="M30 50v-9a4 4 0 0 1 8 0v9"
        stroke="#E8336E"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* arched windows */}
      <path
        d="M22 40v-4a2.5 2.5 0 0 1 5 0v4ZM41 40v-4a2.5 2.5 0 0 1 5 0v4Z"
        stroke="#E8336E"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* roof tile ticks */}
      <path
        d="M24 26l2-2M30 24l2-2M36 24l2-2M42 26l2-2"
        stroke="#E8336E"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SunsetSeal({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} style={style} aria-hidden>
      <circle cx="48" cy="48" r="45" stroke="#F5E9CF" strokeWidth="1.2" opacity="0.55" />
      <defs>
        {/* top arc reads left-to-right across the top */}
        <path id="sealTop" d="M11 48a37 37 0 0 1 74 0" fill="none" />
        {/* bottom arc: swept counter-clockwise so glyphs sit upright */}
        <path id="sealBottom" d="M11 48a37 37 0 0 0 74 0" fill="none" />
      </defs>
      <text fill="#F5E9CF" fontSize="10" fontWeight="700" letterSpacing="2.6">
        <textPath href="#sealTop" startOffset="50%" textAnchor="middle">
          BUILD · SHIP
        </textPath>
      </text>
      <text fill="#F5E9CF" fontSize="10" fontWeight="700" letterSpacing="2.6">
        <textPath href="#sealBottom" startOffset="50%" textAnchor="middle">
          · SUNSET ·
        </textPath>
      </text>
      {/* little sun */}
      <circle cx="48" cy="50" r="8" stroke="#F5A03C" strokeWidth="1.6" />
      <path
        d="M48 36v-5M48 69v5M34 50h-5M67 50h5M38 40l-3.5-3.5M58 40l3.5-3.5"
        stroke="#F5A03C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PalmMark({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 40 56" fill="none" className={className} style={style} aria-hidden>
      <path d="M20 54V20" stroke="#F5A03C" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M20 20c-7-6-13-4-16 0M20 20c7-6 13-4 16 0M20 20c-3-7 0-11 4-13M20 20c3-6 8-7 12-5"
        stroke="#F5A03C"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WaveMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={className} aria-hidden>
      <path
        d="M0 12c10-10 20 10 30 0s20 10 30 0 20 10 30 0 20 10 30 0"
        stroke="#E8336E"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PersonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="#E8336E" strokeWidth="1.8" />
      <path
        d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"
        stroke="#E8336E"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2.5"
        stroke="#E8336E"
        strokeWidth="1.8"
      />
      <path
        d="M3 10h18M8 3v4M16 3v4"
        stroke="#E8336E"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2"
        stroke="#E8336E"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BirdMark({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 40 16" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M2 10c5 0 6-6 9-6s4 6 9 6"
        stroke="#E8336E"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HHLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 46 26" fill="none" className={className} aria-hidden>
      <path
        d="M3 3v20M3 13h11M14 3v20"
        stroke="#F5A03C"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M25 3v20M25 13h11M36 3v20"
        stroke="#E8336E"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M20 2l-2 22" stroke="#F5E9CF" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
