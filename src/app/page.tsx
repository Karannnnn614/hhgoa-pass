"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import HeroBackdrop from "@/components/HeroBackdrop";
import Intro from "@/components/Intro";
import PhotoTools from "@/components/PhotoTools";
import { type PassData } from "@/components/PassCard";
import ScaledCard from "@/components/ScaledCard";
import { HouseMark, WaveMark } from "@/components/marks";
import { intake, type Photo } from "@/lib/photo";
import { download, slugify, toPng } from "@/lib/render";
import { builderClass } from "@/lib/builderClass";
import { makeQr, permalinkFor } from "@/lib/qr";

const SHARE_TEXT = (name: string, title: string) =>
  `Just minted my Builder Pass for Hacker House Goa 2026 🌅\n\n${name} — ${title}\n\nBuild. Ship. Sunset. #FrameInGoa`;

export default function Home() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState<PassData>({
    name: "",
    stack: "",
    handle: "",
    photo: null,
    transform: { x: 0, y: 0, zoom: 1 },
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // QR regenerates whenever the identity fields change (debounced).
  useEffect(() => {
    if (!photo) return;
    const t = setTimeout(async () => {
      try {
        const qr = await makeQr(
          permalinkFor(window.location.origin, {
            name: data.name,
            stack: data.stack,
            handle: data.handle,
          }),
        );
        setData((d) => (d.qr === qr ? d : { ...d, qr }));
      } catch {
        /* QR is decorative if it fails; the card still renders */
      }
    }, 350);
    return () => clearTimeout(t);
  }, [photo, data.name, data.stack, data.handle]);

  const handleFile = useCallback(async (file: File) => {
    setError("");
    setBusy(true);
    try {
      const p = await intake(file);
      setPhoto(p);
      setData((d) => ({ ...d, photo: p, transform: { x: 0, y: 0, zoom: 1 } }));
      setRevealed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }, []);

  // Scroll to the card once it exists
  useEffect(() => {
    if (revealed) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [revealed]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    setError("");
    try {
      const blob = await toPng(cardRef.current);
      download(blob, `hhgoa-pass-${slugify(data.name)}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Render failed.");
    } finally {
      setDownloading(false);
    }
  };

  const onShare = () => {
    const title = builderClass(data.stack, data.name);
    const name = data.name.trim() || "A builder";
    const params = new URLSearchParams({
      n: data.name.trim(),
      s: data.stack.trim(),
      h: data.handle.trim().replace(/^@/, ""),
    });
    const permalink = `${window.location.origin}/p?${params}`;
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(
      SHARE_TEXT(name, title),
    )}&url=${encodeURIComponent(permalink)}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <main className="min-h-dvh bg-ink">
      <Intro />

      {/* ================= HERO ================= */}
      <section className="relative flex min-h-dvh flex-col">
        <HeroBackdrop />

        <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
          <div className="flex items-center gap-3">
            <HouseMark className="h-10 w-10 md:h-12 md:w-12" />
            <span
              className="display text-cream"
              style={{ fontSize: "1.05rem", lineHeight: 1 }}
            >
              Hacker
              <br />
              House
            </span>
          </div>
          <span className="hidden text-xs font-bold tracking-[0.28em] text-orange sm:block">
            GOA · INDIA · 2026
          </span>
        </nav>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
          <p className="rise mb-4 text-xs font-bold tracking-[0.34em] text-pink sm:text-sm">
            28 — 31 OCT 2026 · GOA, INDIA
          </p>

          <h1
            className="display rise text-cream"
            style={{
              fontSize: "clamp(2.75rem, 11vw, 8rem)",
              animationDelay: "60ms",
            }}
          >
            Builder Pass
          </h1>

          <p
            className="rise mt-5 max-w-xl text-base text-cream/80 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Upload a photo. Get a Hacker House Goa badge worth posting. No login,
            no waiting — your photo never leaves this browser.
          </p>

          <WaveMark className="rise mt-6 h-4 w-32 opacity-70" />

          {/* dropzone = primary CTA, above the fold */}
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="rise mt-8 w-full max-w-md"
            style={{ animationDelay: "180ms" }}
          >
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="group w-full rounded-3xl border-2 border-dashed border-cream/35 bg-ink/45 px-6 py-9 backdrop-blur-sm transition hover:border-pink hover:bg-ink/60 disabled:opacity-60"
            >
              <span className="block text-lg font-bold text-cream">
                {busy ? "Reading your photo…" : "Drop a photo, or tap to pick"}
              </span>
              <span className="mt-2 block text-sm text-cream/60">
                JPG, PNG or HEIC — straight from your camera roll
              </span>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*,.heic,.heif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />

            {error && (
              <p className="mt-3 text-sm font-semibold text-pink">{error}</p>
            )}
          </div>
        </div>
      </section>

      {/* ================= BUILDER ================= */}
      {photo && (
        <section
          ref={resultRef}
          className="relative mx-auto max-w-6xl px-5 py-16 md:px-10"
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* card preview */}
            <div className="order-2 lg:order-1">
              <div className="mx-auto w-full max-w-[420px]">
                <ScaledCard
                  ref={cardRef}
                  data={data}
                  onTransform={(t) => setData((d) => ({ ...d, transform: t }))}
                />

                <p className="mt-4 text-center text-xs text-cream/55">
                  Drag the photo to reposition · scroll or pinch to zoom
                </p>
              </div>
            </div>

            {/* form */}
            <div className="order-1 space-y-6 lg:order-2">
              <div>
                <h2 className="display text-3xl text-cream">Your details</h2>
                <p className="mt-2 text-sm text-cream/60">
                  Three fields. Your class is generated from your stack.
                </p>
              </div>

              <Field
                label="Name"
                value={data.name}
                onChange={(v) => setData((d) => ({ ...d, name: v }))}
                placeholder="Bhavya Madan"
                maxLength={24}
              />
              <Field
                label="Stack / Role"
                value={data.stack}
                onChange={(v) => setData((d) => ({ ...d, stack: v }))}
                placeholder="React · Rust · AI"
                maxLength={40}
              />
              <Field
                label="X handle"
                value={data.handle}
                onChange={(v) => setData((d) => ({ ...d, handle: v }))}
                placeholder="@yourhandle"
                maxLength={20}
              />

              <PhotoTools
                transform={data.transform}
                onChange={(t) => setData((d) => ({ ...d, transform: t }))}
                onReplace={() => fileRef.current?.click()}
              />

              <div className="space-y-3 pt-2">
                <button
                  onClick={onDownload}
                  disabled={downloading}
                  className="w-full rounded-full bg-pink px-6 py-4 text-base font-bold text-cream transition hover:brightness-110 disabled:opacity-60"
                >
                  {downloading ? "Rendering…" : "Download PNG"}
                </button>
                <button
                  onClick={onShare}
                  className="w-full rounded-full border-2 border-cream/30 px-6 py-4 text-base font-bold text-cream transition hover:border-cream/60 hover:bg-cream/5"
                >
                  Share to X
                </button>
                <p className="pt-1 text-center text-[11px] text-cream/40">
                  Download first, then attach the PNG to your post for the best
                  look.
                </p>
              </div>

              {error && (
                <p className="text-sm font-semibold text-pink">{error}</p>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-cream/10 px-6 py-8 text-center text-xs text-cream/40">
        Hacker House Goa 2026 · Build. Ship. Sunset. · #FrameInGoa
      </footer>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold tracking-[0.24em] text-cream/55">
        {label.toUpperCase()}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border-2 border-cream/20 bg-ink/60 px-4 py-3 text-cream outline-none transition placeholder:text-cream/30 focus:border-pink"
      />
    </label>
  );
}
