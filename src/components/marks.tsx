/* Line-art marks matched to the reference badge: single-stroke, pink/orange,
   no fills. Every mark takes className + style so it can be absolutely
   positioned on the card. */

type MarkProps = { className?: string; style?: React.CSSProperties };

export function HouseMark({ className = "", style }: MarkProps) {
  return (
    <svg
      viewBox="0 0 120 106"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* sun arc rising behind the roof, right */}
      <path
        d="M74 44a26 26 0 0 1 44-18"
        stroke="#F2762F"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* palm, left */}
      <path
        d="M22 96V34"
        stroke="#E8336E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22 34C13 24 5 25 1 31M22 34c9-10 17-9 21-3M22 34c-4-12 1-19 8-22M22 34c6-10 15-11 22-6"
        stroke="#E8336E"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Goan house: wide body, low pitched roof, arcade of arches */}
      <path
        d="M34 96V50l32-22 32 22v46"
        stroke="#E8336E"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* roof overhang */}
      <path
        d="M28 52 66 25l38 27"
        stroke="#E8336E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* ground line */}
      <path
        d="M24 96h84"
        stroke="#E8336E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* arcade: three arched openings */}
      <path
        d="M44 96V72a7 7 0 0 1 14 0v24M60 96V72a7 7 0 0 1 14 0v24M76 96V72a7 7 0 0 1 14 0v24"
        stroke="#E8336E"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* roof detail ticks */}
      <path
        d="M46 46l4-4M58 42l4-4M70 42l4-4M82 46l4-4"
        stroke="#E8336E"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SunsetSeal({ className = "", style }: MarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <circle cx="50" cy="50" r="47" stroke="#F2EDE3" strokeWidth="1.6" />
      <defs>
        <path id="sealTop" d="M12 50a38 38 0 0 1 76 0" fill="none" />
        {/* counter-clockwise so the bottom text stays upright */}
        <path id="sealBottom" d="M12 50a38 38 0 0 0 76 0" fill="none" />
      </defs>
      <text fill="#F2EDE3" fontSize="11" fontWeight="700" letterSpacing="3">
        <textPath href="#sealTop" startOffset="50%" textAnchor="middle">
          BUILD · SHIP
        </textPath>
      </text>
      <text fill="#F2EDE3" fontSize="11" fontWeight="700" letterSpacing="3">
        <textPath href="#sealBottom" startOffset="50%" textAnchor="middle">
          · SUNSET ·
        </textPath>
      </text>
      {/* sun over a horizon, centre */}
      <circle cx="50" cy="49" r="9" stroke="#F2762F" strokeWidth="2" />
      <path
        d="M36 60h28"
        stroke="#F2762F"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M50 33v-6M50 71v-4M33 49h-6M67 49h6M38 37l-4-4M62 37l4-4"
        stroke="#F2762F"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PalmMark({ className = "", style }: MarkProps) {
  return (
    <svg
      viewBox="0 0 80 110"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* curved trunk */}
      <path
        d="M42 108C40 78 36 56 30 38"
        stroke="#F2762F"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* fronds */}
      <path
        d="M30 38C18 24 8 24 2 32M30 38c10-16 22-18 30-10M30 38c-6-16-2-26 6-32M30 38c12-10 24-8 30 0M30 38c-14-4-22 2-26 12"
        stroke="#F2762F"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* coconuts */}
      <circle cx="34" cy="42" r="3" fill="#F2762F" />
      <circle cx="26" cy="44" r="2.6" fill="#F2762F" />
    </svg>
  );
}

export function WaveMark({ className = "", style }: MarkProps) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M0 12c10-10 20 10 30 0s20 10 30 0 20 10 30 0 20 10 30 0"
        stroke="#E8336E"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PersonIcon({ className = "", style }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" stroke="#E8336E" strokeWidth="1.7" />
      <path
        d="M4.5 21c0-4.2 3.4-6.6 7.5-6.6s7.5 2.4 7.5 6.6"
        stroke="#E8336E"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CalendarIcon({ className = "", style }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2.5"
        stroke="#E8336E"
        strokeWidth="1.7"
      />
      <path
        d="M3 10h18M8 3v4M16 3v4"
        stroke="#E8336E"
        strokeWidth="1.7"
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

export function BirdMark({ className = "", style }: MarkProps) {
  return (
    <svg
      viewBox="0 0 40 16"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M2 11c6 0 7-8 11-8s5 8 11 8"
        stroke="#E8336E"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The H'H monogram in the footer: orange H, pink slash, orange H. */
export function HHLogo({ className = "", style }: MarkProps) {
  return (
    <svg
      viewBox="0 0 76 42"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M4 4v34M4 21h22M26 4v34"
        stroke="#F2762F"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M48 4v34M48 21h22M70 4v34"
        stroke="#F2762F"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M40 2l-6 38"
        stroke="#E8336E"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
