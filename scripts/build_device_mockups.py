#!/usr/bin/env python3
"""Compose a real site screenshot into a PC browser mockup + iPhone mockup on a
branded navy backdrop. Output is a portfolio cover that proves real work.

Usage: build_device_mockups.py <desktop.png> <phone.png> <url-label> <out.png>
"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1600, 1000
NAVY_TOP = (9, 20, 42)
NAVY_BOT = (17, 32, 60)
PRIMARY = (29, 116, 255)
FONT_DIR = '/tmp/og-fonts'


def font(name, size):
    try:
        return ImageFont.truetype(f'{FONT_DIR}/{name}', size)
    except Exception:
        return ImageFont.load_default()


def rounded_mask(size, radius):
    m = Image.new('L', size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def shadow(size, radius, blur, alpha, pad):
    w, h = size
    s = Image.new('RGBA', (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    ImageDraw.Draw(s).rounded_rectangle([pad, pad, pad + w - 1, pad + h - 1], radius=radius, fill=(0, 0, 0, alpha))
    return s.filter(ImageFilter.GaussianBlur(blur))


def fit_cover(img, tw, th):
    iw, ih = img.size
    scale = max(tw / iw, th / ih)
    r = img.resize((max(1, int(iw * scale)), max(1, int(ih * scale))), Image.LANCZOS)
    left = (r.width - tw) // 2
    return r.crop((left, 0, left + tw, th))


def backdrop():
    base = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(base)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(NAVY_TOP[i] + (NAVY_BOT[i] - NAVY_TOP[i]) * t) for i in range(3)))
    base = base.convert('RGBA')
    # faint grid
    grid = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        gd.line([(x, 0), (x, H)], fill=(255, 255, 255, 8))
    for y in range(0, H, 60):
        gd.line([(0, y), (W, y)], fill=(255, 255, 255, 8))
    base = Image.alpha_composite(base, grid)
    # soft brand glow top-right
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([W * 0.55, -260, W * 1.15, 320], fill=PRIMARY + (70,))
    base = Image.alpha_composite(base, glow.filter(ImageFilter.GaussianBlur(170)))
    return base


def browser(desktop_img, url, win_w=1060, win_h=672):
    bar = 46
    win = Image.new('RGBA', (win_w, win_h), (255, 255, 255, 255))
    d = ImageDraw.Draw(win)
    d.rectangle([0, 0, win_w, bar], fill=(237, 238, 240, 255))
    for i, c in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        d.ellipse([22 + i * 26, bar // 2 - 7, 22 + i * 26 + 14, bar // 2 + 7], fill=c)
    d.rounded_rectangle([150, 11, win_w - 150, bar - 11], radius=12, fill=(255, 255, 255, 255))
    uf = font('NanumGothic-Regular.ttf', 17)
    d.text((176, bar // 2 - 11), url, font=uf, fill=(120, 130, 145))
    shot = fit_cover(desktop_img.convert('RGB'), win_w, win_h - bar)
    win.paste(shot, (0, bar))
    win.putalpha(rounded_mask((win_w, win_h), 16))
    return win


def phone(phone_img, w=304, h=636):
    bezel = 12
    frame = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(frame)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=46, fill=(14, 16, 22, 255))
    sw, sh = w - bezel * 2, h - bezel * 2
    screen = fit_cover(phone_img.convert('RGB'), sw, sh)
    screen.putalpha(rounded_mask((sw, sh), 36))
    frame.paste(screen, (bezel, bezel), screen)
    # dynamic island
    d.rounded_rectangle([w // 2 - 38, bezel + 12, w // 2 + 38, bezel + 32], radius=10, fill=(8, 9, 12, 255))
    frame.putalpha(rounded_mask((w, h), 46))
    return frame


def make(desktop_path, phone_path, url, out_path):
    canvas = backdrop()
    win = browser(Image.open(desktop_path), url)
    ph = phone(Image.open(phone_path))

    # browser — left, slightly up
    bx, by = 110, 150
    canvas.alpha_composite(shadow(win.size, 16, 60, 150, 90), (bx - 90, by - 60))
    canvas.alpha_composite(win, (bx, by))

    # phone — overlap bottom-right of the browser
    px, py = bx + win.width - 150, by + win.height - ph.height + 150
    canvas.alpha_composite(shadow(ph.size, 46, 55, 170, 80), (px - 80, py - 40))
    canvas.alpha_composite(ph, (px, py))

    canvas.convert('RGB').save(out_path, 'PNG')
    print('wrote', out_path)


if __name__ == '__main__':
    make(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
