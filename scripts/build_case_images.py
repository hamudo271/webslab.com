#!/usr/bin/env python3
"""제작 사례 이미지 묶음 만들기 — scripts/capture_case.mjs가 찍은 ./shots/<slug>-*.png 에서
리뉴얼 원본(assets/webslab)과 public/images/portfolio 에 필요한 webp를 만든다.

사용: python3 scripts/build_case_images.py <slug> <도메인>   (예: haeun-nuri haeun-nuri.com)
만드는 것: hero/<slug>-pc(.webp|-1200|-720), hero/<slug>-mo(.webp|-300), hero/<slug>-bg, <slug>-full, <slug>(표지 목업)
"""
import sys, os, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageFont
import build_device_mockups as m
m.font = lambda name, size: ImageFont.truetype(os.path.expanduser('~/Library/Fonts/Pretendard-Regular.otf'), size)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = f'{ROOT}/웹스랩 리뉴얼본/assets/webslab'
if len(sys.argv) < 3:
    sys.exit(__doc__)
CASES = {sys.argv[1]: sys.argv[2]}
def save(im, path, q=82):
    im.convert('RGB').save(path, 'WEBP', quality=q, method=6); print(os.path.getsize(path)//1024, 'KB', im.size, path.split('webslab/')[-1])
for slug, domain in CASES.items():
    pc = Image.open(f'shots/{slug}-pc.png').convert('RGB')
    mo = Image.open(f'shots/{slug}-mo.png').convert('RGB')
    tiles = sorted(glob.glob(f'shots/{slug}-tile-*.png'))[:3]
    if tiles:  # 스크롤 연출 사이트 — 실제 스크롤로 찍은 앞 3화면
        full = Image.new('RGB', (2880, 1800 * len(tiles)))
        for i, t in enumerate(tiles): full.paste(Image.open(t).convert('RGB'), (0, 1800 * i))
    else:
        full = Image.open(f'shots/{slug}-full.png').convert('RGB')
    for w, name in [(2240, 'pc'), (1200, 'pc-1200'), (720, 'pc-720')]:
        save(pc.resize((w, round(w * pc.height / pc.width)), Image.LANCZOS), f'{SRC}/hero/{slug}-{name}.webp', 80)
    for w, name in [(600, 'mo'), (300, 'mo-300')]:
        save(mo.resize((w, round(w * mo.height / mo.width)), Image.LANCZOS), f'{SRC}/hero/{slug}-{name}.webp', 80)
    fh = min(round(720 * full.height / full.width), 2600)
    f720 = full.resize((720, round(720 * full.height / full.width)), Image.LANCZOS).crop((0, 0, 720, fh))
    save(f720, f'{SRC}/{slug}-full.webp', 78)
    # 표지: 브라우저 + 폰 목업 (1600×1000)
    # 표지의 PC 화면은 실제 화면 높이(900)로 찍은 첫 화면이 있으면 그것을 쓴다
    first = sorted(glob.glob(f'shots/{slug}-tile-00-*.png'))
    (Image.open(first[0]).convert('RGB') if first else pc).save('shots/_pc.png'); mo.save('shots/_mo.png')
    m.make('shots/_pc.png', 'shots/_mo.png', domain, f'shots/{slug}-cover.png')
    cover = Image.open(f'shots/{slug}-cover.png')
    save(cover, f'{SRC}/{slug}.webp', 84)
    save(cover.resize((960, 600), Image.LANCZOS), f'{SRC}/hero/{slug}-bg.webp', 70)
    os.makedirs(f'{ROOT}/public/images/portfolio', exist_ok=True)
    save(cover, f'{ROOT}/public/images/portfolio/{slug}.webp', 84)
    save(f720, f'{ROOT}/public/images/portfolio/{slug}-full.webp', 78)
