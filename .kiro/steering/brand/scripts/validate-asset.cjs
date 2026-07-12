#!/usr/bin/env node
/**
 * validate-asset.cjs
 *
 * Validates marketing assets against brand guidelines.
 * Checks: file naming, dimensions, file size, metadata.
 *
 * Usage:
 *   node validate-asset.cjs <asset-path>
 *   node validate-asset.cjs <asset-path> --json
 *
 * For color validation of images, use with extract-colors.cjs
 */

const fs = require("fs");
const path = require("path");

// Validation rules
const RULES = {
  naming: {
    pattern: /^[a-z]+_[a-z0-9-]+_[a-z0-9-]+_\d{8}(_[a-z0-9-]+)?\.[a-z]+$/,
    description:
      "{type}_{campaign}_{description}_{timestamp}_{variant}.{ext}",
    examples: [
      "banner_claude-launch_hero-image_20251209.png",
      "logo_brand-refresh_horizontal_20251209_dark.svg",
    ],
  },
  dimensions: {
    banner: { minWidth: 600, minHeight: 300 },
    logo: { minWidth: 100, minHeight: 100 },
    design: { minWidth: 800, minHeight: 600 },
    video: { minWidth: 640, minHeight: 480 },
    default: { minWidth: 100, minHeight: 100 },
  },
  fileSize: {
    image: { max: 5 * 1024 * 1024, recommended: 1 * 1024 * 1024 },
    video: { max: 100 * 1024 * 1024, recommended: 50 * 1024 * 1024 },
    svg: { max: 500 * 1024, recommended: 100 * 1024 },
  },
  formats: {
    image: ["png", "jpg", "jpeg", "webp", "gif"],
    vector: ["svg"],
    video: ["mp4", "mov", "webm"],
    document: ["pdf", "psd", "ai", "fig"],
  },
};

/**
 * Pure JS synchronous image dimension parser for PNG, JPEG, GIF, and SVG formats
 */
function getImageDimensions(filepath) {
  let fd;
  try {
    const ext = path.extname(filepath).toLowerCase();
    
    if (ext === '.svg') {
      const content = fs.readFileSync(filepath, 'utf8');
      const svgMatch = content.match(/<svg[^>]*>/i);
      if (svgMatch) {
        const svgTag = svgMatch[0];
        const widthMatch = svgTag.match(/\bwidth=["']([^"']+)["']/i);
        const heightMatch = svgTag.match(/\bheight=["']([^"']+)["']/i);
        const viewBoxMatch = svgTag.match(/\bviewBox=["']([^"']+)["']/i);
        
        let width = null;
        let height = null;
        
        const isPixel = (val) => /^\d+(?:\.\d+)?(?:px)?$/.test(val.trim());
        if (widthMatch && isPixel(widthMatch[1])) width = parseFloat(widthMatch[1]);
        if (heightMatch && isPixel(heightMatch[1])) height = parseFloat(heightMatch[1]);
        
        if ((width === null || height === null) && viewBoxMatch) {
          const parts = viewBoxMatch[1].trim().split(/\s+/);
          if (parts.length === 4) {
            if (width === null) width = parseFloat(parts[2]);
            if (height === null) height = parseFloat(parts[3]);
          }
        }
        
        if (width !== null && height !== null && !isNaN(width) && !isNaN(height)) {
          return { width: Math.round(width), height: Math.round(height) };
        }
      }
      return null;
    }
    
    fd = fs.openSync(filepath, 'r');
    const buffer = Buffer.alloc(30);
    fs.readSync(fd, buffer, 0, 30, 0);

    // WebP
    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      const type = buffer.toString('ascii', 12, 16);
      if (type === 'VP8X') {
        const width = 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16));
        const height = 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16));
        return { width, height };
      }
      if (type === 'VP8L') {
        if (buffer[20] === 0x2f) {
          const b1 = buffer[21], b2 = buffer[22], b3 = buffer[23], b4 = buffer[24];
          const width = 1 + (((b2 & 0x3f) << 8) | b1);
          const height = 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
          return { width, height };
        }
      }
      if (type === 'VP8 ') {
        if (buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
          const width = buffer.readUInt16LE(26) & 0x3FFF;
          const height = buffer.readUInt16LE(28) & 0x3FFF;
          return { width, height };
        }
      }
    }
    
    // PNG
    if (buffer.readUInt32BE(0) === 0x89504E47 && buffer.readUInt32BE(4) === 0x0D0A1A0A) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
    
    // GIF
    if (buffer.toString('ascii', 0, 6) === 'GIF87a' || buffer.toString('ascii', 0, 6) === 'GIF89a') {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height };
    }
    
    // JPEG
    if (buffer.readUInt16BE(0) === 0xFFD8) {
      let offset = 2;
      const fileSize = fs.fstatSync(fd).size;
      const tempBuf = Buffer.alloc(4);
      
      while (offset < fileSize) {
        fs.readSync(fd, tempBuf, 0, 4, offset);
        const marker = tempBuf.readUInt16BE(0);
        const length = tempBuf.readUInt16BE(2);
        
        if (marker === 0xFFC0 || marker === 0xFFC2) {
          const sofBuf = Buffer.alloc(5);
          fs.readSync(fd, sofBuf, 0, 5, offset + 4);
          const height = sofBuf.readUInt16BE(1);
          const width = sofBuf.readUInt16BE(3);
          return { width, height };
        }
        
        offset += length + 2;
      }
    }
    
    return null;
  } catch (err) {
    return null;
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch (e) {}
    }
  }
}

