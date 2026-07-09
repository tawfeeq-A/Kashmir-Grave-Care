/**
 * PWA Icon Generator
 * Generates all required icon sizes from the 512x512 source icon.
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Requires: sharp (installed as devDependency)
 * 
 * Outputs:
 *   public/icons/icon-48.png
 *   public/icons/icon-72.png
 *   public/icons/icon-96.png
 *   public/icons/icon-128.png
 *   public/icons/icon-144.png
 *   public/icons/icon-152.png
 *   public/icons/icon-192.png
 *   public/icons/icon-384.png
 *   public/icons/icon-512.png
 *   public/icons/maskable-192.png
 *   public/icons/maskable-512.png
 *   public/favicon.ico (48x48)
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

  // Generate standard icons
  for (const size of SIZES) {
    const outPath = path.join(OUT_DIR, `icon-${size}.png`);
    await sharp(sourceBuffer)
      .resize(size, size, { fit: "contain", background: { r: 30, g: 92, b: 69, alpha: 1 } })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outPath);
    console.log(`✓ icon-${size}.png`);
  }

  // Generate maskable icons (with 10% safe zone padding on brand background)
  for (const size of MASKABLE_SIZES) {
    const outPath = path.join(OUT_DIR, `maskable-${size}.png`);
    const innerSize = Math.round(size * 0.8); // 80% of canvas = 10% padding each side
    
    const inner = await sharp(sourceBuffer)
      .resize(innerSize, innerSize, { fit: "contain", background: { r: 30, g: 92, b: 69, alpha: 1 } })
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
    console.log(`✓ maskable-${size}.png`);
  }

  // Generate favicon (48x48 PNG — modern browsers support PNG favicons)
  const faviconPath = path.join(FAVICON_DIR, "favicon.png");
  await sharp(sourceBuffer)
    .resize(48, 48, { fit: "contain", background: { r: 30, g: 92, b: 69, alpha: 1 } })
    .png({ quality: 90 })
    .toFile(faviconPath);
  console.log(`✓ favicon.png`);

  console.log("\n✅ All PWA icons generated successfully!");
}

generateIcons().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
