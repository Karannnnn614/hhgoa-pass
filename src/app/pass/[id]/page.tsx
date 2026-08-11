"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import ScaledCard from "@/components/ScaledCard";
import { type PassData } from "@/components/PassCard";
import { makeQr } from "@/lib/qr";
import { download, slugify, toPng } from "@/lib/render";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const getParam = (val: string | string[] | undefined): string =>
  (Array.isArray(val) ? val[0] : val) || "";

export default function PublicPassPage({ params, searchParams }: PageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);

  const passId = resolvedParams.id || "HH26-BLD-1047";
  const firstName = getParam(resolvedSearchParams.fn) || "VAIBHAV";
  const lastName = getParam(resolvedSearchParams.ln) || "SHIVHARE";
  const profileTitle = getParam(resolvedSearchParams.t) || "Builder • Software Engineer • Rust";
  const teamName = getParam(resolvedSearchParams.tm) || "LEVIATHON";
  const xUsername = getParam(resolvedSearchParams.x) || "@SUKUNA1709";

  const [data, setData] = useState<PassData>({
    firstName,
    lastName,
    profileTitle,
    teamName,
    xUsername,
    passId,
    photo: null,
    transform: { x: 0, y: 0, zoom: 1 },
  });

  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadQr() {
      try {
        const qrUrl = await makeQr(window.location.href);
        setData((prev) => ({ ...prev, qr: qrUrl }));
      } catch (err) {
        console.error("QR error:", err);
      }
    }
    loadQr();
  }, []);

  const onDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const blob = await toPng(cardRef.current);
      download(blob, `builder-pass-${passId.toLowerCase()}-${slugify(firstName)}.png`);
    } catch (e) {
      console.error("Render failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#001F22] flex flex-col items-center justify-center p-4 md:p-10 text-white">
      <div className="w-full max-w-[480px]">
        <ScaledCard
          ref={cardRef}
          data={data}
          onTransform={(t) => setData((d) => ({ ...d, transform: t }))}
        />

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onDownload}
            disabled={downloading}
            className="w-full rounded-full bg-[#FF4265] py-3.5 px-6 font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {downloading ? "Rendering PNG…" : "Download PNG"}
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onCopyLink}
              className="flex-1 rounded-full border border-white/20 py-3 px-4 font-bold text-white transition hover:bg-white/10 text-sm"
            >
              {copied ? "Copied!" : "Copy Pass Link"}
            </button>
            <Link
              href="/"
              className="flex-1 text-center rounded-full bg-white/10 py-3 px-4 font-bold text-white transition hover:bg-white/20 text-sm"
            >
              Create Your Pass
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
