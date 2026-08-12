export type PublicPassFields = {
  firstName: string;
  lastName: string;
  profileTitle: string;
  teamName: string;
  xUsername: string;
};

const separator = "\u001f";
const titleCodes = new Map([
  ["builder", "b"],
  ["software engineer", "se"],
  ["software developer", "sd"],
  ["full stack developer", "fs"],
  ["frontend developer", "fe"],
  ["backend developer", "be"],
  ["product designer", "pd"],
  ["rust", "rs"],
  ["react", "re"],
  ["ai", "ai"],
]);
const titlesByCode = new Map([
  ["b", "Builder"],
  ["se", "Software Engineer"],
  ["sd", "Software Developer"],
  ["fs", "Full Stack Developer"],
  ["fe", "Frontend Developer"],
  ["be", "Backend Developer"],
  ["pd", "Product Designer"],
  ["rs", "Rust"],
  ["re", "React"],
  ["ai", "AI"],
]);

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string | null {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function packTitle(title: string): string {
  return title
    .split(/[•·|]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => titleCodes.get(part.toLowerCase()) ?? `~${encodeURIComponent(part)}`)
    .join(",");
}

function unpackTitle(value: string): string {
  return value
    .split(",")
    .map((part) => titlesByCode.get(part) ?? (part.startsWith("~") ? decodeURIComponent(part.slice(1)) : part))
    .join(" • ");
}

/** Packs public pass fields into one URL-safe path token, without a database. */
export function encodePassToken(fields: PublicPassFields): string {
  return toBase64Url(
    [
      "1",
      fields.firstName.trim(),
      fields.lastName.trim(),
      packTitle(fields.profileTitle.trim()),
      fields.teamName.trim(),
      fields.xUsername.trim().replace(/^@/, ""),
    ].join(separator),
  );
}

export function decodePassToken(token: string): PublicPassFields | null {
  const decoded = fromBase64Url(token);
  if (!decoded) return null;

  const [version, firstName, lastName, packedTitle, teamName, xUsername, ...extra] = decoded.split(separator);
  if (version !== "1" || extra.length || !firstName || !packedTitle) return null;

  return { firstName, lastName, profileTitle: unpackTitle(packedTitle), teamName, xUsername };
}

export function compactPassLink(origin: string, passId: string, fields: PublicPassFields): string {
  return `${origin}/pass/${passId}/${encodePassToken(fields)}`;
}
