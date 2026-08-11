/**
 * Regenerates public/plate.png and src/lib/plate.json from the design mockup.
 *
 *   node scripts/build-plate.mjs
 *
 * The plate is the mockup artwork with the sample portrait and sample text
 * removed, cropped flush to the card (the mockup's white page border is an
 * AI-generation artifact and is discarded). The app composites the user's
 * photo into the transparent circle and draws live text on top, so the card
 * is the original design with only the data swapped.
 *
 * Re-run this if the design mockup changes.
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC =
  "C:/Users/karan/Desktop/Builder pass/WhatsApp Image 2026-08-11 at 11.59.44.jpeg";

// --- detect the card body (dark card on a near-white page) ---
const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: SW, height: SH, channels: C } = info;
const at = (x, y) => {
  const i = (y * SW + x) * C;
  return [data[i], data[i + 1], data[i + 2]];
};
const dark = (p) => p[0] < 120 && p[1] < 120 && p[2] < 120;

const mx = Math.round(SW / 2);
let top = 0;
while (top < SH && !dark(at(mx, top))) top++;
let bottom = SH - 1;
while (bottom > 0 && !dark(at(mx, bottom))) bottom--;
const my = Math.round((top + bottom) / 2);
let left = 0;
while (left < SW && !dark(at(left, my))) left++;
let right = SW - 1;
while (right > 0 && !dark(at(right, my))) right--;

const INSET = 4; // drop the mockup's soft white edge
const CARD = {
  left: left + INSET,
  top: top + INSET,
  width: right - left + 1 - INSET * 2,
  height: bottom - top + 1 - INSET * 2,
};

const W = 1000;
const H = Math.round((CARD.height / CARD.width) * W);

const card = await sharp(SRC)
  .extract(CARD)
  .resize(W, H, { fit: "fill" })
  .png()
  .toBuffer();

// --- geometry, measured off a gridded render of the plate at 1000x1625 ---
const S = H / 1625;
const sx = W / 1000;
const photo = {
  cx: Math.round(305 * sx),
  cy: Math.round(620 * S),
  r: Math.round(228 * sx),
};

// background colour, sampled from a clear patch
const c2 = await sharp(card).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const at2 = (x, y) => {
  const i = (y * c2.info.width + x) * c2.info.channels;
  return [c2.data[i], c2.data[i + 1], c2.data[i + 2]];
};
const bg = at2(Math.round(W * 0.06), Math.round(H * 0.7));
const FILL = `rgb(${bg[0]},${bg[1]},${bg[2]})`;

const rect = (x1, y1, x2, y2) =>
  `<rect x="${x1 * sx}" y="${y1 * S}" width="${(x2 - x1) * sx}" height="${(y2 - y1) * S}" fill="${FILL}"/>`;

// sample content to erase (coords in the 1000x1625 gridded space)
const erase = [
  rect(45, 970, 680, 1245), // name + role line
  rect(150, 1300, 660, 1375), // builder id label + value
  rect(150, 1395, 660, 1470), // event dates label + value
  rect(630, 1265, 910, 1500), // sample QR
].join("");

const plate = await sharp(card)
  .composite([
    {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${erase}</svg>`,
      ),
    },
  ])
  .png()
  .toBuffer();

// punch the transparent photo hole (dest-out clears where the mask is opaque)
const mask = await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
       <circle cx="${photo.cx}" cy="${photo.cy}" r="${photo.r}" fill="#000"/>
     </svg>`,
  ),
)
  .png()
  .toBuffer();

/* Round the outer corners. The mockup's card has rounded corners, so the
   square crop leaves opaque near-white notches at each corner — visible
   wherever the badge sits on a dark background (e.g. the OG preview).
   dest-in keeps only what falls inside the rounded rectangle. */
const CORNER = Math.round(46 * (W / 1000));
const rounded = await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
       <rect width="${W}" height="${H}" rx="${CORNER}" ry="${CORNER}" fill="#fff"/>
     </svg>`,
  ),
)
  .png()
  .toBuffer();

// palette-quantised: ~300KB instead of ~1MB, no visible banding in the
// sunset gradient (checked), and every visitor downloads this file.
await sharp(plate)
  .composite([
    { input: mask, blend: "dest-out" }, // photo hole
    { input: rounded, blend: "dest-in" }, // rounded outer corners
  ])
  .png({ quality: 88, compressionLevel: 9, palette: true })
  .toFile("public/plate.png");

writeFileSync("src/lib/plate.json", JSON.stringify({ W, H, photo }, null, 2));
console.log(`plate ${W}x${H}`, photo);
