const fs = require('fs');
const PNG = require('pngjs').PNG;

const data = fs.readFileSync('reference/1.png');
const png = PNG.sync.read(data);

// Create a copy of reference/1.png
const outPng = new PNG({ width: png.width, height: png.height });
png.data.copy(outPng.data);

// Function to fill rectangle with color (r, g, b)
function fillRect(x1, y1, x2, y2, r, g, b) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      if (x >= 0 && x < outPng.width && y >= 0 && y < outPng.height) {
        const idx = (outPng.width * y + x) << 2;
        outPng.data[idx] = r;
        outPng.data[idx + 1] = g;
        outPng.data[idx + 2] = b;
        outPng.data[idx + 3] = 255;
      }
    }
  }
}

// Function to fill circle with color (r, g, b)
function fillCircle(cx, cy, radius, r, g, b) {
  const r2 = radius * radius;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        if (x >= 0 && x < outPng.width && y >= 0 && y < outPng.height) {
          const idx = (outPng.width * y + x) << 2;
          outPng.data[idx] = r;
          outPng.data[idx + 1] = g;
          outPng.data[idx + 2] = b;
          outPng.data[idx + 3] = 255;
        }
      }
    }
  }
}

// Fill photo circle interior (inside white ring, cx=352.5, cy=590, radius=195) with transparent or placeholder dark
// Radius of white inner edge is ~195px
fillCircle(352.5, 590, 195, 0, 26, 29); // #001A1D

// Fill Name area: x=140..580, y=915..1065
fillRect(140, 915, 580, 1065, 0, 26, 29);

// Fill Role line area: x=140..600, y=1070..1115
fillRect(140, 1070, 600, 1115, 0, 26, 29);

// Fill Team name value area inside box: x=230..580, y=1180..1220
fillRect(230, 1180, 580, 1220, 0, 27, 30);

// Fill X username value area inside box: x=230..580, y=1260..1300
fillRect(230, 1260, 580, 1300, 0, 27, 30);

// Fill QR code & Pass ID area inside box: x=640..860, y=1150..1320
fillRect(640, 1150, 860, 1320, 0, 27, 30);

// Save as public/base_plate.png
const buffer = PNG.sync.write(outPng);
fs.writeFileSync('public/base_plate.png', buffer);
console.log('Successfully generated public/base_plate.png from reference/1.png');
