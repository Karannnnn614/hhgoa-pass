import sharp from "sharp";

async function generateCleanBackdrop() {
  const inputPath = "public/hero-poster.webp";
  const outputPath = "public/hero-backdrop-full.webp";

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width || 1664;
  const height = metadata.height || 936;

  // Create SVG masks with smooth radial falloffs matching poster artwork background
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}">
      <defs>
        <!-- Sky & Title central sky gradient mask -->
        <linearGradient id="centerGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#001C1E" />
          <stop offset="60%" stop-color="#001F21" />
          <stop offset="100%" stop-color="#002224" />
        </linearGradient>

        <!-- CTA & Sunset region mask -->
        <linearGradient id="ctaGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#002224" />
          <stop offset="100%" stop-color="#0B2525" />
        </linearGradient>

        <!-- Water region mask -->
        <linearGradient id="waterGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#002022" />
          <stop offset="100%" stop-color="#001C1E" />
        </linearGradient>
      </defs>

      <!-- 1. Top Navbar left logo, links, and right icons patch -->
      <rect x="0" y="0" width="280" height="90" fill="#001C1E" />
      <rect x="480" y="0" width="700" height="90" fill="#001C1E" />
      <rect x="1340" y="0" width="324" height="90" fill="#001C1E" />

      <!-- 2. "GOA INDIA 2026" & "HACKER HOUSE" Title Fill -->
      <rect x="350" y="105" width="964" height="360" rx="20" fill="url(#centerGlow)" />

      <!-- 3. Subtitle & CTA Button Fill -->
      <rect x="500" y="460" width="664" height="165" rx="20" fill="url(#ctaGlow)" />

      <!-- 4. Info bar & footer tagline Fill -->
      <rect x="440" y="780" width="784" height="156" rx="20" fill="url(#waterGlow)" />
    </svg>
  `);

  await image
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .webp({ quality: 96 })
    .toFile(outputPath);

  console.log("Clean backdrop saved to:", outputPath);
}

generateCleanBackdrop().catch(console.error);
