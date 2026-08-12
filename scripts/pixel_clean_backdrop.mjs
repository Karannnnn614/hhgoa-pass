import sharp from "sharp";

async function generateSeamlessInpaintedBackdrop() {
  const inputPath = "public/hero-poster.webp";
  const outputPath = "public/hero-backdrop-full.webp";

  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const getIdx = (x, y) => (y * width + x) * channels;

  // Helper: detect bright text pixels (cream, off-white, bright pink button text)
  const isTextPixel = (r, g, b) => {
    // Cream headline/text
    const isCream = r > 165 && g > 155 && b > 125;
    // Bright pink CTA button text / borders
    const isPinkCTA = r > 210 && g < 120 && b > 80;
    return isCream || isPinkCTA;
  };

  // Create a boolean mask of text pixels
  const isText = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIdx(x, y);
      if (isTextPixel(data[idx], data[idx + 1], data[idx + 2])) {
        isText[y * width + x] = 1;
      }
    }
  }

  // Horizontally inpaint text pixels using non-text neighbors on left and right
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      if (!isText[pos]) continue;

      // Find nearest non-text pixel to the left
      let xLeft = x - 1;
      while (xLeft >= 0 && isText[y * width + xLeft]) {
        xLeft--;
      }

      // Find nearest non-text pixel to the right
      let xRight = x + 1;
      while (xRight < width && isText[y * width + xRight]) {
        xRight++;
      }

      const idx = getIdx(x, y);

      if (xLeft >= 0 && xRight < width) {
        const idxL = getIdx(xLeft, y);
        const idxR = getIdx(xRight, y);
        const factor = (x - xLeft) / (xRight - xLeft);

        data[idx] = Math.round(data[idxL] * (1 - factor) + data[idxR] * factor);
        data[idx + 1] = Math.round(data[idxL + 1] * (1 - factor) + data[idxR + 1] * factor);
        data[idx + 2] = Math.round(data[idxL + 2] * (1 - factor) + data[idxR + 2] * factor);
      } else if (xLeft >= 0) {
        const idxL = getIdx(xLeft, y);
        data[idx] = data[idxL];
        data[idx + 1] = data[idxL + 1];
        data[idx + 2] = data[idxL + 2];
      } else if (xRight < width) {
        const idxR = getIdx(xRight, y);
        data[idx] = data[idxR];
        data[idx + 1] = data[idxR + 1];
        data[idx + 2] = data[idxR + 2];
      }
    }
  }

  await sharp(data, {
    raw: { width, height, channels },
  })
    .webp({ quality: 96 })
    .toFile(outputPath);

  console.log("Horizontally inpainted seamless backdrop saved to:", outputPath);
}

generateSeamlessInpaintedBackdrop().catch(console.error);

