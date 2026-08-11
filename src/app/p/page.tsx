import type { Metadata } from "next";
import Link from "next/link";
import { builderClass } from "@/lib/builderClass";
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
  const s = one(sp.s) || "Full-stack";
  const h = one(sp.h);
  const title = builderClass(s, n);

  // Absolute: X/Slack scrapers need a fully-qualified image URL, and this
  // page is the one they actually fetch.
  const og = `${siteUrl()}/api/og?${new URLSearchParams({ n, s, h })}`;

  return {
    title: `${n} — Builder Pass · HH Goa 2026`,
    description: `${n} is a ${title} at Hacker House Goa 2026. Build. Ship. Sunset.`,
    openGraph: {
      title: `${n} — ${title}`,
      description: "Hacker House Goa 2026 · Build. Ship. Sunset.",
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${n} — ${title}`,
      description: "Hacker House Goa 2026 · Build. Ship. Sunset.",
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
  const s = one(sp.s) || "Full-stack";
  const h = one(sp.h);
  const title = builderClass(s, n);
  const og = `/api/og?${new URLSearchParams({ n, s, h })}`;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-ink px-6 py-16 text-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-cream/15">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={og} alt={`${n} — ${title}`} className="w-full" />
      </div>

      <div>
        <h1 className="display text-4xl text-cream sm:text-5xl">{n}</h1>
        <p className="mt-3 text-cream/70">
          {title} · {s}
          {h && ` · @${h}`}
        </p>
      </div>

      <Link
        href="/"
        className="rounded-full bg-pink px-8 py-4 font-bold text-cream transition hover:brightness-110"
      >
        Mint your own Builder Pass
      </Link>

      <p className="text-xs text-cream/40">
        Hacker House Goa 2026 · 28—31 Oct · #FrameInGoa
      </p>
    </main>
  );
}
