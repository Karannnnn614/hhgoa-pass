/** Deterministic hash function: FNV-1a */
function hash(s: string): number {
  let h = 0x811c9dc5;
  const norm = s.trim().toLowerCase().replace(/\s+/g, " ");
  for (let i = 0; i < norm.length; i++) {
    h ^= norm.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Generate deterministic pass ID: HHG26-BLD-XXXX
 */
export function generatePassId(firstName: string, lastName: string, xUsername = ""): string {
  const seed = `${firstName.trim().toLowerCase()}:${lastName.trim().toLowerCase()}:${xUsername.trim().toLowerCase().replace(/^@/, "")}`;
  const h = hash(seed || "builder");
  const n = (h % 9000) + 1000;
  return `HHG26-BLD-${n}`;
}

export function builderId(name: string, handle = ""): string {
  const h = hash(name + "::" + handle.trim().toLowerCase().replace(/^@/, ""));
  const n = (h % 9000) + 1000;
  return `HHG26-BLD-${n}`;
}

const TITLES = [
  "Sunset Shipper",
  "Midnight Committer",
  "Beach Bug Hunter",
  "Coconut Architect",
  "Low Latency Lifeguard",
  "Monsoon Refactorer",
  "Feni Stack Wizard",
  "Susegad Systems Lead",
  "Sandbar Scaler",
  "Deploy at Dawn",
  "Palm Shade Prototyper",
];

export function builderClass(stack: string, name = ""): string {
  if (!stack.trim()) return "Builder";
  return TITLES[hash(stack + "|" + name) % TITLES.length];
}
