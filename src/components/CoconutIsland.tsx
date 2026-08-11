/**
 * The signature motif: a builder with a laptop on a tiny island inside a
 * split coconut, under a big leaf umbrella. Matched to the reference badge —
 * orange single-stroke line-art with a teal lagoon and sand fill.
 */
export default function CoconutIsland({
  className = "",
  style,
}: Readonly<{ className?: string; style?: React.CSSProperties }>) {
  const O = "#F2762F";
  return (
    <svg
      viewBox="0 0 380 356"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* ---------- leaf umbrella, arcing in from upper right ---------- */}
      <path
        d="M232 128c22-58 74-84 128-64-18 4-30 12-38 24 16-2 30 2 42 12-24-2-42 4-54 18 12 4 20 12 24 24-30-16-70-18-102-14Z"
        stroke={O}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* leaf veins */}
      <path
        d="M244 122c20-34 48-50 82-52M256 118c16-26 38-40 64-46M268 116c12-20 28-32 48-38"
        stroke={O}
        strokeWidth="1.8"
        opacity="0.75"
      />
      {/* umbrella stem down into the sand */}
      <path
        d="M236 132c8 22 10 44 8 66"
        stroke={O}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* ---------- code speech bubble, upper left ---------- */}
      <path
        d="M46 40h84c8 0 14 6 14 14v34c0 8-6 14-14 14H86l-20 20V102H46c-8 0-14-6-14-14V54c0-8 6-14 14-14Z"
        stroke={O}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M66 62l-12 9 12 9M112 62l12 9-12 9M96 58l-14 26"
        stroke={O}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ---------- coconut shell ---------- */}
      {/* outer hemisphere */}
      <path
        d="M28 224a124 108 0 0 0 248 0Z"
        stroke={O}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* rim */}
      <ellipse cx="152" cy="224" rx="124" ry="26" stroke={O} strokeWidth="3" />
      {/* inner rim line, gives the shell thickness */}
      <ellipse
        cx="152"
        cy="224"
        rx="112"
        ry="20"
        stroke={O}
        strokeWidth="1.8"
        opacity="0.7"
      />
      {/* husk striations following the curve */}
      <path
        d="M64 268c8 18 14 30 18 44M104 296c5 14 8 24 9 34M152 306v36M200 296c-5 14-8 24-9 34M240 268c-8 18-14 30-18 44"
        stroke={O}
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* ---------- lagoon water, left inside the shell ---------- */}
      <path
        d="M46 222c0 14 30 26 72 26 16 0 30-2 42-6-8-16-30-26-56-26-34 0-58 2-58 6Z"
        fill="#1D6E78"
      />
      <path
        d="M62 216c12-5 26-4 38 0M76 232c14-4 28-3 40 2"
        stroke="#4FA8B4"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* ---------- sand island, right inside the shell ---------- */}
      <path
        d="M120 232c16-26 50-34 82-22 18 7 34 6 50 0 4 14-28 26-72 26-30 0-52-2-60-4Z"
        fill="#C9762C"
      />
      <path
        d="M120 232c16-26 50-34 82-22 18 7 34 6 50 0"
        stroke={O}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* ---------- small palm at the water's edge ---------- */}
      <path
        d="M108 226v-42"
        stroke={O}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M108 184c-12-8-20-6-24 1M108 184c12-8 20-6 24 1M108 184c-4-11 0-18 6-21M108 184c6-10 14-11 20-7"
        stroke={O}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* ---------- builder figure ---------- */}
      {/* head */}
      <circle cx="182" cy="128" r="17" stroke={O} strokeWidth="2.8" />
      {/* hair */}
      <path
        d="M168 119c5-11 24-13 29-2M174 113c3-5 9-7 15-5"
        stroke={O}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* body */}
      <path
        d="M182 145v34"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M165 158c11-8 23-8 34 0"
        stroke={O}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* arms to the keyboard */}
      <path
        d="M165 160c-8 10-10 17-8 24M199 160c8 10 10 17 8 24"
        stroke={O}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* crossed legs on the sand */}
      <path
        d="M182 179c-13 8-22 12-32 11M182 179c13 8 22 12 32 10"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* laptop */}
      <path
        d="M154 186h56l8 16h-72l8-16Z"
        stroke={O}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M160 186v-20h44v20"
        stroke={O}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* ---------- little drink umbrella on the sand ---------- */}
      <path
        d="M236 206l14-14 14 14Z"
        stroke="#E8336E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M250 192v24"
        stroke="#E8336E"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* ---------- water ripples outside the shell ---------- */}
      <path
        d="M6 300c18 10 34 10 52 0M290 286c20 10 36 10 56 0M300 320c16 8 30 8 46 0"
        stroke={O}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
