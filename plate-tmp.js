const sharp = require("sharp");
const fs = require("fs");

/**
 * Builds public/plate.png — the mockup artwork with the sample portrait and
 * sample text removed, cropped flush to the card (the AI mockup's white
 * page border is discarded). The app composites the user's photo into the
 * circular hole and draws live text on top.
 *
 * All coordinates below were measured off a gridded render of the plate.
 */
(async () => {
  const SRC =
    "C:/Users/karan/Desktop/Builder pass/WhatsApp Image 2026-08-11 at 11.59.44.jpeg";

  // --- detect the card body (dark region on the near-white page) ---
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

  // Inset a few px so the mockup's soft white edge/shadow is excluded.
  const INSET = 4;
  const CARD = {
    left: left + INSET,
    top: top + INSET,
    width: right - left + 1 - INSET * 2,
    height: bottom - top + 1 - INSET * 2,
  };

  const W = 1000;
  const H = Math.round((CARD.height / CARD.width) * W);
  console.log("card:", CARD, "->", W + "x" + H);

  const card = await sharp(SRC)
    .extract(CARD)
    .resize(W, H, { fit: "fill" })
    .png()
    .toBuffer();

  // --- geometry measured off the gridded plate (1000x1625) ---
  const S = H / 1625; // scale if the detected height differs
  const photo = {
    cx: Math.round(305 * (W / 1000)),
    cy: Math.round(620 * S),
    r: Math.round(228 * (W / 1000)),
  };

  const r = (x1, y1, x2, y2, pad = 0) =>
    `<rect x="${x1 * (W / 1000) - pad}" y="${y1 * S - pad}" width="${(x2 - x1) * (W / 1000) + pad * 2}" height="${(y2 - y1) * S + pad * 2}" fill="rgb(BGR)"/>`;

  // background colour sampled from a clear patch, low-left
  const c2 = await sharp(card).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const at2 = (x, y) => {
    const i = (y * c2.info.width + x) * c2.info.channels;
    return [c2.data[i], c2.data[i + 1], c2.data[i + 2]];
  };
  const bg = at2(Math.round(W * 0.06), Math.round(H * 0.70));
  const FILL = `rgb(${bg[0]},${bg[1]},${bg[2]})`;
  console.log("bg:", FILL, " photo:", photo);

  const erase = [
    r(45, 970, 680, 1245), // BHAVYA MADAN + "Builder · Developer · AI/ML"
    r(150, 1300, 660, 1375), // builder id value
    r(150, 1395, 660, 1470), // event dates value
    r(630, 1265, 910, 1500), // sample QR
  ]
    .join("")
    .replaceAll("rgb(BGR)", FILL);

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

  // Punch the photo hole: dest-out removes wherever the mask is opaque,
  // so the mask is transparent everywhere except the circle.
  const mask = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
         <circle cx="${photo.cx}" cy="${photo.cy}" r="${photo.r}" fill="#000"/>
       </svg>`,
    ),
  )
    .png()
    .toBuffer();

  await sharp(plate)
    .composite([{ input: mask, blend: "dest-out" }])
    .png()
    .toFile("public/plate.png");

  fs.writeFileSync(
    "src/lib/plate.json",
    JSON.stringify({ W, H, photo }, null, 2),
  );
  console.log("wrote public/plate.png + src/lib/plate.json");
})();
