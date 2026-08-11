/** Rasterise the live card DOM to a PNG blob. Client-only. */

import { CARD_H, CARD_W } from "@/components/PassCard";

const W = CARD_W;
const H = CARD_H;

export async function toPng(node: HTMLElement): Promise<Blob> {
  // Lazy: the rasteriser is only fetched once someone actually has a card.
  const { toBlob } = await import("html-to-image");

  const blob = await toBlob(node, {
    width: W,
    height: H,
    pixelRatio: 2, // -> 2400x3000, sharp after X recompresses
    cacheBust: true,
    backgroundColor: "#0E2620",
    // The node is display-scaled in the page; render it at true size.
    style: { transform: "none", transformOrigin: "top left", margin: "0" },
  });

  if (!blob) throw new Error("Could not render the pass. Try again.");
  return blob;
}

export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // revoke on the next tick; Safari needs the URL alive during the click
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "builder"
  );
}
