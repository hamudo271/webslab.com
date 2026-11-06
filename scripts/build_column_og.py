#!/usr/bin/env python3
"""칼럼 썸네일(1200x630) + 기본 공유 이미지(1200x630) + 파비콘 생성.

회사소개서(assets/webslab/files/webslab-company-profile.pdf) 표지 문법을 그대로 따른다:
흰 바탕, 가운데 websLAB 워드마크(LAB만 파랑), 크고 굵은 검정 제목, 화면 아래로 걸친 브라우저 목업
(회색 창틀 · 흰 카드의 검정 막대와 파란 버튼 · 연파랑 패널의 파란 사각형).
칼럼은 제목 위에 파란 분류 라벨을 얹는다.

출력
  public/images/column/<slug>.png   칼럼 썸네일 (src/data/columnPosts.ts cover)
  public/og/webslab-og.jpg          사이트 기본 OG (site.ts defaultOgImage) — 홈 히어로 스타일, 실제 사례 화면
  public/favicon.ico, public/site/favicon-{48,96,192,512}.png, apple-touch-icon.png   파비콘

실행: python3 scripts/build_column_og.py   (폰트: ~/Library/Fonts 의 Pretendard OTF)
"""
import os
import re
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src/data/columnPosts.ts')
OUT_DIR = os.path.join(ROOT, 'public/images/column')
DEFAULT_OG = os.path.join(ROOT, 'public/og/webslab-og.jpg')
FONT_DIRS = [os.path.expanduser('~/Library/Fonts'), '/Library/Fonts', '/tmp/og-fonts']

S = 2  # 2배로 그린 뒤 줄여 가장자리를 매끈하게

INK = (27, 30, 36)
BLUE = (49, 130, 246)
GRAY = (107, 118, 132)
FRAME = (242, 244, 246)
DOT = (209, 214, 219)
BAR_LIGHT = (229, 232, 235)
PANEL = (232, 243, 255)
PANEL_BAR = (201, 224, 255)
WHITE = (255, 255, 255)


def font(weight, size):
    name = f'Pretendard-{weight}.otf'
    for d in FONT_DIRS:
        p = os.path.join(d, name)
        if os.path.exists(p):
            return ImageFont.truetype(p, size * S)
    raise SystemExit(f'폰트를 찾지 못했습니다: {name} ({", ".join(FONT_DIRS)})')


def parse_posts(src):
    posts = []
    for block in re.split(r'\n  \{\n', src)[1:]:
        slug = re.search(r"slug:\s*'([^']+)'", block)
        title = re.search(r"title:\s*'([^']+)'", block)
        category = re.search(r"category:\s*'([^']+)'", block)
        if slug and title and category:
            posts.append((slug.group(1), category.group(1), title.group(1)))
    return posts


def text_w(draw, text, f):
    return draw.textlength(text, font=f)


PUNCT = (':', ',', '?', '—')
# 앞 말에 붙어야 하는 의존 명사 — 줄 첫머리에 오면 어색하다
DEPENDENT = ('시 ', '것', '수 ', '때 ', '중 ')
SINGLE_LINE_MAX = 820  # 이보다 긴 한 줄 제목은 두 줄로 나눠 표지처럼 균형을 맞춘다


def splits(draw, text, f, max_w):
    words = text.split(' ')
    out = []
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        wa, wb = text_w(draw, a, f), text_w(draw, b, f)
        if wa <= max_w and wb <= max_w and not b.startswith(DEPENDENT):
            out.append((abs(wa - wb), a, b))
    return out


