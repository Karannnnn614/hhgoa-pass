const { chromium } = require("playwright");
const sharp = require("sharp");
const path = require("path");
const OUT = process.env.SHOT_DIR;
const REF = "C:/Users/karan/Desktop/Builder pass/hhgoa-pass/public/ref-card.png";

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));

  await page.goto("http://localhost:3000");
  const skip = page.getByRole("button", { name: /skip intro/i });
  if (await skip.isVisible().catch(() => false)) await skip.click();
  await page.waitForTimeout(700);

  // use the reference portrait itself so the photo slot matches
  await page.setInputFiles('input[type="file"]', path.join(OUT, "face.jpg"));
  await page.waitForTimeout(1600);
  await page.getByPlaceholder("Bhavya Madan").fill("Bhavya Madan");
  await page
    .getByPlaceholder("React · Rust · AI")
    .fill("Builder · Developer · AI/ML");
  await page.waitForTimeout(900);

  const [dl] = await Promise.all([
    page.waitForEvent("download", { timeout: 45000 }).catch(() => null),
    page.getByRole("button", { name: /download png/i }).click(),
  ]);
  if (!dl) {
    console.log("no download");
    await b.close();
    return;
  }
  const mine = path.join(OUT, "mine.png");
  await dl.saveAs(mine);

  // normalise both to the same size and stitch side by side
  const H = 1400;
  const a = await sharp(REF).resize({ height: H }).toBuffer();
  const c = await sharp(mine).resize({ height: H }).toBuffer();
  const am = await sharp(a).metadata();
  const cm = await sharp(c).metadata();

  await sharp({
    create: {
      width: am.width + cm.width + 30,
      height: H,
      channels: 3,
      background: "#111",
    },
  })
    .composite([
      { input: a, left: 0, top: 0 },
      { input: c, left: am.width + 30, top: 0 },
    ])
    .png()
    .toFile(path.join(OUT, "side-by-side.png"));

  console.log("ref", am.width + "x" + H, " mine", cm.width + "x" + H);
  console.log("errors:", errs.length ? errs : "none");
  await b.close();
})();
