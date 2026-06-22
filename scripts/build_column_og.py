#!/usr/bin/env python3
"""Generate branded 1200x630 Open Graph cards for each column post.

Parses src/data/columnPosts.ts for slug / category / title and renders an
on-brand navy card per post into public/images/og/column/<slug>.png.

Run: python3 scripts/build_column_og.py
Fonts: expects NanumGothic TTFs in /tmp/og-fonts (Bold + ExtraBold + Regular).
"""
import os
import re
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src/data/columnPosts.ts')
OUT_DIR = os.path.join(ROOT, 'public/images/og/column')
LOGO_WHITE = os.path.join(ROOT, 'public/images/logo-white.png')
FONT_DIR = '/tmp/og-fonts'

# Brand palette (matches the site / brochure)
NAVY = (11, 27, 54)        # #0B1B36
NAVY_PANEL = (18, 39, 79)  # #12274F
BLUE = (29, 116, 255)      # #1D74FF
CYAN = (0, 212, 255)       # #00D4FF
WHITE = (255, 255, 255)
SUBTLE = (159, 180, 210)   # #9FB4D2

W, H = 1200, 630


def load_font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def parse_posts(src):
    """Return list of (slug, category, title) in file order."""
    posts = []
    # Each post block: slug, then primaryKeyword, title, ... category
    for block in re.split(r'\n  \{\n', src)[1:]:
        slug = re.search(r"slug:\s*'([^']+)'", block)
        title = re.search(r"title:\s*'([^']+)'", block)
        category = re.search(r"category:\s*'([^']+)'", block)
        if slug and title and category:
            posts.append((slug.group(1), category.group(1), title.group(1)))
    return posts


def wrap(draw, text, font, max_w):
    """Greedy wrap honoring spaces; falls back to char-wrap for long tokens."""
    words = text.split(' ')
    lines, cur = [], ''
    for word in words:
        trial = (cur + ' ' + word).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            # char-wrap an over-long single token
            if draw.textlength(word, font=font) > max_w:
                piece = ''
                for ch in word:
                    if draw.textlength(piece + ch, font=font) <= max_w:
                        piece += ch
                    else:
                        lines.append(piece)
                        piece = ch
                cur = piece
            else:
                cur = word
    if cur:
        lines.append(cur)
    return lines


def render(slug, category, title):
    img = Image.new('RGB', (W, H), NAVY)
    d = ImageDraw.Draw(img)

    # Top accent bar
    d.rectangle([0, 0, W, 10], fill=BLUE)

    # Subtle right panel block (visual motif)
    d.rectangle([W - 360, 0, W, H], fill=NAVY_PANEL)
    d.rectangle([W - 360, 0, W - 356, H], fill=CYAN)

    margin = 72

    # Logo top-left
    try:
        logo = Image.open(LOGO_WHITE).convert('RGBA')
        lw = 260
        lh = int(logo.height * lw / logo.width)
        logo = logo.resize((lw, lh))
        img.paste(logo, (margin, 60), logo)
    except Exception:
        d.text((margin, 64), 'websLAB', font=load_font('NanumGothic-ExtraBold.ttf', 40), fill=WHITE)

    # Category eyebrow
    eyebrow_font = load_font('NanumGothic-Bold.ttf', 24)
    spaced = '  '.join(list(category)) if len(category) <= 8 else category
    d.text((margin, 210), spaced.upper(), font=eyebrow_font, fill=CYAN)

    # Title (wrapped)
    title_font = load_font('NanumGothic-ExtraBold.ttf', 62)
    max_w = W - margin - 380
    lines = wrap(d, title, title_font, max_w)[:4]
    y = 270
    for line in lines:
        d.text((margin, y), line, font=title_font, fill=WHITE)
        y += 80

    # Bottom strip
    foot_font = load_font('NanumGothic-Regular.ttf', 24)
    d.text((margin, H - 70), 'webslab.co.kr  ·  전문 칼럼', font=foot_font, fill=SUBTLE)

    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f'{slug}.png')
    img.save(path, 'PNG')
    return path


def main():
    src = open(DATA, encoding='utf-8').read()
    posts = parse_posts(src)
    print(f'Found {len(posts)} posts')
    for slug, category, title in posts:
        path = render(slug, category, title)
        print(f'  {slug}: {category} -> {os.path.relpath(path, ROOT)}')


if __name__ == '__main__':
    main()