def fit_title(draw, text, max_w, sizes):
    """제목 줄 나누기: 쉼표·콜론 뒤에서 끊을 수 있으면 그 자리(필요하면 글자를 줄여서라도),
    아니면 두 줄 길이가 가장 고른 자리. 짧은 제목은 한 줄."""
    punct = any(p in text for p in PUNCT)
    fallback = None
    for size in sizes:
        f = font('ExtraBold', size)
        if text_w(draw, text, f) <= SINGLE_LINE_MAX * S:
            return f, size, [text]
        cands = splits(draw, text, f, max_w)
        if not cands:
            continue
        at_punct = [c for c in cands if c[1].endswith(PUNCT)]
        if at_punct:
            _, a, b = min(at_punct)
            return f, size, [a, b]
        if fallback is None:
            _, a, b = min(cands)
            fallback = (f, size, [a, b])
        if not punct:
            return fallback
    if fallback:
        return fallback
    f = font('ExtraBold', sizes[-1])
    return f, sizes[-1], [text]


def wordmark(draw, cx, top, size):
    f = font('ExtraBold', size)
    w1, w2 = text_w(draw, 'webs', f), text_w(draw, 'LAB', f)
    x = cx - (w1 + w2) / 2
    draw.text((x, top), 'webs', font=f, fill=INK)
    draw.text((x + w1, top), 'LAB', font=f, fill=BLUE)


def rr(draw, box, r, fill):
    draw.rounded_rectangle([v * S for v in box], radius=r * S, fill=fill)


def browser_mock(img, draw, top, width, button):
    """표지의 브라우저 창 — 아래쪽은 캔버스 밖으로 걸친다."""
    W = img.width // S
    H = img.height // S
    left = (W - width) / 2
    right = left + width
    rr(draw, (left, top, right, H + 60), 28, FRAME)
    for i in range(3):
        cx, cy = left + 30 + i * 20, top + 24
        draw.ellipse([(cx - 6) * S, (cy - 6) * S, (cx + 6) * S, (cy + 6) * S], fill=DOT)

    card_l, card_t = left + 28, top + 48
    card_r = left + width * 0.635
    rr(draw, (card_l, card_t, card_r, H + 60), 20, WHITE)
    rr(draw, (card_l + 34, card_t + 32, card_l + 34 + (card_r - card_l) * 0.6, card_t + 52), 10, INK)
    rr(draw, (card_l + 34, card_t + 66, card_l + 34 + (card_r - card_l) * 0.43, card_t + 86), 10, INK)
    rr(draw, (card_l + 34, card_t + 104, card_l + 34 + (card_r - card_l) * 0.74, card_t + 114), 5, BAR_LIGHT)
    bf = font('Bold', 15)
    bw = text_w(draw, button, bf) / S + 44
    rr(draw, (card_l + 34, card_t + 130, card_l + 34 + bw, card_t + 172), 10, BLUE)
    draw.text(((card_l + 34 + 22) * S, (card_t + 151) * S), button, font=bf, fill=WHITE, anchor='lm')

    pan_l, pan_r = card_r + 22, right - 28
    rr(draw, (pan_l, card_t, pan_r, H + 60), 20, PANEL)
    rr(draw, (pan_l + 26, card_t + 30, pan_l + 26 + 84, card_t + 30 + 84), 20, BLUE)
    rr(draw, (pan_l + 26, card_t + 134, pan_l + 26 + (pan_r - pan_l) * 0.58, card_t + 146), 6, PANEL_BAR)
    rr(draw, (pan_l + 26, card_t + 158, pan_l + 26 + (pan_r - pan_l) * 0.42, card_t + 170), 6, PANEL_BAR)


