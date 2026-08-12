const fs = require('fs');
const PNG = require('pngjs').PNG;

const data = fs.readFileSync('reference/1.png');
const png = PNG.sync.read(data);

const cy = 590;
console.log(`Sampling x line at y=${cy}:`);
for (let x = 140; x <= 580; x += 5) {
  const idx = (png.width * cy + x) << 2;
  const r = png.data[idx];
  const g = png.data[idx + 1];
  const b = png.data[idx + 2];
  const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  console.log(`x=${x}: ${hex} (r:${r}, g:${g}, b:${b})`);
}
