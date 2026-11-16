import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

out_dir = r'E:\Гоша\frontend\public\products'
os.makedirs(out_dir, exist_ok=True)

bear_path = os.path.join(out_dir, 'bear-smile.png')
bear_img = Image.open(bear_path).convert('RGBA')
w, h = bear_img.size

arr = np.array(bear_img)
blank = arr.copy()

# Sample dark cotton texture from shoulder region
cotton_patch = arr[220:300, 160:240]
mean_color = np.median(cotton_patch[cotton_patch[:, :, 3] > 200, :3], axis=0).astype(int)

# 1. Mask out print to get clean blank black t-shirt
body_mask = blank[:, :, 3] > 100
print_mask = np.zeros((h, w), dtype=bool)
print_mask[130:820, 240:730] = True
is_bright = (blank[:, :, 0].astype(int) + blank[:, :, 1].astype(int) + blank[:, :, 2].astype(int)) > 85
remove_mask = body_mask & print_mask & is_bright

remove_mask_img = Image.fromarray(remove_mask.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(7))
remove_mask = np.array(remove_mask_img) > 0

np.random.seed(42)
noise = np.random.randint(-4, 5, size=(h, w, 3))
filled_rgb = np.clip(mean_color + noise, 12, 28)
blank[remove_mask, :3] = filled_rgb[remove_mask]

blank_black_img = Image.fromarray(blank).filter(ImageFilter.GaussianBlur(radius=0.7))

# Extract the Bear & Text Print overlay (with alpha) from bear-smile.png
# Everything inside print_mask that is bright or saturated
bear_arr = np.array(bear_img, dtype=np.float32)
bear_alpha = bear_arr[:, :, 3] / 255.0
bear_gray = bear_arr[:, :, 0] * 0.299 + bear_arr[:, :, 1] * 0.587 + bear_arr[:, :, 2] * 0.114
max_c = np.max(bear_arr[:, :, :3], axis=2)
min_c = np.min(bear_arr[:, :, :3], axis=2)
sat = np.zeros_like(bear_gray)
nz = max_c > 0
sat[nz] = (max_c[nz] - min_c[nz]) / (max_c[nz] + 1e-5)

is_bear_print = (bear_alpha > 0.2) & print_mask & ((bear_gray > 55) | (sat > 0.18))
bear_print_overlay = np.zeros_like(bear_arr)
bear_print_overlay[is_bear_print] = bear_arr[is_bear_print]
# Smooth edges of print overlay
overlay_alpha_img = Image.fromarray((is_bear_print * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=0.8))
bear_print_overlay[:, :, 3] = np.array(overlay_alpha_img)

# 2. Build blank t-shirts for all 6 colors
colors_def = {
    'black-sesame': {'type': 'black'},
    'cold-ice': {'base': [238, 238, 244], 'shadow': 0.65, 'floor': 140, 'ceil': 255},
    'mana-cyan': {'base': [0, 215, 245], 'shadow': 0.55, 'floor': 0, 'ceil': 255},
    'acid-lime': {'base': [155, 215, 70], 'shadow': 0.55, 'floor': 0, 'ceil': 255},
    'cyber-pink': {'base': [255, 40, 115], 'shadow': 0.55, 'floor': 0, 'ceil': 255},
    'velvet-indigo': {'base': [45, 15, 75], 'shadow': 0.70, 'floor': 0, 'ceil': 200},
}

blank_arr = np.array(blank_black_img, dtype=np.float32)
b_alpha = blank_arr[:, :, 3] / 255.0
b_gray = blank_arr[:, :, 0] * 0.299 + blank_arr[:, :, 1] * 0.587 + blank_arr[:, :, 2] * 0.114
tshirt_mask = b_alpha > 0.3

# Fold factor from fabric luminosity (mean dark cotton is ~20)
fold_factor = np.clip(b_gray / 20.0, 0.45, 1.6)[:, :, None]

blank_images = {}
for c_code, c_cfg in colors_def.items():
    if c_cfg.get('type') == 'black':
        blank_images[c_code] = blank_black_img.copy()
    else:
        c_base = np.array(c_cfg['base'], dtype=np.float32)[None, None, :]
        if c_code == 'cold-ice':
            # White cotton: folds are darker
            shading = np.clip(0.60 + 0.40 * (b_gray / 20.0), 0.50, 1.10)[:, :, None]
            c_rgb = np.clip(c_base * shading, c_cfg['floor'], c_cfg['ceil'])
        elif c_code == 'velvet-indigo':
            # Dark purple: dark tone
            shading = np.clip(0.60 + 0.40 * fold_factor, 0.50, 1.40)
            c_rgb = np.clip(c_base * shading, c_cfg['floor'], c_cfg['ceil'])
        else:
            # Saturated neon cotton (cyan, lime, pink)
            shading = np.clip(0.55 + 0.45 * fold_factor, 0.40, 1.35)
            c_rgb = np.clip(c_base * shading, c_cfg['floor'], c_cfg['ceil'])
        
        c_out = blank_arr.copy()
        c_out[tshirt_mask, :3] = c_rgb[tshirt_mask]
        blank_images[c_code] = Image.fromarray(np.clip(c_out, 0, 255).astype(np.uint8))

