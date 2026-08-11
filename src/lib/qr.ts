/** QR for the pass permalink, in cream on dark teal matching reference/1.png */
export async function makeQr(url: string): Promise<string> {
  const QRCode = (await import("qrcode")).default;
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 304,
    errorCorrectionLevel: "M",
    color: { dark: "#F5E8C8", light: "#001A1D" },
  });
}

export function permalinkFor(
  origin: string,
  passId: string,
): string {
  return `${origin}/pass/${passId}`;
}
