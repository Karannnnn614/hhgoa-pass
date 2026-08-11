# HH Goa 2026 — Builder Pass Generator

Upload a photo → get a branded Hacker House Goa 2026 builder badge → download the PNG → share to X with `#FrameInGoa`.

No login. No signup gate. **The photo never leaves the browser** — all image
processing and rasterising is client-side.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy (Vercel)

```bash
npx vercel --prod
```

Then set one env var so OG tags resolve to absolute URLs:

```
NEXT_PUBLIC_SITE_URL = https://your-deployment.vercel.app
```

Without it, metadata falls back to `http://localhost:3000` and X will not
render the link preview.

## How it hits the brief

| Requirement | Where |
|---|---|
| JPG / PNG / **HEIC** | `src/lib/photo.ts` — `heic2any` loaded lazily, only when a HEIC actually arrives |
| Any aspect ratio, off-centre crops | cover-fit + drag / pinch / zoom in `PhotoSlot.tsx`, visible controls in `PhotoTools.tsx` |
| EXIF orientation | `exifOrientation()` parses the APP1 tag and normalises on canvas, so iPhone photos aren't sideways |
| Speed | uploads downscaled to 1400px before render; `html-to-image` is dynamically imported after first upload |
| Real downloadable file | 2400×3000 PNG blob (2× of 1200×1500) via `render.ts` |
| Share to X | `x.com/intent/tweet` with pre-written caption + `#FrameInGoa` |
| OG preview | `/api/og` (`next/og`, flexbox-only Satori layout) behind the `/p` permalink |
| Mobile | phones never fetch the mp4 — the intro and hero video are desktop-only |

## Notes

- **Builder ID and class are deterministic** (FNV-1a hash) — the same name +
  stack always produces the same badge, so a re-generated card is identical.
- **The QR is real.** It encodes that pass's `/p?...` permalink; verified by
  decoding it back out of the exported PNG.
- The supplied landing artwork is a full page comp (it carries its own nav and
  wordmark), so the hero uses a **cropped scenery strip** of it rather than the
  whole image — otherwise its lettering collides with the live headline.
- `/api/og` cannot embed the user's photo (it isn't in the URL), so it falls
  back to a branded initials monogram — never a blank thumbnail.

## Checks

`src/lib/builderClass.ts` carries assertions that the hash stays stable and
case/whitespace-insensitive; they run in dev.
