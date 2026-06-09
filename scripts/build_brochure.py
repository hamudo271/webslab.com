"""Build websLAB 회사소개서 PDF — webdot.co.kr brochure structure ported to websLAB brand."""
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.utils import ImageReader

# Fonts
pdfmetrics.registerFont(TTFont('Pretendard', '/tmp/brochure-fonts/NanumGothic-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Pretendard-Bold', '/tmp/brochure-fonts/NanumGothic-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Pretendard-XB', '/tmp/brochure-fonts/NanumGothic-ExtraBold.ttf'))

# Palette
PRIMARY = HexColor('#1D74FF')
PRIMARY_DARK = HexColor('#0E4FB8')
DARK = HexColor('#0F1419')
TEXT = HexColor('#191919')
SUBTLE = HexColor('#5A5757')
MUTED = HexColor('#939393')
LINE = HexColor('#D9D9D9')
LIGHT = HexColor('#F6F6F6')

W, H = A4  # 595.27 x 841.89
M = 50  # margin

LOGO_PATH = '/Users/dooya8787/Desktop/webslab.co.kr/.claude/worktrees/gallant-nightingale-ceeee6/public/images/logo.png'

# ============ Portfolio data (parsed from src/data/portfolios.ts) ============
PORTFOLIOS = [
    ('IMPEX GLS, INC.', '홈페이지 리뉴얼', 'UI/UX 리뉴얼 및 그래픽 디자인', '2025.05 - 2025.07', '물류'),
    ('주식회사 바이렉스', '홈페이지 리뉴얼', 'UI/UX 리뉴얼 및 1,700개 상품군 SEO 최적화', '2024.12 - 2025.07', '제조'),
    ('OECD 조세정책본부', '홈페이지 리뉴얼', 'UI/UX 리뉴얼 및 DB 마이그레이션', '2023.06 - 2023.10', '공공'),
    ('SMC 코리아', '카탈로그 사이트 신규 개발', '공압 부품 3,000개의 카탈로그 사이트 구축', '2024.06 - 2024.12', '제조'),
    ('Galux', 'AI 플랫폼 사이트 신규 개발', 'AI 단백질 디자인 플랫폼의 영문 사이트', '2024.04 - 2024.09', 'IT 솔루션'),
    ('FASTFIVE C&D', '비즈니스 사이트 신규 개발', '공유오피스 사업의 컨설팅 브랜치 런칭 사이트', '2024.03 - 2024.07', 'IT 솔루션'),
    ('NKS', '바이오 기업 사이트 신규 개발', '바이오 R&D 기업의 IR/투자자 대응 사이트', '2024.07 - 2024.10', '의료/바이오'),
    ('한국보건산업진흥원', 'Medical Korea 캠페인 사이트', '의료관광 진흥 다국어 캠페인 사이트', '2023.04 - 2023.07', '공공'),
    ('X-LOG', '풀필먼트 SaaS 사이트', '풀필먼트·물류 SaaS의 세일즈 사이트', '2024.05 - 2024.08', '물류'),
    ('RadiSen', '의료기기 글로벌 사이트', '디지털 X-ray 시스템 제조사의 영문 사이트', '2024.02 - 2024.09', '의료기기'),
    ('NovaDO', '친환경 제품 브랜드 사이트', '친환경 생활용품 브랜드의 D2C 런칭 사이트', '2024.06 - 2024.07', '브랜드'),
    ('AZgram', 'SaaS 마케팅 사이트', 'SNS 마케팅 SaaS의 컨버전 랜딩', '2024.08 - 2024.09', 'IT 솔루션'),
]

CLIENT_LOGOS = [
    'SMC', 'OECD Korea', '한일원자력', 'Galux', 'FASTFIVE C&D', '크리스천메이트',
    'NKS', '디알코디', '브레인맵', '문화체육관광부', 'RadiSen', 'Medical Korea',
    'NovaDO', 'X-LOG', 'Virex', 'S-COM Tech', 'Nordinary', 'AZgram',
    '에코커피컴', '과학의전당', 'GRTH DesignLab',
]


def header_bar(c, page_num=None):
    """Top header bar with logo (mini)."""
    try:
        c.drawImage(LOGO_PATH, M, H - M - 14, width=70, height=14,
                    preserveAspectRatio=True, mask='auto')
    except Exception:
        c.setFillColor(DARK)
        c.setFont('Pretendard-XB', 11)
        c.drawString(M, H - M - 8, 'websLAB')


