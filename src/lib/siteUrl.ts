/**
 * Absolute origin for OG tags.
 *
 * Order matters: an explicit NEXT_PUBLIC_SITE_URL wins, then Vercel's own
 * injected production domain (so a deploy works with zero configuration —
 * forgetting the env var used to leave og:image pointing at localhost and X
 * rendered a blank thumbnail), then localhost for `next dev`.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  // Set by Vercel on every deployment; no protocol, e.g. "my-app.vercel.app"
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return "http://localhost:3000";
}
