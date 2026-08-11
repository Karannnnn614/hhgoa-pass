const sharp = require("sharp");
const OUT = process.env.SHOT_DIR;

(async () => {
  const w = 1000,
    h = 1574;
  let g = "";
  for (let x = 0; x <= w; x += 100) {
    g += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#00ff00" stroke-width="2"/>`;
    g += `<text x="${x + 5}" y="26" fill="#00ff00" font-size="24" font-family="monospace">${x}</text>`;
  }
  for (let y = 0; y <= h; y += 100) {
    g += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#00ff00" stroke-width="2"/>`;
    g += `<text x="6" y="${y - 8}" fill="#00ff00" font-size="24" font-family="monospace">${y}</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${g}</svg>`;
  await sharp("public/ref-card.png")
    .composite([{ input: Buffer.from(svg) }])
    .png()
    .toFile(`${OUT}/ref-grid.png`);
  console.log("grid written");
})();