def footer_bar(c, page_num=None):
    """Bottom footer with URL + copyright."""
    c.setFillColor(MUTED)
    c.setFont('Pretendard', 8)
    c.drawString(M, M / 2 + 6, 'webslab.co.kr')
    c.drawRightString(W - M, M / 2 + 6, '© 2026 websLAB ALL RIGHTS RESERVED.')
    if page_num is not None:
        c.setFont('Pretendard-Bold', 8)
        c.setFillColor(DARK)
        c.drawCentredString(W / 2, M / 2 + 6, f'{page_num:02d}')


def section_eyebrow(c, text, x, y, color=PRIMARY):
    """Small uppercase eyebrow label."""
    c.setFillColor(color)
    c.setFont('Pretendard-Bold', 9)
    c.drawString(x, y, text)


def fit_text_lines(c, text, font, size, max_width):
    """Naive word-wrap that handles both Korean (char split) and English (space split)."""
    if not text:
        return []
    lines = []
    cur = ''
    for ch in text:
        test = cur + ch
        if pdfmetrics.stringWidth(test, font, size) > max_width:
            if cur:
                lines.append(cur)
                cur = ch
            else:
                lines.append(test)
                cur = ''
        else:
            cur = test
    if cur:
        lines.append(cur)
    return lines


# ============ Page 1 — Cover ============
def page_cover(c):
    # Background gradient effect via dark rect with subtle blue tint
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Decorative blue accent corner
    c.setFillColor(PRIMARY)
    c.rect(0, H - 6, W, 6, fill=1, stroke=0)

    # Logo (top left)
    try:
        c.drawImage(LOGO_PATH, M, H - M - 30, width=120, height=24,
                    preserveAspectRatio=True, mask='auto')
    except Exception:
        pass

    # Top right tag
    c.setFillColor(white)
    c.setFont('Pretendard', 9)
    c.drawRightString(W - M, H - M - 14, 'Company Brochure 2026')

    # Center block — eyebrow
    c.setFillColor(PRIMARY)
    c.setFont('Pretendard-Bold', 11)
    c.drawString(M, H / 2 + 110, 'WEBSLAB COMPANY BROCHURE')

    # Main title
    c.setFillColor(white)
    c.setFont('Pretendard-XB', 36)
    c.drawString(M, H / 2 + 60, '기업의 온라인 성장을')
    c.drawString(M, H / 2 + 20, '함께하는 전문가 그룹')

    # Sub
    c.setFillColor(HexColor('#B7C2D9'))
    c.setFont('Pretendard', 14)
    c.drawString(M, H / 2 - 20, '홈페이지에 대한 고민을 끝내다, websLAB')

    # Bottom strip
    c.setFillColor(HexColor('#3A4250'))
    c.rect(M, M + 28, W - 2 * M, 0.5, fill=1, stroke=0)
    c.setFillColor(MUTED)
    c.setFont('Pretendard', 8)
    c.drawString(M, M + 14, 'websLAB 회사소개서')
    c.drawString(M + 130, M + 14, 'webslab.co.kr')
    c.drawRightString(W - M, M + 14, '© 2026 websLAB ALL RIGHTS RESERVED.')


# ============ Page 2 — About Us 1 (big stat callout) ============
def page_about_1(c, page_num):
    header_bar(c, page_num)
    footer_bar(c, page_num)

    section_eyebrow(c, 'ABOUT US', M, H - M - 60)

    # Big headline statement
    c.setFillColor(DARK)
    c.setFont('Pretendard-XB', 28)
    c.drawString(M, H - M - 110, '110+개 기업,')
    c.drawString(M, H - M - 150, '3년 연속 85% 재계약률')

    # Sub
    c.setFillColor(SUBTLE)
    c.setFont('Pretendard', 13)
    c.drawString(M, H - M - 185, '웹사이트 제작 과정을 쉽게 만들어 드립니다.')

    # Body paragraph — case study mention
    c.setFillColor(TEXT)
    c.setFont('Pretendard', 11)
    para = [
        '결혼정보회사 C사  |  3번의 리뉴얼  |  총 1년 2개월간의 프로젝트 진행,',
        '총 360페이지의 UI/UX 디자인 작업 과정.',
        '',
        'websLAB 개발팀은 어떤 상황에서도, 맡은 프로젝트를 끝까지',
        '책임지고 마무리합니다.',
    ]
    y = H - M - 240
    for ln in para:
        c.drawString(M, y, ln)
        y -= 18

    # Decorative number block bottom right
    c.setFillColor(LIGHT)
    c.rect(W - M - 220, M + 100, 220, 220, fill=1, stroke=0)
    c.setFillColor(PRIMARY)
    c.setFont('Pretendard-XB', 72)
    c.drawString(W - M - 200, M + 200, '110+')
    c.setFillColor(SUBTLE)
    c.setFont('Pretendard', 10)
    c.drawString(W - M - 200, M + 180, 'Completed Projects')
    c.setFillColor(MUTED)
    c.setFont('Pretendard', 9)
    c.drawString(W - M - 200, M + 160, '누적 작업 건수')


