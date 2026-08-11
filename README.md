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

## The card

The card **is** the supplied design. `public/plate.png` is the mockup artwork
with the sample portrait and sample text removed; the app drops the user's
photo into the transparent circle and draws live text at the original design's
positions. Nothing about the artwork is re-drawn or approximated.

Regenerate the plate if the design changes:

```bash
node scripts/build-plate.mjs
```

It re-detects the card bounds, erases the sample content, punches the photo
hole, and writes `src/lib/plate.json` with the geometry the card reads.

## Notes

- **Name type auto-fits.** The name is measured on a canvas with the real
  display font and scaled down until it fits, so long names like "Rajesh
  Kumaraswamy" don't overflow the card. A character count is not enough —
  "KUMARASWAMY" is much wider than 11 narrow glyphs.
- **Credential rows are anchored to the plate's icons** (person y=1332,
  calendar y=1431) and centred with `translateY(-50%)`, so the label/value
  pairs cannot drift into each other at any font size.
- **Builder ID** is `HHG26-<initials>-<4 digits>`, e.g. `HHG26-BPS-3731` for
  Bhavya Pratap Singh. The initials come from the name (up to 3, falling back
  to `BLD` for single-word names); the digits are an FNV-1a hash of name + X
  handle. It's deterministic on purpose: the downloaded PNG, the `/p`
  permalink and its OG preview can never show different IDs for one person.
- **The QR is real.** It encodes that pass's `/p?...` permalink; verified by
  decoding it back out of the exported PNG.
- The landing artwork is a full page comp (it carries its own nav and
  wordmark), so the hero uses a **cropped scenery strip** of it — otherwise its
  lettering collides with the live headline. The mp4 plays as the intro.
- `/api/og` cannot embed the user's photo (it isn't in the URL), so it falls
  back to a branded initials monogram — never a blank thumbnail.

## Checks

`src/lib/builderClass.ts` carries assertions that the hash stays stable and
case/whitespace-insensitive; they run in dev.

Name/layout regressions were checked across one-word, two-word, long, and
single-character names, plus the original mockup's data.
