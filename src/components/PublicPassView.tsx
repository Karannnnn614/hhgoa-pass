"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ScaledCard from "@/components/ScaledCard";
import { type PassData } from "@/components/PassCard";
import { makeQr } from "@/lib/qr";
import { download, slugify, toPng } from "@/lib/render";
import type { PublicPassFields } from "@/lib/passLink";
import type { Photo } from "@/lib/photo";

export default function PublicPassView({ passId, fields }: { passId: string; fields: PublicPassFields }) {
  const [data, setData] = useState<PassData>({ ...fields, passId, photo: null, transform: { x: 0, y: 0, zoom: 1 } });
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shineToken, setShineToken] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shineTimer = window.setTimeout(() => setShineToken((token) => token + 1), 650);
    let restoreTimer: number | undefined;
    const photoKey = `hhgoa-photo:${passId}`;
    try {
      const stored = window.localStorage.getItem(photoKey);
      if (stored) {
        const photo = JSON.parse(stored) as Photo;
        if (typeof photo.src === "string" && photo.src.startsWith("data:image/")) {
          restoreTimer = window.setTimeout(() => {
            setData((previous) => ({ ...previous, photo }));
            setShineToken((token) => token + 1);
          }, 0);
        }
      }
    } catch {
      // Public links still render the branded card when local photo data is unavailable.
    }

    async function loadQr() {
      try {
        const qr = await makeQr(window.location.href);
        setData((previous) => ({ ...previous, qr }));
      } catch (error) {
        console.error("QR error:", error);
      }
    }
    loadQr();
    return () => {
      window.clearTimeout(shineTimer);
      if (restoreTimer) window.clearTimeout(restoreTimer);
    };
  }, [passId]);

  const onDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const blob = await toPng(cardRef.current);
      download(blob, `builder-pass-${passId.toLowerCase()}-${slugify(fields.firstName)}.png`);
      setShineToken((token) => token + 1);
    } catch (error) {
      console.error("Render failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setShineToken((token) => token + 1);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#001F22] flex flex-col items-center justify-center p-4 md:p-10 text-white">
      <div className="w-full max-w-[480px]">
        <ScaledCard ref={cardRef} data={data} onTransform={(transform) => setData((previous) => ({ ...previous, transform }))} shineToken={shineToken} />
        <div className="mt-6 flex flex-col gap-3">
          <button onClick={onDownload} disabled={downloading} className="w-full rounded-full bg-[#FF4265] py-3.5 px-6 font-bold text-white transition hover:brightness-110 disabled:opacity-60">
            {downloading ? "Rendering PNG…" : "Download PNG"}
          </button>
          <div className="flex gap-3">
            <button onClick={onCopyLink} className="flex-1 rounded-full border border-white/20 py-3 px-4 font-bold text-white transition hover:bg-white/10 text-sm">
              {copied ? "Copied!" : "Copy Pass Link"}
            </button>
            <Link href="/" className="flex-1 text-center rounded-full bg-white/10 py-3 px-4 font-bold text-white transition hover:bg-white/20 text-sm">
              Create Your Pass
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