/**
 * Parse asset filename
 */
function parseFilename(filename) {
  const parts = filename.replace(/\.[^.]+$/, "").split("_");

  if (parts.length < 4) {
    return null;
  }

  return {
    type: parts[0],
    campaign: parts[1],
    description: parts[2],
    timestamp: parts[3],
    variant: parts.length > 4 ? parts[4] : null,
    extension: path.extname(filename).slice(1).toLowerCase(),
  };
}

/**
 * Validate filename convention
 */
function validateFilename(filename) {
  const issues = [];
  const suggestions = [];

  // Check pattern match
  if (!RULES.naming.pattern.test(filename)) {
    issues.push("Filename does not match naming convention");
    suggestions.push(`Expected format: ${RULES.naming.description}`);
    suggestions.push(`Examples: ${RULES.naming.examples.join(", ")}`);
  }

  // Parse and check components
  const parsed = parseFilename(filename);
  if (parsed) {
    // Check timestamp format
    if (!/^\d{8}$/.test(parsed.timestamp)) {
      issues.push("Timestamp should be YYYYMMDD format");
    }

    // Check kebab-case for campaign and description
    if (parsed.campaign && !/^[a-z0-9-]+$/.test(parsed.campaign)) {
      issues.push("Campaign name should be kebab-case");
    }

    if (parsed.description && !/^[a-z0-9-]+$/.test(parsed.description)) {
      issues.push("Description should be kebab-case");
    }

    // Check valid type
    const validTypes = [
      "banner",
      "logo",
      "design",
      "video",
      "infographic",
      "icon",
      "photo",
    ];
    if (!validTypes.includes(parsed.type)) {
      suggestions.push(`Consider using type: ${validTypes.join(", ")}`);
    }
  }

  return { valid: issues.length === 0, issues, suggestions, parsed };
}

/**
 * Validate file size
 */