def finish(img, size, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    out = img.resize(size, Image.LANCZOS)
    out.save(path, 'PNG', optimize=True)  # OG·RSS·사이트맵용(공유 미리보기 호환)
    # 본문 표지용 webp — src/site/column.ts가 <picture>로 먼저 쓴다(PNG 대비 약 1/3)
    out.convert('RGB').save(os.path.splitext(path)[0] + '.webp', 'WEBP', quality=80, method=6)
    return path


def render_column(slug, category, title):
    W, H = 1200, 630
    img = Image.new('RGB', (W * S, H * S), WHITE)
    d = ImageDraw.Draw(img)
    cx = W / 2 * S

    wordmark(d, cx, 46 * S, 28)
    ef = font('Bold', 23)
    d.text((cx, 120 * S), category, font=ef, fill=BLUE, anchor='mm')

    tf, size, lines = fit_title(d, title, 1000 * S, [60, 56, 52, 48, 44])
    lh = size * 1.3
    block = lh * len(lines)
    y = 150 + (2 * 60 * 1.3 - block) / 2  # 한 줄이어도 목업과의 간격이 일정하도록 가운데 정렬
    for line in lines:
        d.text((cx, (y + lh / 2) * S), line, font=tf, fill=INK, anchor='mm')
        y += lh

    browser_mock(img, d, 378, 820, '전문 칼럼 읽기')
    return finish(img, (W, H), os.path.join(OUT_DIR, f'{slug}.png'))


HERO_DIR = os.path.join(ROOT, '웹스랩 리뉴얼본/assets/webslab/hero')
LOGO_WHITE = os.path.join(ROOT, 'public/images/logo-white.png')
NAVY = (10, 21, 48)  # 홈 히어로 바탕(#0a1530)


def shot(name, width):
    """실제 제작 사례 화면(홈 히어로와 같은 캡처) — 위쪽을 폭에 맞춰 쓴다."""
    im = Image.open(os.path.join(HERO_DIR, name)).convert('RGB')
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


def paste_round(img, tile, xy, r):
    mask = Image.new('L', tile.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, tile.width - 1, tile.height - 1], radius=r, fill=255)
    img.paste(tile, xy, mask)


def render_default():
    """사이트 기본 공유 이미지 1200x630 — 홈 히어로 그대로: 네이비 바탕, 흰 헤드라인, 실제 사례 브라우저 창 + 휴대폰."""
    W, H = 1200, 630
    img = Image.new('RGB', (W * S, H * S), NAVY)
    # 오른쪽 위에서 번지는 파란 빛
    glow = Image.new('L', (W * S, H * S), 0)
    gd = ImageDraw.Draw(glow)
    for i in range(60, 0, -1):
        rad = i * 11 * S
        gd.ellipse([(930 * S - rad), (180 * S - rad), (930 * S + rad), (180 * S + rad)], fill=int(70 * (1 - i / 60) ** 1.6))
    img = Image.composite(Image.new('RGB', img.size, (49, 130, 246)), img, glow)
    d = ImageDraw.Draw(img)

    # 로고(흰색판) — 정사각 큐브 + websLAB
    logo = Image.open(LOGO_WHITE).convert('RGBA')
    lh = 38 * S
    logo = logo.resize((round(logo.width * lh / logo.height), lh), Image.LANCZOS)
    img.paste(logo, (72 * S, 70 * S), logo)

    tf = font('ExtraBold', 66)
    for i, line in enumerate(['브랜드의 첫인상을', '설계합니다.']):
        d.text((72 * S, (196 + i * 86) * S), line, font=tf, fill=WHITE, anchor='lm')
    lf = font('Medium', 25)
    for i, line in enumerate(['기획·디자인·개발부터 오픈 후 운영까지,', '웹스랩이 한 팀으로 끝까지 함께합니다.']):
        d.text((72 * S, (374 + i * 38) * S), line, font=lf, fill=(176, 189, 212), anchor='lm')
    # 아래 줄: 서비스 + 주소
    bf = font('SemiBold', 21)
    label = '기업 홈페이지 제작 · 리뉴얼 · 유지보수'
    d.text((72 * S, 540 * S), label, font=bf, fill=WHITE, anchor='lm')
    d.text((72 * S, 572 * S), 'webslab.co.kr', font=font('Bold', 21), fill=BLUE, anchor='lm')

    # 브라우저 창(실제 사례: 롤랜드코리아) — 아래로 걸쳐 잘린다
    bx, by, bw = 640, 112, 620
    d.rounded_rectangle([bx * S, by * S, (bx + bw) * S, (H + 40) * S], radius=18 * S, fill=(28, 38, 64))
    for i in range(3):
        cx, cy = bx + 24 + i * 18, by + 20
        d.ellipse([(cx - 5) * S, (cy - 5) * S, (cx + 5) * S, (cy + 5) * S], fill=(72, 86, 118))
    d.rounded_rectangle([(bx + 90) * S, (by + 9) * S, (bx + 330) * S, (by + 31) * S], radius=11 * S, fill=(40, 52, 82))
    d.text(((bx + 106) * S, (by + 20) * S), 'rolandkorea.com', font=font('Medium', 13), fill=(150, 164, 190), anchor='lm')
    pc = shot('roland-korea-pc-1200.webp', (bw - 16) * S)
    pc = pc.crop((0, 0, pc.width, (H + 40 - by - 40) * S))
    paste_round(img, pc, ((bx + 8) * S, (by + 40) * S), 10 * S)

    # 휴대폰 — 브라우저 왼쪽 아래에 겹친다
    px, py, pw, ph = 568, 300, 172, 360
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([(px - 2) * S, (py - 2) * S, (px + pw + 2) * S, (py + ph + 2) * S], radius=32 * S, fill=NAVY)
    d.rounded_rectangle([px * S, py * S, (px + pw) * S, (py + ph) * S], radius=30 * S, fill=(18, 24, 38))
    mo = shot('roland-korea-mo.webp', (pw - 14) * S)
    mo = mo.crop((0, 0, mo.width, (ph - 14) * S))
    paste_round(img, mo, ((px + 7) * S, (py + 7) * S), 24 * S)
    d.rounded_rectangle([(px + pw / 2 - 26) * S, (py + 14) * S, (px + pw / 2 + 26) * S, (py + 30) * S], radius=8 * S, fill=(0, 0, 0))

    out = img.resize((W, H), Image.LANCZOS)
    os.makedirs(os.path.dirname(DEFAULT_OG), exist_ok=True)
    out.save(DEFAULT_OG, 'JPEG', quality=86, optimize=True, progressive=True)
    return DEFAULT_OG


