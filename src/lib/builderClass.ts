/** Deterministic: same input -> same title, always. FNV-1a, no deps. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  const norm = s.trim().toLowerCase().replace(/\s+/g, " ");
  for (let i = 0; i < norm.length; i++) {
    h ^= norm.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/* Curated, on-theme. Goa + shipping, not generic RPG classes. */
const TITLES = [
  "Sunset Shipper",
  "Midnight Committer",
  "Beach Bug Hunter",
  "Coconut Architect",
  "Tide Table Tuner",
  "Low Latency Lifeguard",
  "Monsoon Refactorer",
  "Feni Stack Wizard",
  "Susegad Systems Lead",
  "Sandbar Scaler",
  "Deploy at Dawn",
  "Palm Shade Prototyper",
  "Shoreline Debugger",
  "Cashew Cache Warmer",
  "Dolphin Spotter, Ret.",
  "Ferry Route Optimizer",
  "Prawn Curry Pipeline",
  "Vindaloo Velocity",
  "Sunburnt Sysadmin",
  "Hammock Driven Dev",
  "Off-Grid Overclocker",
  "Salt Air Signal Chaser",
  "Bonfire Build Engineer",
  "Trance Tempo Typist",
];

const RANKS = ["I", "II", "III", "IV", "V"];

export function builderClass(stack: string, name = ""): string {
  if (!stack.trim()) return "Builder";
  return TITLES[hash(stack + "|" + name) % TITLES.length];
}

/** Badge serial, also deterministic — reads like a real credential. */
export function builderId(name: string, stack: string): string {
  const h = hash(name + "::" + stack);
  const n = (h % 9000) + 1000;
  const rank = RANKS[h % RANKS.length];
  return `HHG26-${rank}-${n}`;
}

if (process.env.NODE_ENV !== "production" && typeof window === "undefined") {
  // determinism check: same input must never drift
  console.assert(
    builderClass("react, node") === builderClass("  REACT,   Node  "),
    "builderClass must be case/space insensitive",
  );
  console.assert(
    builderId("Ada", "rust") === builderId("Ada", "rust"),
    "builderId must be stable",
  );
}
