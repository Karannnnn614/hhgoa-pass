"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Contributors from "@/components/Contributors";
import HeroBackdrop from "@/components/HeroBackdrop";
import Intro from "@/components/Intro";
import PhotoTools from "@/components/PhotoTools";
import ScaledCard from "@/components/ScaledCard";
import { type PassData } from "@/components/PassCard";
import { CalendarIcon, HouseMark, PersonIcon, WaveMark } from "@/components/marks";
import { intake, type Photo } from "@/lib/photo";
import { download, slugify, toPng } from "@/lib/render";
import { generatePassId } from "@/lib/builderClass";
import { makeQr } from "@/lib/qr";
import { LIMITS, validatePassInput, type ValidationErrors } from "@/lib/validation";
import { compactPassLink } from "@/lib/passLink";

const SHARE_TEXT = (firstName: string) =>
  `Hey, ${firstName} here. A founder in the making just minted a Builder Pass.\n\nSee you at Hacker House Goa 2026. #FrameInGoa #HHGoa2026 \n\nClaim yours:`;

export default function Home() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shineToken, setShineToken] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    profileTitle: "",
    teamName: "",
    xUsername: "",
  });

  const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const builderRef = useRef<HTMLDivElement>(null);
  const builderGridRef = useRef<HTMLDivElement>(null);
  const shineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const photoUpload = useRef<Promise<void> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Compute deterministic pass ID
  const passId = generatePassId(form.firstName, form.lastName, form.xUsername);

  useEffect(() => {
    if (!photo || typeof window === "undefined") return;
    photoUpload.current = fetch(`/api/photos/${encodeURIComponent(passId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photo),
    }).then((response) => {
      if (!response.ok) throw new Error("Photo upload failed");
    }).catch(() => undefined);
    try {
      window.localStorage.setItem(`hhgoa-photo:${passId}`, JSON.stringify(photo));
    } catch {
      // A large photo can exceed browser storage; the live card still works.
    }
  }, [passId, photo]);

  // Compute validation errors
  const errors: ValidationErrors = validatePassInput(form);
  const hasErrors = Object.keys(errors).length > 0;

  // Pack the live public fields into one compact, portable URL path token.
  const getPermalink = useCallback(async () => {
    if (typeof window === "undefined") return "";
    await photoUpload.current;
    return compactPassLink(window.location.origin, passId, form);
  }, [form, passId]);

  // Update QR Code when inputs change
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const link = await getPermalink();
        if (link) {
          const qr = await makeQr(link);
          if (active) setQrCodeUrl(qr);
        }
      } catch (e) {
        console.error("QR generation failed:", e);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [getPermalink]);

  const scrollToBuilder = (shineAfterScroll = false) => {
    builderGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!shineAfterScroll) return;
    if (shineTimer.current) clearTimeout(shineTimer.current);
    shineTimer.current = setTimeout(() => {
      setShineToken((token) => token + 1);
      shineTimer.current = null;
    }, 1000);
  };

  // File Upload Handler
  const handleFile = useCallback(async (file: File) => {
    setErrorMsg("");
    setBusy(true);
    try {
      const p = await intake(file);
      setPhoto(p);
      setTransform({ x: 0, y: 0, zoom: 1 });
      // Smooth scroll to builder section after uploading photo
      scrollToBuilder();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Image load failed.");
    } finally {
      setBusy(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onDownload = async () => {
    if (!cardRef.current || hasErrors) return;
    setDownloading(true);
    setErrorMsg("");
    try {
      const blob = await toPng(cardRef.current);
      download(blob, `builder-pass-${passId.toLowerCase()}-${slugify(form.firstName)}.png`);
      setShineToken((token) => token + 1);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Render failed.");
    } finally {
      setDownloading(false);
    }
  };

  const onCopyLink = async () => {
    const link = await getPermalink();
    navigator.clipboard.writeText(link);
    setCopied(true);
    setShineToken((token) => token + 1);
    setTimeout(() => setCopied(false), 2000);
  };

  const onShareX = async () => {
    const permalink = await getPermalink();
    const text = SHARE_TEXT(form.firstName.trim() || "Builder");
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(permalink)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const passData: PassData = {
    firstName: form.firstName,
    lastName: form.lastName,
    profileTitle: form.profileTitle,
    teamName: form.teamName,
    xUsername: form.xUsername,
    passId,
    photo,
    transform,
    qr: qrCodeUrl,
  };

  return (
    <main className="min-h-screen bg-ink text-cream selection:bg-pink selection:text-cream">
      {/* Optional video intro */}
      <Intro />

      {/* ================= HERO LANDING SECTION ================= */}
      <section className="relative flex min-h-svh flex-col justify-between overflow-hidden">
        <HeroBackdrop />

        <header className="relative z-10 flex items-start justify-between px-5 pt-4 sm:px-10 sm:pt-7 lg:px-16">
          <div className="flex items-center gap-4 md:hidden">
            <HouseMark className="h-14 w-16 sm:h-19.5 sm:w-22" />
            <span className="h-10 w-px bg-orange/70 sm:h-14" />
          </div>
          <a
            href="https://hhgoa.com/#check-hype"
            className="group ml-auto flex items-center gap-3 rounded-full border-2 border-orange bg-[#70241f]/95 px-4 py-2 text-sm font-semibold text-cream shadow-[inset_0_-3px_0_#e8336e,0_0_0_3px_rgba(255,138,36,0.2)] transition hover:scale-[1.03] sm:px-7 sm:py-3 sm:text-xl"
          >
            CHECK HYPE <span className="text-2xl leading-none transition-transform group-hover:translate-x-1">→</span>
          </a>
        </header>

        {/* Central Hero Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-7 pt-2 text-center sm:pb-10">
          <div className="absolute left-[16%] top-[18%] hidden text-left md:block">
            <span className="text-[2rem] font-black leading-none text-orange">2:47<small className="ml-1 text-lg">pm</small><b className="block text-xl text-cream">STUDIO</b></span>
          </div>

          <div className="rise mb-3 flex flex-col items-center sm:mb-5">
            <p className="text-[11px] font-bold tracking-[0.3em] text-pink sm:text-base sm:tracking-[0.42em]">GOA • INDIA • 2026</p>
            <svg className="mt-2 h-6 w-16 sm:h-8 sm:w-20" viewBox="0 0 80 32" fill="none" aria-hidden>
              <path d="M22 28a18 18 0 0 1 36 0M40 8V1M26 12l-5-5M54 12l5-5M19 21l-7-2M61 21l7-2" stroke="#ff8a24" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>

          <div className="rise hacker-house-artifact" style={{ animationDelay: "60ms" }}>
            {/* Exact supplied transparent Hacker House Goa wordmark. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hacker-house-goa.png" alt="Hacker House Goa" />
          </div>

          <p className="rise mt-3 text-xs font-bold tracking-[0.34em] text-cream sm:mt-5 sm:text-2xl sm:tracking-[0.4em]" style={{ animationDelay: "120ms" }}>
            BUILD <span className="text-pink">•</span> SHIP <span className="text-pink">•</span> ASCEND
          </p>

          <button
            onClick={() => scrollToBuilder(true)}
            className="rise group mt-6 inline-flex items-center gap-5 rounded-full border-2 border-pink bg-pink px-6 py-3 text-sm font-extrabold text-cream shadow-[inset_0_-4px_0_#b61540,0_3px_0_#ff8a24] transition hover:scale-[1.03] active:scale-[0.98] sm:mt-8 sm:px-8 sm:py-4 sm:text-xl"
            style={{ animationDelay: "180ms" }}
          >
            GET YOUR BUILDER PASS <span className="text-2xl leading-none transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Bottom Hero Info Strip */}
        <div className="relative z-10 flex flex-col items-center gap-3 px-4 pb-6 md:pb-16">
          <div className="rise flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-orange/70 bg-[#001d1f]/90 px-4 py-3 text-[11px] font-bold tracking-wide text-cream backdrop-blur-md sm:gap-8 sm:rounded-full sm:px-10 sm:py-3.5 sm:text-sm">
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink" />
              <div className="flex flex-col sm:flex-row sm:gap-1 text-left sm:text-center leading-tight">
                <span>28 – 31</span>
                <span>OCT 2026</span>
              </div>
            </div>
            <span className="text-orange/60 font-light">|</span>
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex flex-col sm:flex-row sm:gap-1 text-left sm:text-center leading-tight">
                <span>GOA,</span>
                <span>INDIA</span>
              </div>
            </div>
            <span className="text-orange/60 font-light">|</span>
            <div className="flex items-center gap-2.5">
              <PersonIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="flex flex-col sm:flex-row sm:gap-1 text-left sm:text-center leading-tight">
                <span>FOUNDER</span>
                <span>IN MAKING</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 whitespace-nowrap text-center text-[9px] font-bold tracking-[0.16em] text-gold uppercase md:hidden">
            <WaveMark className="hidden h-2 w-8 text-pink opacity-80 sm:block" />
            <span>BUILT BY BUILDERS, FOR BUILDERS</span>
            <WaveMark className="hidden h-2 w-8 text-pink opacity-80 sm:block" />
          </div>
        </div>
      </section>

      {/* ================= BUILDER PASS SECTION ================= */}
      <section
        ref={builderRef}
        id="builder-section"
        className="scroll-mt-4 relative mx-auto max-w-6xl px-5 py-20 md:px-10 border-t border-cream/10"
      >
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-[0.34em] text-pink uppercase mb-2">
            EXCLUSIVE EVENING BADGE
          </p>
          <h2 className="display text-4xl sm:text-6xl text-cream">
            Mint Your Builder Pass
          </h2>
          <p className="mt-3 text-base text-cream/70">
            Upload your photo, set your handle and roles to generate your custom Hacker House Goa 2026 pass.
          </p>
          <WaveMark className="mx-auto mt-4 h-4 w-32 opacity-70" />
        </div>

        {/* Grid: Form on Left, Card Preview on Right */}
        <div ref={builderGridRef} className="scroll-mt-6 grid gap-12 lg:grid-cols-12 items-start">
          {/* Form Side */}
          <div className="order-1 lg:order-1 lg:col-span-6 bg-[#00161A] p-6 md:p-8 rounded-3xl border border-cream/20 space-y-6">
            <h3 className="display text-2xl text-cream border-b border-cream/10 pb-3">
              Pass Details
            </h3>

            {/* Photo Upload Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-cream/70 mb-2">
                PROFILE PHOTO
              </label>
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="w-full"
              >
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={busy}
                  className="w-full rounded-2xl border-2 border-dashed border-cream/25 bg-ink/40 p-5 text-center transition hover:border-pink hover:bg-ink/70 disabled:opacity-50"
                >
                  <span className="block text-sm font-bold text-cream">
                    {busy ? "Reading photo…" : photo ? "Change Photo" : "Upload Profile Photo"}
                  </span>
                  <span className="mt-1 block text-xs text-cream/50">
                    JPG, PNG or HEIC format — straight from camera roll
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
              </div>

              {photo && (
                <div className="mt-4">
                  <PhotoTools
                    photo={photo}
                    transform={transform}
                    onChange={setTransform}
                    onReplace={() => fileRef.current?.click()}
                  />
                </div>
              )}
            </div>

            {/* First Name Field */}
            <FormField
              label="FIRST NAME"
              value={form.firstName}
              limit={LIMITS.firstName}
              error={errors.firstName}
              onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
              placeholder="YOUR NAME"
            />

            {/* Last Name Field */}
            <FormField
              label="LAST NAME"
              value={form.lastName}
              limit={LIMITS.lastName}
              error={errors.lastName}
              onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
              placeholder="LAST NAME"
            />

            {/* Profile Title Field */}
            <FormField
              label="PROFILE TITLE / ROLE / STACKS"
              value={form.profileTitle}
              limit={LIMITS.profileTitle}
              error={errors.profileTitle}
              onChange={(v) => setForm((f) => ({ ...f, profileTitle: v }))}
              placeholder="Builder, SDE, Fullstack, Rust"
            />

            {/* Team Name Field */}
            <FormField
              label="TEAM NAME"
              value={form.teamName}
              limit={LIMITS.teamName}
              error={errors.teamName}
              onChange={(v) => setForm((f) => ({ ...f, teamName: v }))}
              placeholder="LEVIATHON"
            />

            {/* X Username Field */}
            <FormField
              label="X USERNAME"
              value={form.xUsername}
              error={errors.xUsername}
              onChange={(v) => setForm((f) => ({ ...f, xUsername: v }))}
              placeholder="username"
              prefix="@"
            />

            {errorMsg && (
              <p className="text-xs font-bold text-pink bg-pink/10 p-3 rounded-lg border border-pink/30">
                {errorMsg}
              </p>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={onDownload}
                disabled={downloading || hasErrors}
                className="w-full rounded-full bg-pink py-4 text-base font-bold text-cream transition hover:brightness-110 disabled:opacity-50 shadow-lg shadow-pink/20"
              >
                {downloading ? "Rendering PNG…" : "Download PNG"}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onCopyLink}
                  disabled={hasErrors}
                  className="w-full rounded-full border border-cream/30 py-3 text-sm font-bold text-cream transition hover:border-cream/60 hover:bg-cream/5 disabled:opacity-50"
                >
                  {copied ? "Copied!" : "Copy Pass Link"}
                </button>
                <button
                  type="button"
                  onClick={onShareX}
                  disabled={hasErrors}
                  className="w-full rounded-full border border-orange/40 bg-orange/10 py-3 text-sm font-bold text-orange transition hover:bg-orange/20 disabled:opacity-50"
                >
                  Share to X
                </button>
              </div>
            </div>
          </div>

          {/* Builder Pass Live Preview Side */}
          <div className="order-2 lg:order-2 lg:col-span-6 flex flex-col items-center">
            <div className="sticky top-8 w-full max-w-[420px]">
              <div className="mb-3 flex items-center justify-between px-2">
                <span className="text-xs font-bold tracking-widest text-cream/70 uppercase">
                  Live Pass Preview
                </span>
                <span className="text-xs font-mono text-orange">
                  {passId}
                </span>
              </div>

              <ScaledCard
                ref={cardRef}
                data={passData}
                onTransform={setTransform}
                shineToken={shineToken}
              />

              <p className="mt-3 text-center text-xs text-cream/50">
                2:3 Aspect Ratio (1024 × 1536 px) · High-Resolution Export
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream/10 px-4 py-5 text-cream/40 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          {/* Shrinks rather than wrapping, so the footer stays one row on phones. */}
          <p className="min-w-0 text-[10px] leading-tight sm:text-xs">
            Hacker House Goa 2026 · Build. Ship. Ascend. · #FrameInGoa
          </p>
          <Contributors />
        </div>
      </footer>
    </main>
  );
}

function FormField({
  label,
  value,
  limit,
  error,
  onChange,
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  limit?: number;
  error?: string;
  onChange: (v: string) => void;
  placeholder: string;
  prefix?: string;
}) {
  const cleanVal = prefix ? value.replace(/^@/, "") : value;
  const isOver = limit !== undefined && cleanVal.length > limit;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <label className="font-bold tracking-[0.2em] text-cream/70 uppercase">
          {label}
        </label>
        {limit !== undefined ? (
          <span
            className={`font-mono ${isOver ? "text-pink font-bold" : "text-cream/40"
              }`}
          >
            {cleanVal.length} / {limit}
          </span>
        ) : (
          <span className="font-mono text-cream/40">
            {cleanVal.length}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 font-mono font-bold text-cream/40 pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={cleanVal}
          onChange={(e) => onChange(prefix ? `${prefix}${e.target.value}` : e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border-2 bg-ink/60 py-3 text-cream outline-none transition placeholder:text-cream/25 ${prefix ? "pl-9 pr-4" : "px-4"
            } ${error
              ? "border-pink focus:border-pink"
              : "border-cream/20 focus:border-pink"
            }`}
        />
      </div>

      {error && (
        <p className="text-xs font-semibold text-pink">{error}</p>
      )}
    </div>
  );
}
