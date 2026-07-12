/**
 * PWA Icon Generator
 * Generates all required icon sizes from the 512x512 source icon.
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Requires: sharp (installed as devDependency)
 * 
 * Standard icons: fit "cover" — the logo fills the full icon with no
 * green padding, so the logo's own dark background IS the icon bg.
 * 
 * Maskable icons: 10% safe-zone padding on brand-green (#1E5C45)
 * background, per the maskable spec.
 * 
 * Outputs:
 *   public/icons/icon-48..512.png   (standard, full-bleed logo)
 *   public/icons/maskable-192.png   (maskable, padded)
 *   public/icons/maskable-512.png   (maskable, padded)
 *   public/favicon.png              (48x48)
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SOURCE = path.join(__dirname, "..", "public", "icons", "icon-512.png");
const OUT_DIR = path.join(__dirname, "..", "public", "icons");
const FAVICON_DIR = path.join(__dirname, "..", "public");

const SIZES = [48, 72, 96, 128, 144, 152, 192, 384, 512];
const MASKABLE_SIZES = [192, 512];

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const sourceBuffer = fs.readFileSync(SOURCE);

  // Generate standard icons — fit:"cover" so the logo fills the icon fully.
  // No green background padding. The logo's own dark circular background
  // becomes the visible icon background.
  for (const size of SIZES) {
    const outPath = path.join(OUT_DIR, `icon-${size}.png`);
    await sharp(sourceBuffer)
      .resize(size, size, { fit: "cover" })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outPath);
    console.log(`✓ icon-${size}.png (cover, no bg padding)`);
  }

  // Generate maskable icons (with 10% safe zone padding on brand background)
  for (const size of MASKABLE_SIZES) {
    const outPath = path.join(OUT_DIR, `maskable-${size}.png`);
    const innerSize = Math.round(size * 0.8); // 80% of canvas = 10% padding each side
    
    const inner = await sharp(sourceBuffer)
      .resize(innerSize, innerSize, { fit: "cover" })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 30, g: 92, b: 69, alpha: 255 }, // brand green #1E5C45
      },
    })
      .composite([{ input: inner, gravity: "center" }])
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outPath);
    console.log(`✓ maskable-${size}.png (safe-zone padded)`);
  }

  // Generate favicon (48x48 PNG — full-bleed, no bg padding)
  const faviconPath = path.join(FAVICON_DIR, "favicon.png");
  await sharp(sourceBuffer)
    .resize(48, 48, { fit: "cover" })
    .png({ quality: 90 })
    .toFile(faviconPath);
  console.log(`✓ favicon.png (cover)`);

  console.log("\n✅ All PWA icons generated successfully!");
}

generateIcons().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
