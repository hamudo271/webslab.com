#!/usr/bin/env python3
"""Generate branded 1200x630 Open Graph / thumbnail cards for each column post.

Parses src/data/columnPosts.ts for slug / category / title and renders an
on-brand LIGHT soft-blue card per post into public/images/og/column/<slug>.png.

Design: matches the company brochure's light soft-blue tone but restrained —
white→light-blue gradient, a subtle glass corner accent (soft blob + faint
rings + a small frosted panel + bubbles), navy title, blue eyebrow.

Run: python3 scripts/build_column_og.py
Fonts: Pretendard static OTF in /tmp/og-fonts (Regular / SemiBold / Bold / ExtraBold).
"""
import os
import re
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src/data/columnPosts.ts')
OUT_DIR = os.path.join(ROOT, 'public/images/og/column')
LOGO = os.path.join(ROOT, 'public/images/logo.png')
FONT_DIR = '/tmp/og-fonts'

# Brand palette (matches the redesigned brochure)
NAVY = (34, 49, 92)       # #22315C  title
BLUE = (59, 111, 212)     # #3B6FD4  accent
BLUE2 = (91, 141, 239)    # #5B8DEF
MUTE = (150, 166, 187)    # #96A6BB  footer
BG_A = (255, 255, 255)
BG_B = (231, 240, 255)    # #E7F0FF

W, H = 1200, 630


def load_font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def parse_posts(src):
    posts = []
    for block in re.split(r'\n  \{\n', src)[1:]:
        slug = re.search(r"slug:\s*'([^']+)'", block)
        title = re.search(r"title:\s*'([^']+)'", block)
        category = re.search(r"category:\s*'([^']+)'", block)
        if slug and title and category:
            posts.append((slug.group(1), category.group(1), title.group(1)))
    return posts


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(' '), [], ''
    for word in words:
        trial = (cur + ' ' + word).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            if draw.textlength(word, font=font) > max_w:
                piece = ''
                for ch in word:
                    if draw.textlength(piece + ch, font=font) <= max_w:
                        piece += ch
                    else:
                        lines.append(piece); piece = ch
                cur = piece
            else:
                cur = word
    if cur:
        lines.append(cur)
    return lines


def gradient_bg():
    """대각선 화이트→연블루 은은한 그라디언트."""
    base = Image.new('RGB', (W, H), BG_A)
    px = base.load()
    for y in range(H):
        for x in range(0, W, 2):
            t = min(1.0, (x / W * 0.55 + y / H * 0.55))
            c = tuple(int(BG_A[i] + (BG_B[i] - BG_A[i]) * t) for i in range(3))
            px[x, y] = c
            if x + 1 < W:
                px[x + 1, y] = c
    return base


def corner_accent(img):
    """우측 코너의 은은한 글래스 accent (덜 과하게): soft blob + 링 + 프로스티드 패널 + 버블."""
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    # 소프트 블롭(우상단, 살짝 밖으로)
    blob = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(blob).ellipse([W - 430, -150, W + 120, 400], fill=(150, 185, 245, 70))
    blob = blob.filter(ImageFilter.GaussianBlur(80))
    ov.alpha_composite(blob)
    # 동심 링(라인)
    cx, cy = W - 150, 250
    for i, r in enumerate([210, 160, 112]):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(120, 160, 235, 70 - i * 8), width=3)
    # 작은 프로스티드 글래스 패널(그림자 후 반투명 흰 사각) — 코너에 하나만(절제)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([W - 210, 300, W - 90, 430], 26, fill=(70, 100, 160, 60))
    sh = sh.filter(ImageFilter.GaussianBlur(16))
    ov.alpha_composite(sh)
    d.rounded_rectangle([W - 218, 292, W - 98, 422], 26, fill=(255, 255, 255, 205), outline=(255, 255, 255, 235), width=3)
    # 미니 바(추상, 아주 옅게)
    for i, bh in enumerate([26, 44, 34]):
        d.rounded_rectangle([W - 196 + i * 30, 384 - bh, W - 196 + i * 30 + 18, 384], 5, fill=(91, 141, 239, 210))
    # 버블
    for bx, by, r, fill in [(W - 300, 120, 13, True), (W - 80, 470, 16, False), (W - 250, 500, 9, True)]:
        if fill:
            d.ellipse([bx - r, by - r, bx + r, by + r], fill=(255, 255, 255, 160))
        else:
            d.ellipse([bx - r, by - r, bx + r, by + r], outline=(120, 160, 235, 120), width=3)
    img.paste(Image.alpha_composite(img.convert('RGBA'), ov).convert('RGB'), (0, 0))


def render(slug, category, title):
    img = gradient_bg()
    corner_accent(img)
    d = ImageDraw.Draw(img)
    margin = 72

    # 로고(다크) 상단-좌측
    try:
        logo = Image.open(LOGO).convert('RGBA')
        lw = 250
        lh = int(logo.height * lw / logo.width)
        logo = logo.resize((lw, lh))
        img.paste(logo, (margin, 66), logo)
    except Exception:
        d.text((margin, 66), 'websLAB', font=load_font('Pretendard-ExtraBold.otf', 40), fill=NAVY)

    # 카테고리 에이브로우(블루, 자간)
    eyebrow = load_font('Pretendard-Bold.otf', 23)
    spaced = '  '.join(list(category)) if len(category) <= 9 else category
    d.text((margin + 2, 214), spaced, font=eyebrow, fill=BLUE)

    # 타이틀(네이비, 랩)
    tf = load_font('Pretendard-ExtraBold.otf', 58)
    max_w = W - margin - 310
    lines = wrap(d, title, tf, max_w)[:4]
    line_h = 76
    y = 268 + max(0, (3 - len(lines))) * 22  # 줄 수 적으면 살짝 아래로
    for line in lines:
        d.text((margin, y), line, font=tf, fill=NAVY)
        y += line_h

    # 하단
    foot = load_font('Pretendard-Regular.otf', 23)
    d.text((margin, H - 66), 'webslab.co.kr  ·  전문 칼럼', font=foot, fill=MUTE)

    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f'{slug}.png')
    img.save(path, 'PNG')
    return path


def main():
    src = open(DATA, encoding='utf-8').read()
    posts = parse_posts(src)
    print(f'Found {len(posts)} posts')
    for slug, category, title in posts:
        render(slug, category, title)
        print(f'  {slug}: {category}')


if __name__ == '__main__':
    main()