print("Created blank t-shirt templates for all 6 colors!")

# Helper to draw graphics on top of a blank image
def apply_print_to_blank(blank_img_in, design_key, color_code):
    result = blank_img_in.copy()
    draw = ImageDraw.Draw(result)
    is_light = (color_code == 'cold-ice')
    primary_text = "#120722" if is_light else "#FFFFFF"
    sub_text = "#00B4D8" if is_light else "#00E6FF"
    
    if design_key == 'bear-smile':
        if color_code == 'black-sesame':
            return bear_img.copy()
        else:
            # Composite bear print overlay on top of colored shirt
            # On white shirt, keep colors vibrant with subtle shadow
            ov_img = Image.fromarray(bear_print_overlay.astype(np.uint8))
            result.alpha_composite(ov_img)
            return result

    elif design_key == 'rabbit-anarchy':
        cx, cy = w // 2, 460
        draw.text((cx - 160, 160), "ANARCHY", fill=primary_text, font_size=64, stroke_width=2, stroke_fill=primary_text)
        draw.text((cx - 100, 135), "stay original", fill=sub_text, font_size=28)
        # Ears
        draw.polygon([(cx - 70, cy - 80), (cx - 100, cy - 250), (cx - 40, cy - 100)], fill="#00E6FF", outline="#FF286E", width=4)
        draw.polygon([(cx + 70, cy - 80), (cx + 100, cy - 250), (cx + 40, cy - 100)], fill="#BEFF00", outline="#00E6FF", width=4)
        # Stitches
        for i in range(4):
            ey = cy - 200 + i * 25
            draw.line([(cx - 85, ey - 10), (cx - 65, ey + 10)], fill="#FFFFFF", width=3)
            draw.line([(cx - 85, ey + 10), (cx - 65, ey - 10)], fill="#FFFFFF", width=3)
        # Head
        draw.ellipse([cx - 130, cy - 100, cx + 130, cy + 120], fill="#140824", outline="#00E6FF", width=6)
        draw.line([(cx - 80, cy - 30), (cx - 30, cy + 20)], fill="#FF286E", width=6)
        draw.line([(cx - 80, cy + 20), (cx - 30, cy - 30)], fill="#FF286E", width=6)
        draw.ellipse([cx + 30, cy - 25, cx + 80, cy + 25], fill="#00E6FF", outline="#FFFFFF", width=4)
        draw.arc([cx - 90, cy + 10, cx + 90, cy + 90], start=20, end=160, fill="#FFFFFF", width=6)
        for st in range(-60, 70, 20):
            draw.line([(cx + st, cy + 45), (cx + st, cy + 70)], fill="#FF286E", width=4)
        draw.text((cx - 80, cy + 140), "CHAOS # 02", fill="#9BD746", font_size=32)
        draw.text((cx - 180, cy + 210), "KEEP IT ORIGINAL", fill=primary_text, font_size=42, stroke_width=2, stroke_fill=primary_text)
        return result

    elif design_key == 'oni-cyber':
        cx, cy = w // 2, 450
        draw.text((cx - 150, 150), "SAMURAI", fill=primary_text, font_size=68, stroke_width=2, stroke_fill=primary_text)
        draw.text((cx - 110, 130), "Tokyo protocol // 2026", fill="#FF286E", font_size=24)
        draw.polygon([(cx - 100, cy - 70), (cx - 160, cy - 220), (cx - 50, cy - 90)], fill="#FF286E", outline="#00E6FF", width=5)
        draw.polygon([(cx + 100, cy - 70), (cx + 160, cy - 220), (cx + 50, cy - 90)], fill="#FF286E", outline="#00E6FF", width=5)
        draw.polygon([(cx, cy - 80), (cx - 120, cy - 20), (cx - 90, cy + 100), (cx, cy + 150), (cx + 90, cy + 100), (cx + 120, cy - 20)], fill="#1C0A33", outline="#00E6FF", width=6)
        draw.polygon([(cx - 80, cy), (cx - 30, cy + 15), (cx - 70, cy + 25)], fill="#00E6FF")
        draw.polygon([(cx + 80, cy), (cx + 30, cy + 15), (cx + 70, cy + 25)], fill="#00E6FF")
        for i in range(-50, 51, 20):
            draw.polygon([(cx + i - 6, cy + 70), (cx + i + 6, cy + 70), (cx + i, cy + 100)], fill="#FFFFFF")
            draw.polygon([(cx + i - 6, cy + 115), (cx + i + 6, cy + 115), (cx + i, cy + 90)], fill="#FFFFFF")
        draw.text((cx - 130, cy + 160), "NEVER COMPLY", fill="#00E6FF", font_size=34)
        draw.text((cx - 80, cy + 205), "SECTOR 04", fill="#FF286E", font_size=28)
        return result

    elif design_key == 'butterfly-chrome':
        cx, cy = w // 2, 440
        draw.text((cx - 170, 160), "METAMORPHOSIS", fill=primary_text, font_size=42, stroke_width=2, stroke_fill=primary_text)
        draw.text((cx - 100, 140), "Cyber Y2K Edition", fill="#7B2CBF", font_size=24)
        # Chrome butterfly wings
        draw.polygon([(cx - 15, cy - 20), (cx - 160, cy - 130), (cx - 170, cy + 20), (cx - 20, cy + 30)], fill="#00E6FF", outline="#FFFFFF", width=5)
        draw.polygon([(cx + 15, cy - 20), (cx + 160, cy - 130), (cx + 170, cy + 20), (cx + 20, cy + 30)], fill="#FF286E", outline="#FFFFFF", width=5)
        draw.polygon([(cx - 15, cy + 35), (cx - 130, cy + 60), (cx - 100, cy + 150), (cx - 15, cy + 70)], fill="#7B2CBF", outline="#00E6FF", width=4)
        draw.polygon([(cx + 15, cy + 35), (cx + 130, cy + 60), (cx + 100, cy + 150), (cx + 15, cy + 70)], fill="#7B2CBF", outline="#FF286E", width=4)
        draw.ellipse([cx - 10, cy - 40, cx + 10, cy + 80], fill="#FFFFFF", outline="#00E6FF", width=3)
        # Y2K 4-point stars
        for sx, sy in [(cx - 180, cy - 80), (cx + 180, cy - 80), (cx - 120, cy + 180), (cx + 120, cy + 180)]:
            draw.polygon([(sx, sy - 25), (sx + 8, sy - 8), (sx + 25, sy), (sx + 8, sy + 8), (sx, sy + 25), (sx - 8, sy + 8), (sx - 25, sy), (sx - 8, sy - 8)], fill="#00E6FF", outline="#FFFFFF", width=2)
        draw.text((cx - 90, cy + 190), "LIQUID // 03", fill="#00E6FF", font_size=32)
        draw.text((cx - 140, cy + 230), "FUTURE AESTHETICS", fill=primary_text, font_size=28)
        return result

    elif design_key == 'acid-smile':
        cx, cy = w // 2, 450
        draw.text((cx - 160, 160), "HIGH VOLTAGE", fill="#BEFF00", font_size=46, stroke_width=2, stroke_fill="#BEFF00")
        draw.text((cx - 100, 135), "Overdose // Acid wash", fill=sub_text, font_size=24)
        # Dripping acid smiley
        draw.ellipse([cx - 130, cy - 100, cx + 130, cy + 120], fill="#BEFF00", outline="#140824", width=8)
        # Lightning eyes
        draw.line([(cx - 70, cy - 50), (cx - 50, cy - 20)], fill="#140824", width=8)
        draw.line([(cx - 50, cy - 20), (cx - 70, cy - 10)], fill="#140824", width=8)
        draw.line([(cx - 70, cy - 10), (cx - 40, cy + 20)], fill="#140824", width=8)
        draw.line([(cx + 70, cy - 50), (cx + 50, cy - 20)], fill="#140824", width=8)
        draw.line([(cx + 50, cy - 20), (cx + 70, cy - 10)], fill="#140824", width=8)
        draw.line([(cx + 70, cy - 10), (cx + 40, cy + 20)], fill="#140824", width=8)
        # Drooling wide grin
        draw.arc([cx - 90, cy + 10, cx + 90, cy + 90], start=10, end=170, fill="#140824", width=10)
        draw.text((cx - 100, cy + 150), "ACID SMILE # 05", fill="#00E6FF", font_size=28)
        draw.text((cx - 180, cy + 210), "KEEP IT ORIGINAL", fill=primary_text, font_size=42, stroke_width=2, stroke_fill=primary_text)
        return result

    elif design_key == 'astronaut-void':
        cx, cy = w // 2, 450
        draw.text((cx - 170, 150), "LOST IN SPACE", fill=primary_text, font_size=48, stroke_width=2, stroke_fill=primary_text)
        draw.text((cx - 110, 130), "Offline // No signal", fill="#FF286E", font_size=24)
        # Astronaut helmet
        draw.ellipse([cx - 140, cy - 120, cx + 140, cy + 120], fill="#130822", outline="#00E6FF", width=7)
        draw.ellipse([cx - 100, cy - 80, cx + 100, cy + 80], fill="#2D0F4B", outline="#FF286E", width=5)
        # Visor iridescent gradient reflection
        draw.arc([cx - 80, cy - 60, cx + 80, cy + 60], start=200, end=340, fill="#00E6FF", width=8)
        # Stars & signal loss
        draw.text((cx - 85, cy - 10), "NO SIGNAL", fill="#BEFF00", font_size=32)
        draw.text((cx - 110, cy + 150), "OFFLINE // VOID", fill="#00E6FF", font_size=32)
        draw.text((cx - 140, cy + 210), "CYBER DIVISION 2026", fill=primary_text, font_size=26)
        return result

    elif design_key == 'minimal-core':
        # MINIMAL BOXY CORE TEE
        # Left chest minimal cyber aesthetic embroidery / print
        # Placement: around x: 340, y: 310
        bx, by = 340, 315
        # Minimal border box
        draw.rounded_rectangle([bx - 10, by - 10, bx + 175, by + 65], radius=6, outline=sub_text, width=2)
        draw.text((bx + 8, by), "TEST // 2026", fill=primary_text, font_size=22, stroke_width=1, stroke_fill=primary_text)
        draw.text((bx + 8, by + 26), "CORE BOXY FIT 240G", fill=sub_text, font_size=13)
        draw.text((bx + 8, by + 42), "55.7558° N, 37.6173° E", fill=sub_text if not is_light else "#64748B", font_size=11)
        # Small geometric crosshair on right
        draw.line([(bx + 145, by + 28), (bx + 165, by + 28)], fill="#FF286E", width=2)
        draw.line([(bx + 155, by + 18), (bx + 155, by + 38)], fill="#FF286E", width=2)
        # Subtle back-neck signature bar
        draw.line([(w // 2 - 40, 110), (w // 2 + 40, 110)], fill=sub_text, width=3)
        return result

    elif design_key == 'kanji-matrix':
        # KANJI MATRIX OVERSIZE TEE
        cx, cy = w // 2, 450
        draw.text((cx - 170, 150), "CYBER DIVISION", fill=sub_text, font_size=24)
        draw.text((cx - 150, 175), "FUTURE MATRIX", fill=primary_text, font_size=42, stroke_width=2, stroke_fill=primary_text)
        
        # Large Kanji characters 未來 (Future)
        # First Kanji 未 (Mirai - Future)
        # Top horizontal line
        draw.line([(cx - 100, cy - 90), (cx + 100, cy - 90)], fill="#00E6FF", width=12)
        # Second longer horizontal line
        draw.line([(cx - 130, cy - 40), (cx + 130, cy - 40)], fill="#00E6FF", width=14)
        # Central vertical stem
        draw.line([(cx, cy - 130), (cx, cy + 120)], fill="#00E6FF", width=14)
        # Diagonal slashes
        draw.line([(cx - 20, cy - 30), (cx - 110, cy + 80)], fill="#00E6FF", width=12)
        draw.line([(cx + 20, cy - 30), (cx + 110, cy + 80)], fill="#00E6FF", width=12)
        
        # Matrix digital code dripping rain on sides
        code_snippets = ["0101", "CYBER", "NEO", "1011", "0010", "TOKYO", "X_08", "NULL", "1100"]
        for idx, snip in enumerate(code_snippets):
            px = cx - 180 + (idx % 3) * 160
            py = cy - 80 + (idx // 3) * 60
            draw.text((px, py), snip, fill="#9BD746", font_size=16)

        draw.text((cx - 120, cy + 140), "未來 // MATRIX 08", fill="#FF286E", font_size=28)
        draw.text((cx - 160, cy + 185), "NO FATE BUT WHAT WE MAKE", fill=primary_text, font_size=22)
        return result

    return result

# 3. Generate all 8 designs across all 6 colors
designs = [
    'bear-smile',
    'rabbit-anarchy',
    'oni-cyber',
    'butterfly-chrome',
    'acid-smile',
    'astronaut-void',
    'minimal-core',
    'kanji-matrix',
]

total_generated = 0
for d in designs:
    for c_code, blank_img_color in blank_images.items():
        img = apply_print_to_blank(blank_img_color, d, c_code)
        
        # Base filename: e.g. minimal-core.png (for black)
        # Color variant: e.g. minimal-core-cold-ice.png
        if c_code == 'black-sesame':
            fname = f"{d}.png"
        else:
            fname = f"{d}-{c_code}.png"
            
        full_path = os.path.join(out_dir, fname)
        img.save(full_path, 'PNG', optimize=True)
        total_generated += 1

print(f"SUCCESS: Generated {total_generated} high-resolution realistic t-shirt photos!")
