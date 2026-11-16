import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

out_dir = r'E:\Гоша\frontend\public\products'
os.makedirs(out_dir, exist_ok=True)

bear_path = os.path.join(out_dir, 'bear-smile.png')
bear_img = Image.open(bear_path).convert('RGBA')
w, h = bear_img.size

# 1. Create a blank black oversize t-shirt by masking out the print
arr = np.array(bear_img)
blank = arr.copy()

# Sample dark cotton color & noise
# Shoulder region: 220:320, 140:240
cotton_patch = arr[220:300, 160:240]
mean_color = np.median(cotton_patch[cotton_patch[:, :, 3] > 200, :3], axis=0).astype(int)

# Create mask of print area: non-black print pixels inside body
body_mask = blank[:, :, 3] > 100
# The print has bright pixels (r+g+b > 90) inside the central box (x: 230..730, y: 130..800)
print_mask = np.zeros((h, w), dtype=bool)
print_mask[130:820, 240:730] = True
is_bright = (blank[:, :, 0].astype(int) + blank[:, :, 1].astype(int) + blank[:, :, 2].astype(int)) > 90
remove_mask = body_mask & print_mask & is_bright

# Dilate mask slightly to clean edges using PIL MaxFilter
remove_mask_img = Image.fromarray(remove_mask.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5))
remove_mask = np.array(remove_mask_img) > 0

# Replace with dark washed cotton texture
np.random.seed(42)
noise = np.random.randint(-4, 5, size=(h, w, 3))
filled_rgb = np.clip(mean_color + noise, 12, 28)

blank[remove_mask, :3] = filled_rgb[remove_mask]
blank_img = Image.fromarray(blank).filter(ImageFilter.GaussianBlur(radius=0.7))

# Helper to generate holographic / iridescent gradient texture
def make_holographic_pattern(pw, ph):
    X, Y = np.meshgrid(np.linspace(0, 1, pw), np.linspace(0, 1, ph))
    R = (np.sin(X * 4 + Y * 3) * 0.5 + 0.5) * 255
    G = (np.sin(X * 5 - Y * 4 + 2) * 0.5 + 0.5) * 255
    B = (np.cos(X * 3 + Y * 5) * 0.5 + 0.5) * 255
    holo = np.dstack([R, G, B, np.full((ph, pw), 255)]).astype(np.uint8)
    return Image.fromarray(holo)

# MODEL 2: RABBIT // Cyber Anarchy Stitched Bunny
m2 = blank_img.copy()
draw2 = ImageDraw.Draw(m2)
# Distressed headline "ANARCHY"
holo2 = make_holographic_pattern(w, h)
draw_holo2 = ImageDraw.Draw(holo2)

