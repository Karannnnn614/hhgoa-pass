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

export function builderClass(stack: string, name = ""): string {
  if (!stack.trim()) return "Builder";
  return TITLES[hash(stack + "|" + name) % TITLES.length];
}

/** Up to 3 initials from the name; "BLD" when there's nothing usable. */
function initials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}]/gu, "")[0])
    .filter(Boolean)
    .slice(0, 3)
    .join("")
    .toUpperCase();
  return letters.length >= 2 ? letters : "BLD";
}

/**
 * Badge serial: HHG26-<initials>-<4 digits>.
 *
 * Deterministic on (name, X handle) so the same person always gets the same
 * ID — the downloaded PNG, the /p permalink and its OG preview can never
 * disagree. The digits look arbitrary but are a hash, not a random draw.
 */
export function builderId(name: string, handle = ""): string {
  const h = hash(name + "::" + handle.trim().toLowerCase().replace(/^@/, ""));
  const n = (h % 9000) + 1000;
  return `HHG26-${initials(name)}-${n}`;
}

/** Backward-compatible helper for page forms */
export function generatePassId(firstName: string, lastName = "", xUsername = ""): string {
  const name = [firstName, lastName].filter(Boolean).join(" ");
  return builderId(name, xUsername);
}

if (process.env.NODE_ENV !== "production" && typeof window === "undefined") {
  // determinism check: same input must never drift
  console.assert(
    builderClass("react, node") === builderClass("  REACT,   Node  "),
    "builderClass must be case/space insensitive",
  );
  console.assert(
    builderId("Ada Lovelace", "@ada") === builderId("Ada Lovelace", "ada"),
    "builderId must ignore a leading @ on the handle",
  );
  console.assert(
    builderId("Bhavya Pratap Singh", "x").startsWith("HHG26-BPS-"),
    "builderId must use up to 3 initials",
  );
  console.assert(
    builderId("Cher", "x").startsWith("HHG26-BLD-"),
    "single-initial names must fall back to BLD",
  );
  console.assert(
    builderId("Ada", "one") !== builderId("Ada", "two"),
    "builderId must vary with the handle",
  );
  console.assert(
    /^HHG26-[A-Z]{2,3}-\d{4}$/.test(builderId("Karan Mundre", "@km")),
    "builderId must match HHG26-XX-9999",
  );
}
