const fs = require('fs');
const PNG = require('pngjs').PNG;

const data = fs.readFileSync('reference/1.png');
const png = PNG.sync.read(data);

console.log('PNG size:', png.width, 'x', png.height);

// Find green pixels (approx R < 160, G > 140, B < 40) for photo ring
let greenPixels = [];
for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    
    // Check for lime green ring color (e.g. R: 130..150, G: 160..180, B: 0..30)
    if (r > 100 && g > 130 && b < 60 && r < 170 && g < 200) {
      greenPixels.push({ x, y, r, g, b });
    }
  }
}

if (greenPixels.length > 0) {
  const xs = greenPixels.map(p => p.x);
  const ys = greenPixels.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  console.log('Green ring bounds:', { minX, maxX, minY, maxY });
  console.log('Green ring center:', { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 });
  console.log('Green ring outer diameter:', maxX - minX, 'height:', maxY - minY);
} else {
  console.log('No green pixels found with strict condition, checking sample colors around y=500..700, x=200..500');
}