function validateFileSize(filepath, extension) {
  const issues = [];
  const warnings = [];

  const stats = fs.statSync(filepath);
  const size = stats.size;

  // Skip file size limit checks for document formats (pdf, psd, ai, fig)
  if (RULES.formats.document.includes(extension)) {
    return { valid: true, issues, warnings, size };
  }

  let limits;
  if (RULES.formats.video.includes(extension)) {
    limits = RULES.fileSize.video;
  } else if (extension === "svg") {
    limits = RULES.fileSize.svg;
  } else {
    limits = RULES.fileSize.image;
  }

  if (size > limits.max) {
    issues.push(
      `File size (${formatBytes(size)}) exceeds maximum (${formatBytes(
        limits.max
      )})`
    );
  } else if (size > limits.recommended) {
    warnings.push(
      `File size (${formatBytes(size)}) exceeds recommended (${formatBytes(
        limits.recommended
      )})`
    );
  }

  return { valid: issues.length === 0, issues, warnings, size };
}

/**
 * Validate file format
 */
function validateFormat(extension) {
  const issues = [];
  const info = { category: null };

  const allFormats = [
    ...RULES.formats.image,
    ...RULES.formats.vector,
    ...RULES.formats.video,
    ...RULES.formats.document,
  ];

  if (!allFormats.includes(extension)) {
    issues.push(`Unsupported file format: .${extension}`);
    return { valid: false, issues, info };
  }

  // Determine category
  if (RULES.formats.image.includes(extension)) info.category = "image";
  else if (RULES.formats.vector.includes(extension)) info.category = "vector";
  else if (RULES.formats.video.includes(extension)) info.category = "video";
  else if (RULES.formats.document.includes(extension))
    info.category = "document";

  return { valid: true, issues, info };
}

/**
 * Check if asset exists in manifest and check required properties
 */
function checkManifest(filepath) {
  const manifestPath = path.join(process.cwd(), ".assets", "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    return { registered: false, message: "Manifest not found" };
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const relativePath = path.relative(process.cwd(), filepath);
    const found = manifest.assets?.find(
      (a) => a.path === relativePath || a.path === filepath
    );

    if (!found) {
      return {
        registered: false,
        message: "Asset not in manifest",
        asset: null
      };
    }

    // Schema validation
    const requiredProps = ["id", "name", "type", "path", "dimensions", "fileSize", "mimeType", "tags", "status"];
    const missingProps = requiredProps.filter(prop => !(prop in found));
    
    if (missingProps.length > 0) {
      return {
        registered: true,
        schemaValid: false,
        message: `Asset registered, but missing manifest schema properties: ${missingProps.join(", ")}`,
        asset: found,
        missingProperties: missingProps
      };
    }

    return {
      registered: true,
      schemaValid: true,
      message: "Asset registered and valid in manifest",
      asset: found,
    };
  } catch {
    return { registered: false, message: "Error reading manifest" };
  }
}

/**
 * Generate suggested filename
 */
