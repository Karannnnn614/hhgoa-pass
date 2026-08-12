const fs = require('fs');
const PNG = require('pngjs').PNG;

const data = fs.readFileSync('reference/Frame.png');
const png = PNG.sync.read(data);

// Create a copy of reference/Frame.png
const outPng = new PNG({ width: png.width, height: png.height });
png.data.copy(outPng.data);

// Function to clear circle interior (make transparent inside inner white ring)
function clearCircle(cx, cy, radius) {
  const r2 = radius * radius;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        if (x >= 0 && x < outPng.width && y >= 0 && y < outPng.height) {
          const idx = (outPng.width * y + x) << 2;
          outPng.data[idx] = 0;
          outPng.data[idx + 1] = 0;
          outPng.data[idx + 2] = 0;
          outPng.data[idx + 3] = 0; // Transparent
        }
      }
    }
  }
}

// 1. Clear photo circle interior (inside white ring, cx=351.5, cy=590, radius=191)
clearCircle(351.5, 590, 191);

// Save as public/base_plate.png
const buffer = PNG.sync.write(outPng);
fs.writeFileSync('public/base_plate.png', buffer);
console.log('Successfully regenerated public/base_plate.png from reference/Frame.png');

