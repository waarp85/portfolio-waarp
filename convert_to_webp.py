#!/usr/bin/env python3
"""
WebP Converter Script
Converts all JPG/PNG images to WebP format and updates HTML references.
"""

import os
import re
from pathlib import Path
from PIL import Image

# Configuration
PROJECT_ROOT = Path(__file__).parent
IMAGES_DIR = PROJECT_ROOT / "assets" / "images"
QUALITY = 85  # WebP quality (0-100)
EXTENSIONS = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}

def convert_to_webp(image_path: Path) -> Path:
    """Convert a single image to WebP format."""
    webp_path = image_path.with_suffix('.webp')
    
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary (for PNG with transparency, use RGBA)
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                # Keep transparency
                img.save(webp_path, 'WEBP', quality=QUALITY, lossless=False)
            else:
                # Convert to RGB for JPG
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(webp_path, 'WEBP', quality=QUALITY)
        
        original_size = image_path.stat().st_size
        webp_size = webp_path.stat().st_size
        savings = ((original_size - webp_size) / original_size) * 100
        
        print(f"[OK] {image_path.name} -> {webp_path.name} (saved {savings:.1f}%)")
        return webp_path
    except Exception as e:
        print(f"[ERROR] Error converting {image_path.name}: {e}")
        return None

def find_images(directory: Path) -> list:
    """Find all JPG/PNG images in directory and subdirectories."""
    images = []
    for ext in EXTENSIONS:
        images.extend(directory.rglob(f"*{ext}"))
    return images

def update_html_references(project_root: Path, old_ext: str, new_ext: str = '.webp'):
    """Update all HTML files to reference WebP images."""
    html_files = list(project_root.glob("*.html"))
    
    for html_file in html_files:
        content = html_file.read_text(encoding='utf-8')
        original_content = content
        
        # Replace image extensions in src attributes
        for ext in ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']:
            # Match src="...ext" or src='...ext'
            pattern = rf'(src=["\'][^"\']*){re.escape(ext)}(["\'])'
            content = re.sub(pattern, rf'\1.webp\2', content)
        
        if content != original_content:
            html_file.write_text(content, encoding='utf-8')
            print(f"[UPDATED] Updated: {html_file.name}")

def main():
    print("=" * 50)
    print("WebP Converter - Starting...")
    print("=" * 50)
    
    # Find all images
    images = find_images(IMAGES_DIR)
    print(f"\nFound {len(images)} images to convert.\n")
    
    # Convert each image
    converted = 0
    for img_path in images:
        # Skip if WebP already exists
        webp_path = img_path.with_suffix('.webp')
        if webp_path.exists():
            print(f"[SKIP] Skipping {img_path.name} (WebP exists)")
            continue
        
        if convert_to_webp(img_path):
            converted += 1
    
    print(f"\n[DONE] Converted {converted} images to WebP.")
    
    # Update HTML references
    print("\n" + "=" * 50)
    print("Updating HTML references...")
    print("=" * 50 + "\n")
    
    update_html_references(PROJECT_ROOT, '.jpg')
    
    print("\n[DONE] Done! All images converted and HTML updated.")
    print("\nNote: Original files kept. Delete them manually after verification.")

if __name__ == "__main__":
    main()