function suggestFilename(original, parsed) {
  if (!parsed) return null;

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const type = parsed.type || "asset";
  const campaign = parsed.campaign || "general";
  const description = parsed.description || "untitled";
  const ext = parsed.extension || "png";

  return `${type}_${campaign}_${description}_${today}.${ext}`;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Main validation function
 */
function validateAsset(assetPath) {
  const results = {
    path: assetPath,
    filename: path.basename(assetPath),
    valid: true,
    issues: [],
    warnings: [],
    suggestions: [],
    checks: {},
  };

  // Check file exists
  if (!fs.existsSync(assetPath)) {
    results.valid = false;
    results.issues.push(`File not found: ${assetPath}`);
    return results;
  }

  const filename = path.basename(assetPath);
  const extension = path.extname(filename).slice(1).toLowerCase();

  // 1. Validate filename
  const filenameResult = validateFilename(filename);
  results.checks.filename = filenameResult;
  if (!filenameResult.valid) {
    results.issues.push(...filenameResult.issues);
    results.suggestions.push(...filenameResult.suggestions);
  }

  // 2. Validate format
  const formatResult = validateFormat(extension);
  results.checks.format = formatResult;
  if (!formatResult.valid) {
    results.issues.push(...formatResult.issues);
  }

  // 3. Validate file size
  const sizeResult = validateFileSize(assetPath, extension);
  results.checks.fileSize = sizeResult;
  if (!sizeResult.valid) {
    results.issues.push(...sizeResult.issues);
  }
  results.warnings.push(...sizeResult.warnings);

  // 4. Check manifest registration and schema
  const manifestResult = checkManifest(assetPath);
  results.checks.manifest = manifestResult;
  if (!manifestResult.registered) {
    results.warnings.push("Asset not registered in manifest.json");
    results.suggestions.push(
      "Register asset in .assets/manifest.json for tracking"
    );
  } else if (!manifestResult.schemaValid) {
    results.issues.push(manifestResult.message);
  }

  // 5. Suggest corrected filename if needed
  if (!filenameResult.valid && filenameResult.parsed) {
    const suggested = suggestFilename(filename, filenameResult.parsed);
    if (suggested) {
      results.suggestions.push(`Suggested filename: ${suggested}`);
    }
  }

  // 6. Validate dimensions if image/vector
  if (formatResult.valid && (formatResult.info.category === "image" || formatResult.info.category === "vector")) {
    const dim = getImageDimensions(assetPath);
    results.checks.dimensions = dim;
    if (dim) {
      const type = filenameResult.parsed?.type || "default";
      const limits = RULES.dimensions[type] || RULES.dimensions.default;
      if (dim.width < limits.minWidth || dim.height < limits.minHeight) {
        results.issues.push(
          `Image dimensions (${dim.width}x${dim.height}) are below the minimum required for ${type} (${limits.minWidth}x${limits.minHeight})`
        );
      }
    } else {
      results.issues.push("Could not parse image dimensions");
    }
  }

  // Overall validity
  results.valid = results.issues.length === 0;

  return results;
}

/**
 * Format output for console
 */
function formatOutput(results) {
  const lines = [];

  lines.push("\n" + "=".repeat(60));
  lines.push(`ASSET VALIDATION: ${results.filename}`);
  lines.push("=".repeat(60));

  lines.push(`\nStatus: ${results.valid ? "PASS" : "FAIL"}`);
  lines.push(`Path: ${results.path}`);

  if (results.issues.length > 0) {
    lines.push("\nISSUES:");
    results.issues.forEach((issue) => lines.push(`  - ${issue}`));
  }

  if (results.warnings.length > 0) {
    lines.push("\nWARNINGS:");
    results.warnings.forEach((warning) => lines.push(`  - ${warning}`));
  }

  if (results.suggestions.length > 0) {
    lines.push("\nSUGGESTIONS:");
    results.suggestions.forEach((suggestion) =>
      lines.push(`  - ${suggestion}`)
    );
  }

  // File size info
  if (results.checks.fileSize?.size) {
    lines.push(`\nFile Size: ${formatBytes(results.checks.fileSize.size)}`);
  }

  // Dimension info
  if (results.checks.dimensions) {
    lines.push(`Dimensions: ${results.checks.dimensions.width}x${results.checks.dimensions.height}`);
  }

  lines.push("\n" + "=".repeat(60));

  return lines.join("\n");
}

/**
 * Main
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes("--fix")) {
    console.error("Error: --fix option is not supported.");
    process.exit(1);
  }

  const jsonOutput = args.includes("--json");
  const assetPath = args.find((a) => !a.startsWith("--"));

  if (!assetPath) {
    console.error("Usage: node validate-asset.cjs <asset-path> [--json]");
    console.error("\nExamples:");
    console.error(
      "  node validate-asset.cjs assets/banners/social-media/banner_launch_hero_20251209.png"
    );
    console.error(
      "  node validate-asset.cjs assets/logos/icon-only/logo-icon.svg --json"
    );
    process.exit(1);
  }

  // Resolve path
  const resolvedPath = path.isAbsolute(assetPath)
    ? assetPath
    : path.join(process.cwd(), assetPath);

  // Validate
  const results = validateAsset(resolvedPath);

  // Output
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(formatOutput(results));
  }

  // Exit with appropriate code
  process.exit(results.valid ? 0 : 1);
}

main();