# Draw Rabbit graphic in center
# Distressed brush header
draw2.text((w//2 - 160, 160), "ANARCHY", fill="#FFFFFF", font_size=64, stroke_width=2, stroke_fill="#FFFFFF")
draw2.text((w//2 - 100, 135), "stay original", fill="#00E6FF", font_size=28)

# Iridescent Stitched Cyber Rabbit
# Head
cx, cy = w // 2, 460
# Ears
draw2.polygon([(cx - 70, cy - 80), (cx - 100, cy - 250), (cx - 40, cy - 100)], fill="#00E6FF", outline="#FF286E", width=4)
draw2.polygon([(cx + 70, cy - 80), (cx + 100, cy - 250), (cx + 40, cy - 100)], fill="#BEFF00", outline="#00E6FF", width=4)
# Stitches on ear
for i in range(4):
    ey = cy - 200 + i * 25
    draw2.line([(cx - 85, ey - 10), (cx - 65, ey + 10)], fill="#FFFFFF", width=3)
    draw2.line([(cx - 85, ey + 10), (cx - 65, ey - 10)], fill="#FFFFFF", width=3)

# Head oval
draw2.ellipse([cx - 130, cy - 100, cx + 130, cy + 120], fill="#140824", outline="#00E6FF", width=6)
# Eyes (X and Stitched eye)
draw2.line([(cx - 80, cy - 30), (cx - 30, cy + 20)], fill="#FF286E", width=6)
draw2.line([(cx - 80, cy + 20), (cx - 30, cy - 30)], fill="#FF286E", width=6)
draw2.ellipse([cx + 30, cy - 25, cx + 80, cy + 25], fill="#00E6FF", outline="#FFFFFF", width=4)
# Wicked mouth with stitches
draw2.arc([cx - 90, cy + 10, cx + 90, cy + 90], start=20, end=160, fill="#FFFFFF", width=6)
for st in range(-60, 70, 20):
    draw2.line([(cx + st, cy + 45), (cx + st, cy + 70)], fill="#FF286E", width=4)

draw2.text((cx - 80, cy + 140), "CHAOS # 02", fill="#9BD746", font_size=32)
draw2.text((cx - 180, cy + 210), "KEEP IT ORIGINAL", fill="#FFFFFF", font_size=42, stroke_width=2, stroke_fill="#FFFFFF")

m2.save(os.path.join(out_dir, 'rabbit-anarchy.png'), 'PNG')
print('Created rabbit-anarchy.png')

# MODEL 3: ONI CYBER // Tokyo Mecha Mask
m3 = blank_img.copy()
draw3 = ImageDraw.Draw(m3)
cx, cy = w // 2, 450
draw3.text((cx - 150, 150), "SAMURAI", fill="#FFFFFF", font_size=68, stroke_width=2, stroke_fill="#FFFFFF")
draw3.text((cx - 110, 130), "Tokyo protocol // 2026", fill="#FF286E", font_size=24)

# Oni horns
draw3.polygon([(cx - 100, cy - 70), (cx - 160, cy - 220), (cx - 50, cy - 90)], fill="#FF286E", outline="#00E6FF", width=5)
draw3.polygon([(cx + 100, cy - 70), (cx + 160, cy - 220), (cx + 50, cy - 90)], fill="#00E6FF", outline="#FF286E", width=5)
# Mask face
draw3.polygon([(cx - 120, cy - 80), (cx + 120, cy - 80), (cx + 90, cy + 120), (cx, cy + 170), (cx - 90, cy + 120)], fill="#120722", outline="#00E6FF", width=6)
# Glowing fangs & eyes
draw3.polygon([(cx - 70, cy - 20), (cx - 20, cy - 10), (cx - 45, cy + 15)], fill="#00E6FF")
draw3.polygon([(cx + 70, cy - 20), (cx + 20, cy - 10), (cx + 45, cy + 15)], fill="#00E6FF")
# Fangs
draw3.polygon([(cx - 50, cy + 60), (cx - 30, cy + 60), (cx - 40, cy + 110)], fill="#FFFFFF")
draw3.polygon([(cx + 50, cy + 60), (cx + 30, cy + 60), (cx + 40, cy + 110)], fill="#FFFFFF")
draw3.arc([cx - 70, cy + 50, cx + 70, cy + 120], start=10, end=170, fill="#FF286E", width=5)

draw3.text((cx - 70, cy + 185), "SECTOR 04", fill="#00E6FF", font_size=28)
draw3.text((cx - 170, cy + 230), "NEVER COMPLY", fill="#FFFFFF", font_size=44, stroke_width=2, stroke_fill="#FFFFFF")

m3.save(os.path.join(out_dir, 'oni-cyber.png'), 'PNG')
print('Created oni-cyber.png')

# MODEL 4: BUTTERFLY // Y2K Liquid Chrome Glitch
m4 = blank_img.copy()
draw4 = ImageDraw.Draw(m4)
cx, cy = w // 2, 450
draw4.text((cx - 180, 150), "METAMORPHOSIS", fill="#FFFFFF", font_size=46, stroke_width=2, stroke_fill="#FFFFFF")
draw4.text((cx - 90, 125), "cyber y2k // acid drop", fill="#00E6FF", font_size=22)

# Liquid chrome butterfly wings
draw4.ellipse([cx - 180, cy - 130, cx - 10, cy + 40], fill="#2D0F4B", outline="#00E6FF", width=5)
draw4.ellipse([cx + 10, cy - 130, cx + 180, cy + 40], fill="#2D0F4B", outline="#FF286E", width=5)
draw4.ellipse([cx - 140, cy + 20, cx - 10, cy + 140], fill="#120722", outline="#FF286E", width=4)
draw4.ellipse([cx + 10, cy + 20, cx + 140, cy + 140], fill="#120722", outline="#00E6FF", width=4)

# Butterfly body & antennae
draw4.ellipse([cx - 12, cy - 90, cx + 12, cy + 120], fill="#FFFFFF", outline="#00E6FF", width=3)
draw4.line([(cx - 10, cy - 90), (cx - 40, cy - 160)], fill="#00E6FF", width=4)
draw4.line([(cx + 10, cy - 90), (cx + 40, cy - 160)], fill="#FF286E", width=4)

# Y2K 4-point stars
def draw_star(draw, sx, sy, r, col):
    draw.polygon([(sx, sy - r), (sx + r//3, sy - r//3), (sx + r, sy), (sx + r//3, sy + r//3), (sx, sy + r), (sx - r//3, sy + r//3), (sx - r, sy), (sx - r//3, sy - r//3)], fill=col)

draw_star(draw4, cx - 120, cy - 40, 24, "#00E6FF")
draw_star(draw4, cx + 120, cy - 40, 24, "#FF286E")

draw4.text((cx - 70, cy + 160), "LIQUID // 03", fill="#9BD746", font_size=28)
draw4.text((cx - 170, cy + 215), "STAY ORIGINAL", fill="#FFFFFF", font_size=44, stroke_width=2, stroke_fill="#FFFFFF")

m4.save(os.path.join(out_dir, 'butterfly-chrome.png'), 'PNG')
print('Created butterfly-chrome.png')

# MODEL 5: ACID SMILE // Voltage Acid Drop
m5 = blank_img.copy()
draw5 = ImageDraw.Draw(m5)
cx, cy = w // 2, 450
draw5.text((cx - 160, 150), "VOLTAGE", fill="#FFFFFF", font_size=68, stroke_width=2, stroke_fill="#FFFFFF")
draw5.text((cx - 95, 125), "acid wash // 240 gsm", fill="#9BD746", font_size=24)

# Acid Yellow Glitch Smiley
draw5.ellipse([cx - 140, cy - 100, cx + 140, cy + 140], fill="#18181C", outline="#FFE137", width=8)
# Crossed out electric eyes
draw5.line([(cx - 85, cy - 35), (cx - 35, cy + 15)], fill="#FFE137", width=7)
draw5.line([(cx - 85, cy + 15), (cx - 35, cy - 35)], fill="#FFE137", width=7)
draw5.line([(cx + 35, cy - 35), (cx + 85, cy + 15)], fill="#00E6FF", width=7)
draw5.line([(cx + 35, cy + 15), (cx + 85, cy - 35)], fill="#00E6FF", width=7)
# Melting drippy smile
draw5.arc([cx - 100, cy + 10, cx + 100, cy + 100], start=15, end=165, fill="#FFE137", width=8)
# Drips
draw5.line([(cx - 40, cy + 70), (cx - 40, cy + 115)], fill="#FFE137", width=6)
draw5.line([(cx + 20, cy + 75), (cx + 20, cy + 125)], fill="#FFE137", width=6)

draw5.text((cx - 90, cy + 160), "HIGH VOLTAGE", fill="#FFE137", font_size=26)
draw5.text((cx - 180, cy + 215), "KEEP IT ORIGINAL", fill="#FFFFFF", font_size=42, stroke_width=2, stroke_fill="#FFFFFF")

m5.save(os.path.join(out_dir, 'acid-smile.png'), 'PNG')
print('Created acid-smile.png')

# MODEL 6: ASTRONAUT // Lost In Cyberspace
m6 = blank_img.copy()
draw6 = ImageDraw.Draw(m6)
cx, cy = w // 2, 450
draw6.text((cx - 150, 150), "OFFLINE", fill="#FFFFFF", font_size=68, stroke_width=2, stroke_fill="#FFFFFF")
draw6.text((cx - 110, 128), "escape reality // void", fill="#00E6FF", font_size=24)

# Astronaut helmet
draw6.ellipse([cx - 120, cy - 90, cx + 120, cy + 110], fill="#18181C", outline="#FFFFFF", width=6)
# Glowing visor reflecting neon galaxy
draw6.ellipse([cx - 90, cy - 60, cx + 90, cy + 70], fill="#160829", outline="#00E6FF", width=5)
draw6.arc([cx - 80, cy - 50, cx + 80, cy + 50], start=200, end=340, fill="#FF286E", width=4)
# Space stars
for i, pos in enumerate([(-180, -50), (190, -40), (-160, 120), (180, 100), (0, -180)]):
    draw_star(draw6, cx + pos[0], cy + pos[1], 16, "#00E6FF" if i % 2 == 0 else "#9BD746")

draw6.text((cx - 80, cy + 145), "NO SIGNAL # 06", fill="#00E6FF", font_size=24)
draw6.text((cx - 165, cy + 205), "LOST IN SPACE", fill="#FFFFFF", font_size=44, stroke_width=2, stroke_fill="#FFFFFF")

m6.save(os.path.join(out_dir, 'astronaut-void.png'), 'PNG')
print('Created astronaut-void.png')

print('ALL 6 HIGH-RES STREETWEAR T-SHIRTS CREATED WITH TRANSPARENT BACKGROUNDS!')