ICON_SRC = os.path.join(ROOT, '웹스랩 리뉴얼본/assets/webslab/webslab-icon.png')
ICON_DIR = os.path.join(ROOT, 'public')


def render_icons():
    """파비콘 — 큐브를 여백 조금만 남기고 꽉 채운다(16·32px에서도 형태가 보이게).
    구글 검색 아이콘 기준(48의 배수 정사각) 48·96·192·512, 홈 화면용 apple-touch 180(흰 바탕), favicon.ico(16·32·48)."""
    src = Image.open(ICON_SRC).convert('RGBA')
    box = src.getbbox()
    cube = src.crop(box)
    side = max(cube.size)
    def square(pad, bg=None):
        size = round(side / (1 - 2 * pad))
        canvas = Image.new('RGBA', (size, size), bg or (0, 0, 0, 0))
        canvas.paste(cube, ((size - cube.width) // 2, (size - cube.height) // 2), cube)
        return canvas
    tight = square(0.04)
    out = {}
    for px in (48, 96, 192, 512):
        path = os.path.join(ICON_DIR, 'site', f'favicon-{px}.png')
        tight.resize((px, px), Image.LANCZOS).save(path, 'PNG', optimize=True)
        out[px] = path
    square(0.14, (255, 255, 255, 255)).convert('RGB').resize((180, 180), Image.LANCZOS).save(
        os.path.join(ICON_DIR, 'site', 'apple-touch-icon.png'), 'PNG', optimize=True)
    tight.save(os.path.join(ICON_DIR, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
    return out


def main():
    posts = parse_posts(open(DATA, encoding='utf-8').read())
    print(f'칼럼 {len(posts)}편')
    for slug, category, title in posts:
        render_column(slug, category, title)
        print(f'  {slug}  [{category}]')
    print('기본 OG →', render_default())
    print('파비콘 →', ', '.join(render_icons().values()))


if __name__ == '__main__':
    main()