# ============ Page 3 — About Us 2 (company info + stats) ============
def page_about_2(c, page_num):
    header_bar(c, page_num)
    footer_bar(c, page_num)

    section_eyebrow(c, 'ABOUT US', M, H - M - 60)

    c.setFillColor(DARK)
    c.setFont('Pretendard-XB', 26)
    c.drawString(M, H - M - 110, '수많은 기업이 이미')
    c.drawString(M, H - M - 142, 'websLAB을 선택했습니다.')

    c.setFillColor(SUBTLE)
    c.setFont('Pretendard', 12)
    c.drawString(M, H - M - 175, '프로젝트의 시작과 마무리를 책임집니다.')
    c.drawString(M, H - M - 192, '20인 이하, 사내 개발팀이 없는 기업이신가요? 걱정하지 마세요.')
    c.drawString(M, H - M - 209, '기획부터 개발까지 websLAB 전문팀이 순차적으로 진행하여 프로젝트를 마무리합니다.')

    # 4 stat cards
    stat_y = H - M - 280
    card_w = (W - 2 * M - 30) / 4
    stats = [
        ('110+', '누적 작업건수', 'Completed Projects'),
        ('100%', '프로젝트 완수율', 'Completion Rate'),
        ('4.9 / 5.0', '고객 만족도', 'Customer Satisfaction'),
        ('0건', '보안 사고', 'Security Incidents'),
    ]
    for i, (val, ko, en) in enumerate(stats):
        x = M + i * (card_w + 10)
        c.setFillColor(LIGHT)
        c.rect(x, stat_y - 100, card_w, 110, fill=1, stroke=0)
        c.setFillColor(PRIMARY)
        c.setFont('Pretendard-XB', 22)
        c.drawString(x + 16, stat_y - 30, val)
        c.setFillColor(TEXT)
        c.setFont('Pretendard-Bold', 10)
        c.drawString(x + 16, stat_y - 58, ko)
        c.setFillColor(MUTED)
        c.setFont('Pretendard', 8)
        c.drawString(x + 16, stat_y - 75, en)

    # Company info block (bottom)
    info_y = stat_y - 180
    c.setFillColor(LINE)
    c.rect(M, info_y, W - 2 * M, 0.5, fill=1, stroke=0)

    info_y -= 28
    c.setFillColor(MUTED)
    c.setFont('Pretendard-Bold', 9)
    c.drawString(M, info_y, 'COMPANY INFO')

    info_y -= 28
    rows = [
        ('사업 분야', 'UI/UX 디자인, 웹사이트 개발, 데이터베이스 설계'),
        ('대표', '조현도'),
        ('사업자등록번호', '173-58-00764'),
        ('전문 인원', '6명'),
        ('주소', '서울특별시 강남구 역삼로3길 19 10층 1007호'),
        ('전화', '010-9891-2787'),
        ('이메일', 'contact@webslab.co.kr'),
    ]
    for k, v in rows:
        c.setFillColor(MUTED)
        c.setFont('Pretendard', 10)
        c.drawString(M, info_y, k)
        c.setFillColor(TEXT)
        c.setFont('Pretendard-Bold', 11)
        c.drawString(M + 100, info_y, v)
        info_y -= 22


# ============ Page 4 — Major Clients ============
def page_clients(c, page_num):
    header_bar(c, page_num)
    footer_bar(c, page_num)

    section_eyebrow(c, 'OUR CLIENTS', M, H - M - 60)

    c.setFillColor(DARK)
    c.setFont('Pretendard-XB', 28)
    c.drawString(M, H - M - 110, '주요 고객사')

    c.setFillColor(SUBTLE)
    c.setFont('Pretendard', 12)
    c.drawString(M, H - M - 142, '최고의 전문가들이 귀사의 성공을 위해 기다리고 있습니다.')

    # Grid of clients — 3 cols x 7 rows
    grid_top = H - M - 200
    cols = 3
    rows = 7
    cell_w = (W - 2 * M) / cols
    cell_h = 64
    n = len(CLIENT_LOGOS)

    for i, name in enumerate(CLIENT_LOGOS):
        if i >= cols * rows:
            break
        col = i % cols
        row = i // cols
        x = M + col * cell_w
        y = grid_top - row * cell_h
        # Card
        c.setFillColor(LIGHT)
        c.rect(x + 4, y - cell_h + 8, cell_w - 8, cell_h - 8, fill=1, stroke=0)
        # Client name centered
        c.setFillColor(TEXT)
        c.setFont('Pretendard-Bold', 12)
        c.drawCentredString(x + cell_w / 2, y - cell_h / 2 - 4, name)


