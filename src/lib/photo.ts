/** Client-only photo intake. Nothing here ever touches the network. */

const MAX_EDGE = 1400; // plenty for a 2x 1200px-wide card slot

/**
 * Reads the EXIF orientation tag (1-8) out of a JPEG.
 * Browsers honour EXIF for <img>, but NOT for canvas drawImage of a
 * decoded bitmap on every path — so we normalise it ourselves.
 */
function exifOrientation(buf: ArrayBuffer): number {
  const view = new DataView(buf);
  if (view.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) return 1; // not JPEG
  let offset = 2;
  while (offset < view.byteLength - 1) {
    const marker = view.getUint16(offset, false);
    offset += 2;
    if (marker === 0xffe1) {
      // APP1
      if (offset + 8 > view.byteLength) return 1;
      if (view.getUint32(offset + 2, false) !== 0x45786966) return 1; // "Exif"
      const tiff = offset + 8;
      const little = view.getUint16(tiff, false) === 0x4949;
      const dirStart = tiff + view.getUint32(tiff + 4, little);
      if (dirStart + 2 > view.byteLength) return 1;
      const count = view.getUint16(dirStart, little);
      for (let i = 0; i < count; i++) {
        const entry = dirStart + 2 + i * 12;
        if (entry + 12 > view.byteLength) break;
        if (view.getUint16(entry, little) === 0x0112) {
          const o = view.getUint16(entry + 8, little);
          return o >= 1 && o <= 8 ? o : 1;
        }
      }
      return 1;
    }
    if ((marker & 0xff00) !== 0xff00) break;
    if (offset + 2 > view.byteLength) break;
    offset += view.getUint16(offset, false);
  }
  return 1;
}

/** Applies the orientation transform and caps the longest edge. */
function normalise(
  img: HTMLImageElement,
  orientation: number,
): HTMLCanvasElement {
  const swap = orientation >= 5 && orientation <= 8;
  let w = img.naturalWidth;
  let h = img.naturalHeight;

  const longest = Math.max(w, h);
  const scale = longest > MAX_EDGE ? MAX_EDGE / longest : 1;
  w = Math.round(w * scale);
  h = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = swap ? h : w;
  canvas.height = swap ? w : h;
  const ctx = canvas.getContext("2d")!;

  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, w, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, w, h);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, h);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, h, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, h, w);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, w);
      break;
  }

  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode that image."));
    img.src = src;
  });
}

export type Photo = { src: string; width: number; height: number };

export async function intake(file: File): Promise<Photo> {
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("That photo is over 25MB — try a smaller one.");
  }

  let working: Blob = file;
  const isHeic =
    /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);

  if (isHeic) {
    // Lazy: only phones sending HEIC pay for this chunk.
    const heic2any = (await import("heic2any")).default;
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    working = Array.isArray(out) ? out[0] : (out as Blob);
  }

  const buf = await working.arrayBuffer();
  const orientation = isHeic ? 1 : exifOrientation(buf);

  const url = URL.createObjectURL(working);
  try {
    const img = await loadImage(url);
    const canvas = normalise(img, orientation);
    return {
      src: canvas.toDataURL("image/jpeg", 0.92),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
