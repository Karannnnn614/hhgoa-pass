import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/siteUrl";

type SP = Promise<{ [k: string]: string | string[] | undefined }>;

const one = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) ?? "";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const sp = await searchParams;
  const n = one(sp.n) || "A Builder";
  const t = one(sp.t) || "Builder";
  const g = one(sp.g);
  const s = one(sp.s);
  const h = one(sp.h);
  const title = t;

  // Absolute: X/Slack scrapers need a fully-qualified image URL, and this
  // page is the one they actually fetch.
  const og = `${siteUrl()}/api/og?${new URLSearchParams({ n, t, g, s, h })}`;

  return {
    title: `${n} — Builder Pass · HH Goa 2026`,
    description: `${n} is a ${title} at Hacker House Goa 2026. Build. Ship. Ascend.`,
    openGraph: {
      title: `${n} — ${title}`,
      description: "Hacker House Goa 2026 · Build. Ship. Ascend.",
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${n} — ${title}`,
      description: "Hacker House Goa 2026 · Build. Ship. Ascend.",
      images: [og],
    },
  };
}

export default async function PassPermalink({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const n = one(sp.n) || "A Builder";
  const t = one(sp.t) || "Builder";
  const g = one(sp.g);
  const s = one(sp.s);
  const h = one(sp.h);
  const title = t;
  const og = `/api/og?${new URLSearchParams({ n, t, g, s, h })}`;

  const tweet = `https://x.com/intent/tweet?text=${encodeURIComponent(
    `Just minted my Builder Pass for Hacker House Goa 2026 🌅\n\n${n} — ${title}\n\nBuild. Ship. Ascend. #FrameInGoa`,
  )}&url=${encodeURIComponent(`${siteUrl()}/p?${new URLSearchParams({ n, t, g, s, h })}`)}`;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-9 bg-ink px-6 py-16 text-center">
      {/* The same image X shows in the link preview — it carries this
          person's name, class and ID, so the page and the preview agree. */}
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-cream/15 shadow-2xl shadow-black/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={og} alt={`${n} — Builder Pass`} className="w-full" />
      </div>

      <div>
        <h1 className="display text-4xl text-cream sm:text-5xl">{n}</h1>
        <p className="mt-3 text-cream/70">
          {[title, s, g].filter(Boolean).join(" · ")}
          {h && ` · @${h}`}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <a
          href={tweet}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-pink px-8 py-4 font-bold text-cream transition hover:brightness-110"
        >
          Share this pass on X
        </a>
        <Link
          href="/"
          className="rounded-full border-2 border-cream/30 px-8 py-4 font-bold text-cream transition hover:border-cream/60 hover:bg-cream/5"
        >
          Mint your own Builder Pass
        </Link>
      </div>

      <p className="text-xs text-cream/40">
        Hacker House Goa 2026 · 28—31 Oct · #FrameInGoa
      </p>
    </main>
  );
}