# ============ Pages 5-16 — Portfolio (12 entries) ============
def page_portfolio(c, page_num, idx, entry):
    company, kind, summary, period, industry = entry
    header_bar(c, page_num)
    footer_bar(c, page_num)

    # Side label
    section_eyebrow(c, f'PROJECT  {idx:02d} / 12', M, H - M - 60)

    # Industry tag
    c.setFillColor(PRIMARY)
    c.setFont('Pretendard-Bold', 9)
    c.drawString(M + 130, H - M - 60, industry.upper())

    # Big company name
    c.setFillColor(DARK)
    c.setFont('Pretendard-XB', 30)
    # Split long names if needed
    lines = fit_text_lines(c, company, 'Pretendard-XB', 30, W - 2 * M)
    y = H - M - 130
    for ln in lines:
        c.drawString(M, y, ln)
        y -= 38

    # Kind (e.g. "홈페이지 리뉴얼")
    c.setFillColor(SUBTLE)
    c.setFont('Pretendard-Bold', 18)
    c.drawString(M, y - 10, kind)

    # Visual hero block (color block representing project)
    hero_top = y - 60
    hero_h = 280
    hero_w = W - 2 * M
    # 2-tone split: brand blue left, dark right
    c.setFillColor(HexColor('#0E2A4E'))
    c.rect(M, hero_top - hero_h, hero_w, hero_h, fill=1, stroke=0)
    c.setFillColor(HexColor('#1D74FF'))
    c.rect(M, hero_top - hero_h, hero_w * 0.58, hero_h, fill=1, stroke=0)

    # Left side — summary text
    c.setFillColor(white)
    c.setFont('Pretendard-Bold', 14)
    summary_lines = fit_text_lines(c, summary, 'Pretendard-Bold', 14, hero_w * 0.58 - 64)
    for i, ln in enumerate(summary_lines[:4]):
        c.drawString(M + 32, hero_top - 40 - i * 22, ln)

    # Right side — project number watermark + label
    c.setFillColor(HexColor('#3A5878'))
    c.setFont('Pretendard-XB', 80)
    c.drawString(M + hero_w * 0.62, hero_top - hero_h + 30, f'{idx:02d}')

    c.setFillColor(HexColor('#9FB4D2'))
    c.setFont('Pretendard-Bold', 9)
    c.drawString(M + hero_w * 0.62, hero_top - 36, 'PROJECT NO.')
    c.setFillColor(white)
    c.setFont('Pretendard-Bold', 11)
    c.drawString(M + hero_w * 0.62, hero_top - 58, f'{kind}')

    # Bottom meta strip
    meta_y = hero_top - hero_h - 30
    c.setFillColor(LINE)
    c.rect(M, meta_y + 14, W - 2 * M, 0.5, fill=1, stroke=0)

    # Period
    c.setFillColor(MUTED)
    c.setFont('Pretendard', 9)
    c.drawString(M, meta_y - 14, '프로젝트 진행기간')
    c.setFillColor(TEXT)
    c.setFont('Pretendard-Bold', 12)
    c.drawString(M, meta_y - 34, period)

    # Industry box
    c.setFillColor(MUTED)
    c.setFont('Pretendard', 9)
    c.drawString(M + 230, meta_y - 14, '산업 분야')
    c.setFillColor(TEXT)
    c.setFont('Pretendard-Bold', 12)
    c.drawString(M + 230, meta_y - 34, industry)


