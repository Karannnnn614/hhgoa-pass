/** QR for the pass permalink, in the card's cream/ink palette. */
export async function makeQr(url: string): Promise<string> {
  const QRCode = (await import("qrcode")).default;
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 312, // 2x the 156px slot
    errorCorrectionLevel: "M",
    color: { dark: "#0B2420", light: "#F3E4C4" },
  });
}

export function permalinkFor(
  origin: string,
  d: { name: string; stack: string; handle: string },
): string {
  const params = new URLSearchParams({
    n: d.name.trim(),
    s: d.stack.trim(),
    h: d.handle.trim().replace(/^@/, ""),
  });
  return `${origin}/p?${params}`;
}
