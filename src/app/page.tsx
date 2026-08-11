"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import HeroBackdrop from "@/components/HeroBackdrop";
import Intro from "@/components/Intro";
import PhotoTools from "@/components/PhotoTools";
import ScaledCard from "@/components/ScaledCard";
import PassCard, { type PassData } from "@/components/PassCard";
import { CalendarIcon, HHLogo, HouseMark, PersonIcon, WaveMark } from "@/components/marks";
import { intake, type Photo } from "@/lib/photo";
import { download, slugify, toPng } from "@/lib/render";
import { generatePassId } from "@/lib/builderClass";
import { makeQr } from "@/lib/qr";
import { LIMITS, validatePassInput, type ValidationErrors } from "@/lib/validation";

const SHARE_TEXT = (name: string, title: string, passId: string) =>
  `Just minted my Builder Pass for Hacker House Goa 2026 🌅\n\n${name} — ${title} [${passId}]\n\nBuild. Ship. Sunset. #FrameInGoa`;

export default function Home() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    firstName: "VAIBHAV",
    lastName: "SHIVHARE",
    profileTitle: "Builder • Software Engineer • Rust",
    teamName: "LEVIATHON",
    xUsername: "sukuna1709",
  });

  const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const builderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Compute deterministic pass ID
  const passId = generatePassId(form.firstName, form.lastName, form.xUsername);

  // Compute validation errors
  const errors: ValidationErrors = validatePassInput(form);
  const hasErrors = Object.keys(errors).length > 0;

  // Construct permalink for QR and sharing
  const getPermalink = useCallback(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams({
      fn: form.firstName.trim(),
      ln: form.lastName.trim(),
      t: form.profileTitle.trim(),
      tm: form.teamName.trim(),
      x: form.xUsername.trim().replace(/^@/, ""),
    });
    return `${window.location.origin}/pass/${passId}?${params}`;
  }, [form, passId]);

  // Update QR Code when inputs change
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const link = getPermalink();
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

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Render failed.");
    } finally {
      setDownloading(false);
    }
  };

  const onCopyLink = () => {
    const link = getPermalink();
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onShareX = () => {
    const fullName = `${form.firstName} ${form.lastName}`.trim() || "Builder";
    const permalink = getPermalink();
    const text = SHARE_TEXT(fullName, form.profileTitle, passId);
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

        {/* Header Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 border-b border-[#c88724]/20">
          {/* Left: HouseMark + divider + HH mark */}
          <div className="flex items-center gap-3">
            <HouseMark className="h-7 w-7 text-pink" />
            <div className="h-4 w-[1px] bg-cream/30" />
            <HHLogo className="h-4 w-auto text-pink" />
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-10 text-xs font-semibold tracking-[0.2em] text-cream/90 uppercase">
            <span className="cursor-default hover:text-cream transition">ABOUT</span>
            <span className="cursor-default hover:text-cream transition">SCHEDULE</span>
            <span className="cursor-default hover:text-cream transition">BUILDERS</span>
          </div>

          {/* Right: FAQ + Profile Icon */}
          <div className="flex items-center gap-6">
            <span className="text-xs font-semibold tracking-[0.2em] text-cream/90 uppercase cursor-default">
              FAQ
            </span>
            <div className="h-8 w-8 rounded-full border border-cream/40 flex items-center justify-center text-cream/80 cursor-default">
              <PersonIcon className="w-4 h-4 text-cream" />
            </div>
          </div>
        </nav>

        {/* Central Hero Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
          {/* Arch Badge */}
          <div className="rise mb-1 flex flex-col items-center">
            {/* Curved Text Arc */}
            <svg className="w-56 h-9 overflow-visible" viewBox="0 0 220 38">
              <path id="curve" d="M 10 30 Q 110 8 210 32" fill="none" />
              <text fill="#FF3F68" fontSize="13" fontWeight="700" letterSpacing="4.5">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                  GOA • INDIA • 2026
                </textPath>
              </text>
            </svg>
            {/* Sun Rays Illustration */}
            <svg className="w-10 h-5 text-gold -mt-1" viewBox="0 0 40 20" fill="none" stroke="currentColor">
              <path d="M 6 18 A 14 14 0 0 1 34 18" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="20" y1="2" x2="20" y2="0" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="10" y1="6" x2="7" y2="3" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="30" y1="6" x2="33" y2="3" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="5" y1="13" x2="2" y2="12" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="35" y1="13" x2="38" y2="12" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Main Title Wordmark */}
          <h1
            className="display rise text-cream uppercase text-center"
            style={{
              fontSize: "clamp(3.8rem, 11vw, 8.8rem)",
              letterSpacing: "0.01em",
              lineHeight: 0.88,
              animationDelay: "60ms",
            }}
          >
            HACKER HOUSE
          </h1>

          {/* Subtitle Slogan */}
          <p
            className="rise mt-3 text-sm sm:text-lg font-bold tracking-[0.28em] text-cream uppercase"
            style={{ animationDelay: "120ms" }}
          >
            BUILD. <span className="text-pink">•</span> SHIP. <span className="text-pink">•</span> SUNSET.
          </p>

          {/* GET YOUR BUILDER PASS Button */}
          <div className="rise mt-6 md:mt-8" style={{ animationDelay: "180ms" }}>
            <button
              onClick={scrollToBuilder}
              className="group relative inline-flex items-center gap-3 rounded-full bg-pink px-8 py-3.5 sm:px-10 sm:py-4 text-sm sm:text-base font-extrabold tracking-wider text-cream border-b-4 border-[#C82A50] shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>GET YOUR BUILDER PASS</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        {/* Bottom Hero Info Strip */}
        <div className="relative z-10 px-4 pb-6 flex flex-col items-center gap-3">
          <div className="rise flex flex-wrap items-center justify-center gap-4 sm:gap-8 rounded-2xl md:rounded-full border border-[#c88724]/40 bg-[#001D1F]/90 px-6 py-3 md:px-10 md:py-3.5 backdrop-blur-md text-xs sm:text-sm font-bold tracking-wider text-cream">
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink" />
              <div className="flex flex-col sm:flex-row sm:gap-1 text-left sm:text-center leading-tight">
                <span>28 – 31</span>
                <span>OCT 2026</span>
              </div>
            </div>
            <span className="hidden sm:inline text-[#c88724]/40 font-light">|</span>
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
            <span className="hidden sm:inline text-[#c88724]/40 font-light">|</span>
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="flex flex-col sm:flex-row sm:gap-1 text-left sm:text-center leading-tight">
                <span>SUN, SAND,</span>
                <span>SHIP, REPEAT</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.28em] text-[#C88724] uppercase">
            <WaveMark className="h-2 w-8 text-pink opacity-80" />
            <span>BUILT BY BUILDERS, FOR BUILDERS</span>
            <WaveMark className="h-2 w-8 text-pink opacity-80" />
          </div>
        </div>
      </section>

      {/* ================= BUILDER PASS SECTION ================= */}
      <section
        ref={builderRef}
        id="builder-section"
        className="relative mx-auto max-w-6xl px-5 py-20 md:px-10 border-t border-cream/10"
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
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Form Side */}
          <div className="order-1 lg:order-1 lg:col-span-6 bg-ink/60 p-6 md:p-8 rounded-3xl border border-cream/15 backdrop-blur-md space-y-6">
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
              placeholder="VAIBHAV"
            />

            {/* Last Name Field */}
            <FormField
              label="LAST NAME"
              value={form.lastName}
              limit={LIMITS.lastName}
              error={errors.lastName}
              onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
              placeholder="SHIVHARE"
            />

            {/* Profile Title Field */}
            <FormField
              label="PROFILE TITLE / ROLE"
              value={form.profileTitle}
              limit={LIMITS.profileTitle}
              error={errors.profileTitle}
              onChange={(v) => setForm((f) => ({ ...f, profileTitle: v }))}
              placeholder="Builder • Software Engineer • Rust"
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
              limit={LIMITS.xUsername}
              error={errors.xUsername}
              onChange={(v) => setForm((f) => ({ ...f, xUsername: v }))}
              placeholder="sukuna1709"
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
              />

              <p className="mt-3 text-center text-xs text-cream/50">
                2:3 Aspect Ratio (1024 × 1536 px) · High-Resolution Export
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream/10 px-6 py-8 text-center text-xs text-cream/40">
        Hacker House Goa 2026 · Build. Ship. Sunset. · #FrameInGoa
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
  limit: number;
  error?: string;
  onChange: (v: string) => void;
  placeholder: string;
  prefix?: string;
}) {
  const cleanVal = prefix ? value.replace(/^@/, "") : value;
  const isOver = cleanVal.length > limit;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <label className="font-bold tracking-[0.2em] text-cream/70 uppercase">
          {label}
        </label>
        <span
          className={`font-mono ${
            isOver ? "text-pink font-bold" : "text-cream/40"
          }`}
        >
          {cleanVal.length} / {limit}
        </span>
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
          className={`w-full rounded-xl border-2 bg-ink/60 py-3 text-cream outline-none transition placeholder:text-cream/25 ${
            prefix ? "pl-9 pr-4" : "px-4"
          } ${
            error
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