# ============ Page 17 — How (strengths) ============
def page_how(c, page_num):
    header_bar(c, page_num)
    footer_bar(c, page_num)

    section_eyebrow(c, 'HOW?', M, H - M - 60)

    c.setFillColor(DARK)
    c.setFont('Pretendard-XB', 26)
    c.drawString(M, H - M - 110, '홈페이지에 대한 고민을 끝내다,')
    c.drawString(M, H - M - 142, 'websLAB')

    c.setFillColor(SUBTLE)
    c.setFont('Pretendard', 12)
    c.drawString(M, H - M - 175, '어떤 도움이 필요하신가요? 9가지 약속으로 답합니다.')

    strengths = [
        ('110+', '프로젝트 완수', '모든 약속을 완료까지\n책임집니다'),
        ('85%', '재계약률', '한 번 만난 고객과\n오래 갑니다'),
        ('안정', '기존 시스템 전환', 'SEO·데이터 손실 없이\n마이그레이션'),
        ('24/7', '유지보수 체계', '오픈 후에도\n즉각적 대응 보장'),
        ('전담', '전담 PM 배정', '프로젝트 책임자와\n직접 소통'),
        ('주간', '진행상황 공유', '매주 자료로 공유,\n투명하게'),
        ('0건', '보안 사고', '운영 중 0건의\n보안 사고 기록'),
        ('분석', '기업별 특성 분석', '업종·조직·타깃\n맞춤 컨설팅'),
        ('투명', '견적 시스템', '항목별 견적,\n숨은 비용 없음'),
    ]

    # 3x3 grid
    grid_top = H - M - 230
    cols = 3
    cell_w = (W - 2 * M - 20) / cols
    cell_h = 150

    for i, (mark, title, body) in enumerate(strengths):
        col = i % cols
        row = i // cols
        x = M + col * (cell_w + 10)
        y = grid_top - row * (cell_h + 12)

        c.setFillColor(LIGHT)
        c.rect(x, y - cell_h, cell_w, cell_h, fill=1, stroke=0)

        c.setFillColor(PRIMARY)
        c.setFont('Pretendard-XB', 20)
        c.drawString(x + 16, y - 36, mark)

        c.setFillColor(TEXT)
        c.setFont('Pretendard-Bold', 12)
        c.drawString(x + 16, y - 66, title)

        c.setFillColor(SUBTLE)
        c.setFont('Pretendard', 9)
        for j, ln in enumerate(body.split('\n')):
            c.drawString(x + 16, y - 88 - j * 14, ln)


# ============ Page 18 — Back cover ============
def page_back(c):
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    c.setFillColor(PRIMARY)
    c.rect(0, 0, W, 6, fill=1, stroke=0)

    # Centered logo + tagline
    try:
        c.drawImage(LOGO_PATH, W / 2 - 60, H / 2 + 30, width=120, height=24,
                    preserveAspectRatio=True, mask='auto')
    except Exception:
        c.setFillColor(white)
        c.setFont('Pretendard-XB', 28)
        c.drawCentredString(W / 2, H / 2 + 40, 'websLAB')

    c.setFillColor(HexColor('#B7C2D9'))
    c.setFont('Pretendard', 13)
    c.drawCentredString(W / 2, H / 2 - 10, '홈페이지에 대한 고민을 끝내다, websLAB')

    c.setFillColor(PRIMARY)
    c.setFont('Pretendard-Bold', 11)
    c.drawCentredString(W / 2, H / 2 - 50, 'webslab.co.kr')

    # Contact line
    c.setFillColor(MUTED)
    c.setFont('Pretendard', 9)
    c.drawCentredString(W / 2, H / 2 - 80, 'contact@webslab.co.kr  ·  서울특별시 강남구 역삼로3길 19 10층 1007호')

    # Bottom strip
    c.setFillColor(HexColor('#3A4250'))
    c.rect(M, M + 28, W - 2 * M, 0.5, fill=1, stroke=0)
    c.setFillColor(MUTED)
    c.setFont('Pretendard', 8)
    c.drawString(M, M + 14, 'websLAB 회사소개서')
    c.drawString(M + 130, M + 14, 'webslab.co.kr')
    c.drawRightString(W - M, M + 14, '© 2026 websLAB ALL RIGHTS RESERVED.')


# ============ Build ============
def build(out_path):
    c = canvas.Canvas(out_path, pagesize=A4)
    c.setTitle('websLAB 회사소개서 2026')
    c.setAuthor('websLAB')

    # Page 1: Cover
    page_cover(c)
    c.showPage()

    # Page 2-3: About
    page_about_1(c, 2)
    c.showPage()
    page_about_2(c, 3)
    c.showPage()

    # Page 4: Clients
    page_clients(c, 4)
    c.showPage()

    # Pages 5-16: Portfolio
    for i, entry in enumerate(PORTFOLIOS, start=1):
        page_portfolio(c, 4 + i, i, entry)
        c.showPage()

    # Page 17: How
    page_how(c, 17)
    c.showPage()

    # Page 18: Back cover
    page_back(c)
    c.showPage()

    c.save()
    print(f'Generated: {out_path}')


if __name__ == '__main__':
    build('/tmp/websLAB-brochure.pdf')
