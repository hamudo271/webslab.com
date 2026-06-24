#!/usr/bin/env python3
"""Generate on-brand navy case-study covers for portfolio + hero backgrounds.

Text-light by design (a faint monogram + grid + accent glow) so the same image
works as a portfolio card cover AND a hero background without clashing with the
hero's overlaid title. No fake screenshots — pure branded abstract.

Run: python3 scripts/build_case_covers.py
Fonts: NanumGothic TTFs in /tmp/og-fonts.
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'public/images/portfolio')
FONT_DIR = '/tmp/og-fonts'

NAVY = (11, 27, 54)  # #0B1B36
W, H = 1600, 1000

PROJECTS = [
    dict(slug='roland-korea', mono='R', accent=(29, 116, 255)),
    dict(slug='byeolha-studycafe', mono='별', accent=(139, 124, 246)),
]


def font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def build(p):
    base = Image.new('RGBA', (W, H), NAVY + (255,))

    # subtle blueprint grid
    grid = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    step = 64
    for x in range(0, W + 1, step):
        gd.line([(x, 0), (x, H)], fill=(255, 255, 255, 11))
    for y in range(0, H + 1, step):
        gd.line([(0, y), (W, y)], fill=(255, 255, 255, 11))
    base = Image.alpha_composite(base, grid)

    # accent radial glow (right side)
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gl = ImageDraw.Draw(glow)
    cx, cy, r = W * 0.80, H * 0.32, 520
    gl.ellipse([cx - r, cy - r, cx + r, cy + r], fill=p['accent'] + (105,))
    glow = glow.filter(ImageFilter.GaussianBlur(180))
    base = Image.alpha_composite(base, glow)

    # secondary deep glow bottom-left for depth
    glow2 = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    g2 = ImageDraw.Draw(glow2)
    cx2, cy2, r2 = W * 0.12, H * 0.92, 420
    g2.ellipse([cx2 - r2, cy2 - r2, cx2 + r2, cy2 + r2], fill=p['accent'] + (55,))
    glow2 = glow2.filter(ImageFilter.GaussianBlur(180))
    base = Image.alpha_composite(base, glow2)

    # faint monogram bleeding off the right edge → atmospheric texture, not a
    # dominant glyph that competes with the hero's overlaid title.
    tl = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(tl)
    mono_font = font('NanumGothic-ExtraBold.ttf', 660)
    bbox = td.textbbox((0, 0), p['mono'], font=mono_font)
    mw, mh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    td.text((W * 0.74 - mw / 2 - bbox[0], H * 0.50 - mh / 2 - bbox[1]),
            p['mono'], font=mono_font, fill=(255, 255, 255, 14))
    base = Image.alpha_composite(base, tl)

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, p['slug'] + '.png')
    base.convert('RGB').save(out, 'PNG')
    print('wrote', out)


if __name__ == '__main__':
    for p in PROJECTS:
        build(p)
    print('done')
