/**
 * The signature motif: a builder with a laptop on a tiny island inside a
 * split coconut, under a big palm-leaf umbrella. Orange single-stroke
 * line-art with a teal lagoon and sand fill, matched to the reference badge.
 *
 * Coordinate space is 380x360. The shell sits low, the figure sits on the
 * sand to the right of the lagoon, the leaf arcs over from the upper right.
 */
export default function CoconutIsland({
  className = "",
  style,
}: Readonly<{ className?: string; style?: React.CSSProperties }>) {
  const O = "#F2762F";
  return (
    <svg
      viewBox="0 0 380 360"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* ================= COCONUT SHELL ================= */}
      {/* deep bowl */}
      <path
        d="M52 214c0 62 44 106 108 106s108-44 108-106"
        stroke={O}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* rim ellipse */}
      <ellipse cx="160" cy="214" rx="108" ry="24" stroke={O} strokeWidth="3.2" />
      {/* inner rim for shell thickness */}
      <path
        d="M62 214c0 12 44 22 98 22s98-10 98-22"
        stroke={O}
        strokeWidth="1.8"
        opacity="0.6"
      />
      {/* husk striations */}
      <path
        d="M84 262c6 16 10 27 12 39M120 292c4 12 6 21 7 29M160 304v30M200 292c-4 12-6 21-7 29M236 262c-6 16-10 27-12 39"
        stroke={O}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* ================= LAGOON (left) ================= */}
      <path
        d="M70 212c0 13 27 24 62 24 14 0 27-2 37-5-8-15-27-23-50-23-30 0-49 1-49 4Z"
        fill="#1D6E78"
      />
      <path
        d="M84 208c11-4 23-3 34 0M96 222c12-3 25-2 35 2"
        stroke="#4FA8B4"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* ================= SAND (right) ================= */}
      <path
        d="M132 222c14-24 46-31 76-20 16 6 31 5 46 0 3 13-26 24-67 24-27 0-48-2-55-4Z"
        fill="#C9762C"
      />
      <path
        d="M132 222c14-24 46-31 76-20 16 6 31 5 46 0"
        stroke={O}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* ================= PALM UMBRELLA ================= */}
      {/* leaf: a broad ribbed frond arcing left from the upper right */}
      <path
        d="M214 118c26-46 74-62 122-46-20 6-34 16-42 30 18 0 33 6 44 18-26-6-46 0-58 14 13 6 21 15 24 28-32-24-68-36-90-44Z"
        stroke={O}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* leaf ribs */}
      <path
        d="M226 116c22-30 52-44 88-46M238 122c18-24 44-36 74-40M250 128c14-18 34-28 58-32"
        stroke={O}
        strokeWidth="1.7"
        opacity="0.7"
      />
      {/* stem into the sand */}
      <path
        d="M216 122c6 30 8 60 6 88"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* ================= SPEECH BUBBLE ================= */}
      <path
        d="M64 34h86c9 0 16 7 16 16v32c0 9-7 16-16 16h-40l-22 20V98H64c-9 0-16-7-16-16V50c0-9 7-16 16-16Z"
        stroke={O}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M86 56l-13 10 13 10M132 56l13 10-13 10M116 52l-14 28"
        stroke={O}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ================= LITTLE PALM (water's edge) ================= */}
      <path d="M116 216v-44" stroke={O} strokeWidth="2.3" strokeLinecap="round" />
      <path
        d="M116 172c-13-9-21-6-25 2M116 172c13-9 21-6 25 2M116 172c-5-12 0-19 6-22M116 172c6-11 15-12 21-8"
        stroke={O}
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      {/* ================= BUILDER FIGURE ================= */}
      {/* head */}
      <circle cx="188" cy="126" r="16" stroke={O} strokeWidth="2.8" />
      {/* hair sweep */}
      <path
        d="M175 118c4-11 22-13 27-3M180 112c3-5 9-7 14-5"
        stroke={O}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* neck + torso, leaning slightly forward over the laptop */}
      <path
        d="M188 142v14M188 156c-9 4-14 12-15 22"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* back line */}
      <path
        d="M188 156c9 4 14 12 15 22"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* arms reaching down to the keyboard */}
      <path
        d="M175 162c-6 8-8 14-7 20M201 162c6 8 8 14 7 20"
        stroke={O}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* crossed legs resting on the sand */}
      <path
        d="M176 190c-10 6-18 9-27 8M200 190c10 6 18 9 27 7"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* laptop: screen + wedge base */}
      <path
        d="M166 176v-22h44v22"
        stroke={O}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M160 176h56l7 14h-70l7-14Z"
        stroke={O}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* ================= DRINK UMBRELLA ================= */}
      <path
        d="M242 196l13-13 13 13Z"
        stroke="#E8336E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M255 183v22"
        stroke="#E8336E"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* ================= RIPPLES ================= */}
      <path
        d="M14 296c18 10 34 10 52 0M292 282c20 10 36 10 56 0M300 316c16 8 30 8 46 0"
        stroke={O}
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
