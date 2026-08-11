/**
 * The signature motif from the pass design: a builder with a laptop sitting
 * on a tiny island inside a split coconut, under a leaf umbrella.
 * Single-stroke orange line-art, no fills except the water/sand.
 */
export default function CoconutIsland({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const O = "#F5A03C";
  return (
    <svg
      viewBox="0 0 320 300"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* ---- coconut shell: deep hemisphere ---- */}
      <path
        d="M52 158a108 108 0 0 0 216 0Z"
        stroke={O}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      {/* shell rim ellipse */}
      <ellipse cx="160" cy="158" rx="108" ry="20" stroke={O} strokeWidth="3.4" />
      {/* husk texture following the curve */}
      <path
        d="M78 196c10 16 16 26 20 40M120 228c6 12 9 20 10 30M200 228c-6 12-9 20-10 30M242 196c-10 16-16 26-20 40M160 244v26"
        stroke={O}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* ---- lagoon water in the left of the shell ---- */}
      <path
        d="M62 152c0 11 34 20 76 20 20 0 38-2 50-6-10-12-32-20-58-20-38 0-68 2-68 6Z"
        fill="#1D6273"
        opacity="0.75"
      />
      <path
        d="M74 146c14-6 28-4 40 0M90 158c16-5 30-4 42 1"
        stroke="#3E9AAC"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* ---- sand island on the right ---- */}
      <path
        d="M130 166c14-20 44-26 70-16 16 6 30 6 44 2 0 10-30 18-70 18-24 0-38-2-44-4Z"
        fill="#C97A2E"
        opacity="0.55"
      />
      <path
        d="M130 166c14-20 44-26 70-16 16 6 30 6 44 2"
        stroke={O}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* ---- builder figure, seated on the sand ---- */}
      {/* head */}
      <circle cx="188" cy="78" r="17" stroke={O} strokeWidth="2.8" />
      {/* hair */}
      <path
        d="M174 69c5-10 23-12 28-2M180 63c3-5 9-7 14-5"
        stroke={O}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* torso */}
      <path d="M188 95v32" stroke={O} strokeWidth="2.8" strokeLinecap="round" />
      {/* shoulders */}
      <path
        d="M172 106c10-7 22-7 32 0"
        stroke={O}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* arms reaching to the laptop */}
      <path
        d="M172 108c-7 9-9 16-7 22M204 108c7 9 9 16 7 22"
        stroke={O}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* crossed legs */}
      <path
        d="M188 127c-12 7-20 11-30 10M188 127c12 7 20 11 30 9"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* laptop */}
      <path
        d="M162 134h52l7 15h-66l7-15Z"
        stroke={O}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path d="M168 134v-18h40v18" stroke={O} strokeWidth="2.8" strokeLinejoin="round" />

      {/* ---- code speech bubble ---- */}
      <path
        d="M120 22h72c7 0 12 5 12 12v26c0 7-5 12-12 12h-44l-16 14V72h-12c-7 0-12-5-12-12V34c0-7 5-12 12-12Z"
        stroke={O}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M144 39l-9 8 9 8M180 39l9 8-9 8M168 36l-12 22"
        stroke={O}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ---- big leaf umbrella over the builder ---- */}
      <path
        d="M222 92c20-46 62-56 86-30-26-10-50 0-64 30Z"
        stroke={O}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* leaf ribs */}
      <path
        d="M244 84c14-26 38-34 58-24M236 90c16-30 44-38 66-26"
        stroke={O}
        strokeWidth="1.9"
        opacity="0.75"
      />
      <path
        d="M262 62c5 9 6 17 4 25M282 58c4 8 4 16 2 22"
        stroke={O}
        strokeWidth="1.8"
        opacity="0.7"
      />
      {/* stem down to the sand */}
      <path
        d="M240 96c10 18 13 34 11 52"
        stroke={O}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* ---- little palm at the water's edge ---- */}
      <path
        d="M112 158V118"
        stroke={O}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M112 118c-11-7-19-5-23 1M112 118c11-7 19-5 23 1M112 118c-4-10 0-16 5-19M112 118c5-9 13-10 19-6"
        stroke={O}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* ---- drink with straw, on the sand ---- */}
      <path
        d="M232 138h22l-4 20h-14l-4-20Z"
        stroke={O}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M250 138l9-16" stroke={O} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="261" cy="119" r="4" stroke="#E8336E" strokeWidth="2.2" />

      {/* ---- ripples ---- */}
      <path
        d="M30 250c14 8 26 8 40 0M250 258c14 8 26 8 40 0"
        stroke={O}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
