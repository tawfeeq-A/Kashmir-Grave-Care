"""
Regenerate all PWA icons from icon-512.png source.

- Regular icons: crop/zoom to fill the canvas, removing outer padding.
- Maskable icons: place logo zoomed ~25% larger on solid maroon background 
  (matching logo BG) — eliminates green border artifacts on Android adaptive icons.
- Apple touch icon: 180x180 for proper iPhone display.
"""
from PIL import Image, ImageDraw
import os

ICONS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
SOURCE = os.path.join(ICONS_DIR, "icon-512.png")

# The logo background maroon color (sampled from the image)
BG_COLOR = (58, 18, 18)  # dark maroon matching the logo corners

# Regular icon sizes
REGULAR_SIZES = [48, 72, 96, 120, 128, 144, 152, 192, 384, 512]
# Maskable icon sizes
MASKABLE_SIZES = [192, 512]
# Apple touch icon size
APPLE_SIZE = 180


def crop_to_content(img, padding_pct=0.02):
    """Crop the image to focus on the circular logo, removing dark padding.
    
    We find the bounding box of non-background pixels and crop to that,
    keeping a tiny margin.
    """
    # Convert to RGBA if needed
    rgba = img.convert("RGBA")
    width, height = rgba.size
    
    # Find bounding box of content (non-dark pixels)
    # The logo is on a dark maroon background
    min_x, min_y = width, height
    max_x, max_y = 0, 0
    
    pixels = rgba.load()
    threshold = 45  # pixel brightness threshold to detect content
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # Check if pixel is bright enough to be "content"
            brightness = (r + g + b) / 3
            if brightness > threshold and a > 128:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    
    # Add small padding
    pad = int(max(width, height) * padding_pct)
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(width, max_x + pad)
    max_y = min(height, max_y + pad)
    
    # Make square
    content_w = max_x - min_x
    content_h = max_y - min_y
    size = max(content_w, content_h)
    
    # Center the crop
    cx = (min_x + max_x) // 2
    cy = (min_y + max_y) // 2
    half = size // 2
    
    left = max(0, cx - half)
    top = max(0, cy - half)
    right = min(width, left + size)
    bottom = min(height, top + size)
    
    return rgba.crop((left, top, right, bottom))


def create_regular_icon(source_img, size, output_path):
    """Create a regular icon that fills the canvas with the logo."""
    # Crop to content area first
    cropped = crop_to_content(source_img, padding_pct=0.01)
    
    # Resize to target, filling the entire canvas
    resized = cropped.resize((size, size), Image.LANCZOS)
    
    # Convert to RGB with maroon background (no transparency for icons)
    final = Image.new("RGB", (size, size), BG_COLOR)
    final.paste(resized, (0, 0), resized if resized.mode == "RGBA" else None)
    
    final.save(output_path, "PNG", optimize=True)
    print(f"  Created {os.path.basename(output_path)} ({size}x{size})")


def create_maskable_icon(source_img, size, output_path):
    """Create a maskable icon with the logo zoomed in on solid maroon background.
    
    Maskable icons have a 'safe area' that is 80% of the total icon (10% padding
    on each side). We place the logo content to fill ~90% of the icon area so 
    it's nicely visible even after the OS applies its mask shape.
    """
    # Crop to content area
    cropped = crop_to_content(source_img, padding_pct=0.0)
    
    # The logo should fill about 85% of the icon (leaving ~7.5% padding each side)
    # This ensures it's well within the safe zone while still looking large
    logo_size = int(size * 0.82)
    resized = cropped.resize((logo_size, logo_size), Image.LANCZOS)
    
    # Create solid maroon background
    final = Image.new("RGB", (size, size), BG_COLOR)
    
    # Center the logo
    offset = (size - logo_size) // 2
    if resized.mode == "RGBA":
        final.paste(resized, (offset, offset), resized)
    else:
        final.paste(resized, (offset, offset))
    
    final.save(output_path, "PNG", optimize=True)
    print(f"  Created {os.path.basename(output_path)} ({size}x{size}, maskable)")


def main():
    print(f"Loading source: {SOURCE}")
    source = Image.open(SOURCE)
    print(f"  Source size: {source.size}")
    
    print("\nGenerating regular icons...")
    for size in REGULAR_SIZES:
        output = os.path.join(ICONS_DIR, f"icon-{size}.png")
        create_regular_icon(source, size, output)
    
    print("\nGenerating maskable icons...")
    for size in MASKABLE_SIZES:
        output = os.path.join(ICONS_DIR, f"maskable-{size}.png")
        create_maskable_icon(source, size, output)
    
    print("\nGenerating Apple touch icon (180x180)...")
    apple_output = os.path.join(ICONS_DIR, "apple-touch-icon.png")
    create_regular_icon(source, APPLE_SIZE, apple_output)
    
    # Also update the favicon
    print("\nGenerating favicon (48x48)...")
    favicon_output = os.path.join(ICONS_DIR, "..", "favicon.png")
    create_regular_icon(source, 48, favicon_output)
    
    print("\nDone! All icons regenerated.")


if __name__ == "__main__":
    main()
