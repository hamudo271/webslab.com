// Build websLAB 회사소개서 — 16:9 PPTX deck with rich design
// Run: node build_pptx.js

const PptxGenJS = require('/tmp/node_modules/pptxgenjs');
const path = require('path');

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 inch
pres.title = 'websLAB 회사소개서 2026';
pres.author = 'websLAB';
pres.company = 'websLAB';

// ============ Design tokens ============
const C = {
  bgDark: '0B1B36',     // deep navy
  bgMid: '12274F',      // navy
  brand: '1D74FF',      // websLAB blue
  cyan: '00D4FF',       // bright accent
  cyanSoft: '4FCFFF',
  light: 'F4F7FB',
  white: 'FFFFFF',
  subtle: '8A99B5',
  subtleSoft: 'B7C2D9',
  text: '0F1419',
  textMute: '5A5757',
  line: 'D9D9D9',
};

const FONT = 'Pretendard';
const W = 13.333;
const H = 7.5;
const M = 0.6; // margin
const LOGO = '/Users/dooya8787/Desktop/webslab.co.kr/.claude/worktrees/gallant-nightingale-ceeee6/public/images/logo.png';
const LOGO_WHITE = '/Users/dooya8787/Desktop/webslab.co.kr/.claude/worktrees/gallant-nightingale-ceeee6/public/images/logo-white.png';

// ============ Helpers ============
function darkBg(s) {
  s.background = { color: C.bgDark };
  // Top accent strip
  s.addShape('rect', { x: 0, y: 0, w: W, h: 0.08, fill: { color: C.brand }, line: { color: C.brand, width: 0 } });
  // Diagonal cyan slash decoration top-right
  s.addShape('rightTriangle', { x: W - 1.6, y: 0, w: 1.6, h: 0.6, fill: { color: C.brand, transparency: 70 }, line: { width: 0 } , flipH: true });
}

function lightBg(s) {
  s.background = { color: C.white };
  // Top accent strip
  s.addShape('rect', { x: 0, y: 0, w: W, h: 0.05, fill: { color: C.brand }, line: { color: C.brand, width: 0 } });
}

function headerLogo(s, dark = false) {
  // Mini logo top-left; falls back to wordmark if image missing
  s.addImage({ path: LOGO, x: M, y: 0.32, w: 1.4, h: 0.28 });
}

function pageFooter(s, pageNum, dark = false) {
  const textColor = dark ? C.subtle : C.textMute;
  const lineColor = dark ? '233356' : C.line;
  s.addShape('rect', { x: M, y: H - 0.55, w: W - 2 * M, h: 0.012, fill: { color: lineColor }, line: { width: 0 } });
  s.addText('websLAB 회사소개서  ·  webslab.co.kr', {
    x: M, y: H - 0.42, w: 5, h: 0.3, fontFace: FONT, fontSize: 9, color: textColor, valign: 'top',
  });
  s.addText(String(pageNum).padStart(2, '0'), {
    x: W/2 - 0.3, y: H - 0.42, w: 0.6, h: 0.3, fontFace: FONT, fontSize: 9, bold: true, color: dark ? C.white : C.text, align: 'center',
  });
  s.addText('© 2026 websLAB  ALL RIGHTS RESERVED.', {
    x: W - M - 4, y: H - 0.42, w: 4, h: 0.3, fontFace: FONT, fontSize: 9, color: textColor, align: 'right',
  });
}

function eyebrow(s, txt, x, y, color = C.brand) {
  s.addText(txt, {
    x, y, w: 4, h: 0.3,
    fontFace: FONT, fontSize: 10, bold: true, color, charSpacing: 4,
  });
}

// ============ Slide 1 — Cover ============
{
  const s = pres.addSlide();
  darkBg(s);

  // Top-right tag
  s.addText('Company Brochure 2026', {
    x: W - M - 3, y: 0.32, w: 3, h: 0.3, fontFace: FONT, fontSize: 10, color: C.subtleSoft, align: 'right',
  });
  // Big-logo upper-left (white variant for dark cover)
  s.addImage({ path: LOGO_WHITE, x: M, y: 0.28, w: 1.8, h: 0.36 });

  // Decorative dotted lines (visual motif)
  s.addShape('line', {
    x: M, y: 1.8, w: 5.5, h: 0,
    line: { color: C.brand, width: 1, dashType: 'dash' },
  });

  // Eyebrow
  eyebrow(s, 'WEBSLAB  COMPANY  BROCHURE', M, 2.0);

  // Headline
  s.addText('기업의 온라인 성장을', {
    x: M, y: 2.4, w: 11, h: 0.95,
    fontFace: FONT, fontSize: 52, bold: true, color: C.white,
  });
  s.addText('함께하는 전문가 그룹', {
    x: M, y: 3.35, w: 11, h: 0.95,
    fontFace: FONT, fontSize: 52, bold: true, color: C.white,
  });

  // Subline
  s.addText([
    { text: '홈페이지에 대한 고민을 끝내다, ', options: { color: C.subtleSoft } },
    { text: 'websLAB', options: { color: C.cyan, bold: true } },
  ], {
    x: M, y: 4.55, w: 11, h: 0.5,
    fontFace: FONT, fontSize: 18,
  });

  // Bottom big stat block
  s.addShape('rect', { x: M, y: 5.5, w: 5.5, h: 1.2, fill: { color: C.brand }, line: { width: 0 } });
  s.addText('110+', {
    x: M + 0.3, y: 5.55, w: 2.4, h: 1.1,
    fontFace: FONT, fontSize: 56, bold: true, color: C.white, valign: 'middle',
  });
  s.addText([
    { text: 'Completed projects\n', options: { color: C.cyan, bold: true, fontSize: 11 } },
    { text: '3년 연속 85% 재계약률', options: { color: C.white, fontSize: 13, bold: true } },
  ], {
    x: M + 2.8, y: 5.55, w: 2.6, h: 1.1,
    fontFace: FONT, valign: 'middle',
  });

  // Right block — services keywords
  const services = ['UI/UX 디자인', '웹사이트 개발', 'DB 설계 · 마이그레이션', '리뉴얼 전문'];
  services.forEach((svc, i) => {
    s.addShape('roundRect', {
      x: 7.0, y: 5.6 + i * 0.32, w: 5.5, h: 0.28,
      fill: { color: '14254A' }, line: { color: C.brand, width: 0.5 },
      rectRadius: 0.04,
    });
    s.addShape('ellipse', {
      x: 7.15, y: 5.7 + i * 0.32, w: 0.08, h: 0.08, fill: { color: C.cyan }, line: { width: 0 },
    });
    s.addText(svc, {
      x: 7.4, y: 5.6 + i * 0.32, w: 5.0, h: 0.28,
      fontFace: FONT, fontSize: 11, color: C.white, valign: 'middle',
    });
  });

  // Bottom URL strip
  s.addText('webslab.co.kr', {
    x: M, y: H - 0.42, w: 4, h: 0.3, fontFace: FONT, fontSize: 9, color: C.subtle,
  });
  s.addText('© 2026 websLAB  ALL RIGHTS RESERVED.', {
    x: W - M - 4, y: H - 0.42, w: 4, h: 0.3, fontFace: FONT, fontSize: 9, color: C.subtle, align: 'right',
  });
}

// ============ Slide 2 — About / Manifesto ============
{
  const s = pres.addSlide();
  lightBg(s);
  headerLogo(s);
  pageFooter(s, 2);

  eyebrow(s, 'ABOUT US  /  01', M, 1.1);

  // Big quote-style headline
  s.addText('홈페이지에 대한 고민을 끝내다.', {
    x: M, y: 1.5, w: 12, h: 0.9,
    fontFace: FONT, fontSize: 42, bold: true, color: C.text,
  });
  s.addText('약속한 것은, 끝까지 책임집니다.', {
    x: M, y: 2.35, w: 12, h: 0.9,
    fontFace: FONT, fontSize: 42, bold: true, color: C.text,
  });

  // Body description (left column)
  s.addText([
    { text: '바이렉스 ', options: { bold: true, color: C.brand } },
    { text: '·  6개월  ·  1,700개 상품 카탈로그 SEO 리뉴얼.  검색 인덱싱 1,712건, 자연 유입 +214%.\n\n', options: { color: C.textMute } },
    { text: '5년간 운영해온 산업용 부품 사이트의 카테고리 구조부터 다시 짰습니다. 마케팅 팀이 신상품을 직접 등록할 수 있도록 ', options: { color: C.text } },
    { text: '관리자 페이지까지 함께 만들었고, ', options: { color: C.text } },
    { text: '검색 노출과 운영성을 동시에 챙겼습니다.', options: { bold: true, color: C.text } },
  ], {
    x: M, y: 3.4, w: 7.6, h: 2.5,
    fontFace: FONT, fontSize: 14, paraSpaceAfter: 6,
  });

  // Right column — big stat block
  s.addShape('roundRect', {
    x: 8.5, y: 3.7, w: 4.2, h: 2.85,
    fill: { color: C.bgDark }, line: { width: 0 }, rectRadius: 0.08,
  });
  s.addShape('rect', { x: 8.5, y: 3.7, w: 0.1, h: 2.85, fill: { color: C.cyan }, line: { width: 0 } });

  s.addText('110+', {
    x: 8.75, y: 3.85, w: 3.8, h: 1.1,
    fontFace: FONT, fontSize: 64, bold: true, color: C.white,
  });
  s.addText([
    { text: 'COMPLETED  PROJECTS\n', options: { color: C.cyan, bold: true, fontSize: 10, charSpacing: 3 } },
    { text: '누적 작업 건수', options: { color: C.subtleSoft, fontSize: 12 } },
  ], {
    x: 8.75, y: 5.05, w: 3.8, h: 0.6,
    fontFace: FONT,
  });
  // Divider
  s.addShape('rect', { x: 8.75, y: 5.75, w: 3.6, h: 0.012, fill: { color: '233356' }, line: { width: 0 } });
  s.addText([
    { text: '85%  ', options: { color: C.cyan, bold: true, fontSize: 22 } },
    { text: '3년 연속 재계약률', options: { color: C.white, fontSize: 13 } },
  ], {
    x: 8.75, y: 5.9, w: 3.8, h: 0.6,
    fontFace: FONT,
  });
}

// ============ Slide 3 — Stats grid ============
{
  const s = pres.addSlide();
  lightBg(s);
  headerLogo(s);
  pageFooter(s, 3);

  eyebrow(s, 'ABOUT US  /  02', M, 1.1);
  s.addText('수많은 기업이 이미 ', {
    x: M, y: 1.45, w: 12, h: 0.9,
    fontFace: FONT, fontSize: 36, bold: true, color: C.text,
  });
  s.addText([
    { text: '수많은 기업이 이미 ', options: { color: C.text } },
    { text: 'websLAB', options: { color: C.brand } },
    { text: '을 선택했습니다.', options: { color: C.text } },
  ], {
    x: M, y: 1.45, w: 12, h: 0.9,
    fontFace: FONT, fontSize: 36, bold: true,
  });

  s.addText('프로젝트의 시작과 마무리를 책임집니다. 사내 개발팀 없이도 안심하세요.', {
    x: M, y: 2.3, w: 12, h: 0.45, fontFace: FONT, fontSize: 14, color: C.textMute,
  });

  // 4-stat grid (16:9 wide allows nice spread)
  const stats = [
    { val: '110+', ko: '누적 작업 건수', en: 'Projects', color: C.brand },
    { val: '100%', ko: '프로젝트 완수율', en: 'Completion', color: C.cyan },
    { val: '4.9', ko: '고객 만족도', en: 'Satisfaction', color: C.brand, suffix: ' / 5.0' },
    { val: '0', ko: '보안 사고', en: 'Security', color: C.cyan, suffix: '건' },
  ];
  const colW = (W - 2*M - 0.6) / 4;
  stats.forEach((st, i) => {
    const x = M + i * (colW + 0.2);
    const y = 3.2;
    s.addShape('roundRect', {
      x, y, w: colW, h: 2.4,
      fill: { color: C.bgDark }, line: { width: 0 }, rectRadius: 0.06,
    });
    // Top accent
    s.addShape('rect', { x, y, w: colW, h: 0.06, fill: { color: st.color }, line: { width: 0 } });
    s.addText([
      { text: st.val, options: { fontSize: 56, bold: true, color: C.white } },
      ...(st.suffix ? [{ text: st.suffix, options: { fontSize: 22, color: C.subtleSoft } }] : []),
    ], {
      x: x + 0.2, y: y + 0.35, w: colW - 0.4, h: 1.2, fontFace: FONT,
    });
    s.addText([
      { text: st.en + '\n', options: { color: st.color, bold: true, fontSize: 10, charSpacing: 3 } },
      { text: st.ko, options: { color: C.white, fontSize: 14, bold: true } },
    ], {
      x: x + 0.2, y: y + 1.55, w: colW - 0.4, h: 0.8, fontFace: FONT,
    });
  });

  // Subtle bottom strip
  s.addText('Project completion rate, satisfaction, and security records measured across all engagements since 2022.', {
    x: M, y: 6.0, w: W - 2*M, h: 0.4, fontFace: FONT, fontSize: 10, italic: true, color: C.subtle, align: 'center',
  });
}

// ============ Slide 4 — Company info ============
{
  const s = pres.addSlide();
  lightBg(s);
  headerLogo(s);
  pageFooter(s, 4);

  eyebrow(s, 'COMPANY  INFO', M, 1.1);
  s.addText('우리는 누구인가', {
    x: M, y: 1.45, w: 12, h: 0.7, fontFace: FONT, fontSize: 36, bold: true, color: C.text,
  });

  // Left logo block (dark card)
  s.addShape('roundRect', {
    x: M, y: 2.5, w: 5.0, h: 4.0,
    fill: { color: C.bgDark }, line: { width: 0 }, rectRadius: 0.08,
  });
  // websLAB wordmark in white (no logo image — would render dark on dark)
  s.addText('websLAB', {
    x: M + 0.5, y: 2.85, w: 4.0, h: 0.7,
    fontFace: FONT, fontSize: 38, bold: true, color: C.white,
  });
  s.addText('Web Studio for B2B', {
    x: M + 0.5, y: 3.6, w: 4.0, h: 0.4, fontFace: FONT, fontSize: 13, color: C.cyan, bold: true, charSpacing: 2,
  });
  s.addText('기업 홈페이지 신규 제작·리뉴얼 전문 에이전시.\n기획부터 운영까지 한 팀에서 완결합니다.', {
    x: M + 0.5, y: 4.05, w: 4.0, h: 1.0, fontFace: FONT, fontSize: 12, color: C.subtleSoft,
  });

  // Tags at bottom of dark card
  const tags = ['Next.js', 'Headless CMS', 'Edge Hosting', 'SEO'];
  tags.forEach((t, i) => {
    const tx = M + 0.5 + (i % 2) * 2.0;
    const ty = 5.4 + Math.floor(i / 2) * 0.4;
    s.addShape('roundRect', {
      x: tx, y: ty, w: 1.85, h: 0.32,
      fill: { color: '24365C' }, line: { color: C.cyan, width: 0.7 }, rectRadius: 0.04,
    });
    s.addText(t, {
      x: tx, y: ty, w: 1.85, h: 0.32,
      fontFace: FONT, fontSize: 10, bold: true, color: C.cyan, align: 'center', valign: 'middle',
    });
  });

  // Right info table
  const rows = [
    ['사업 분야', 'UI/UX 디자인  ·  웹사이트 개발  ·  데이터베이스 설계'],
    ['대표', '조현도'],
    ['사업자등록번호', '173-58-00764'],
    ['전문 인원', '6명'],
    ['주소', '서울특별시 강남구 역삼로3길 19 10층 1007호'],
    ['전화', '010-9891-2787'],
    ['이메일', 'contact@webslab.co.kr'],
    ['웹사이트', 'webslab.co.kr'],
  ];
  rows.forEach((r, i) => {
    const ry = 2.65 + i * 0.48;
    s.addText(r[0], {
      x: 6.4, y: ry, w: 1.7, h: 0.42, fontFace: FONT, fontSize: 11, color: C.subtle, valign: 'middle',
    });
    s.addText(r[1], {
      x: 8.0, y: ry, w: 4.7, h: 0.42, fontFace: FONT, fontSize: 13, bold: true, color: C.text, valign: 'middle',
    });
    // Divider
    if (i < rows.length - 1) {
      s.addShape('rect', { x: 6.4, y: ry + 0.42, w: 6.3, h: 0.008, fill: { color: C.line }, line: { width: 0 } });
    }
  });
}

// ============ Slide 5 — Services (3 cards) ============
{
  const s = pres.addSlide();
  lightBg(s);
  headerLogo(s);
  pageFooter(s, 5);

  eyebrow(s, 'OUR  SERVICES', M, 1.1);
  s.addText('한 팀에서, 끝까지.', {
    x: M, y: 1.45, w: 12, h: 0.7, fontFace: FONT, fontSize: 36, bold: true, color: C.text,
  });
  s.addText('기획부터 디자인, 개발, 운영까지 — 모든 단계를 직접 합니다.', {
    x: M, y: 2.2, w: 12, h: 0.4, fontFace: FONT, fontSize: 14, color: C.textMute,
  });

  const services = [
    {
      no: '01', title: '홈페이지 신규 제작', sub: 'New Build',
      desc: '브랜드의 첫 디지털 인상을 설계합니다.\nUI/UX·디자인·개발·운영까지 한 팀.',
      bullets: ['전략 기획 · 정보 구조', '맞춤 디자인 · CMS 구축', '오픈 후 2주 무상 안정화'],
    },
    {
      no: '02', title: '기업 홈페이지 리뉴얼', sub: 'Renewal',
      desc: '콘텐츠는 살리고 구조만 새로 짭니다.\nSEO·도메인 권위 손실 없이.',
      bullets: ['SEO 손실 없는 마이그레이션', '301 리다이렉트 매핑', '기존 운영 데이터 이관'],
    },
    {
      no: '03', title: '운영·유지보수', sub: 'Operations',
      desc: '오픈 후가 진짜 시작.\n안정성 · 보안 · 콘텐츠를 함께 책임집니다.',
      bullets: ['24/7 즉각 대응 체계', '월간 백업 · 보안 업데이트', '콘텐츠 업데이트 지원'],
    },
  ];

  const cardW = (W - 2 * M - 0.5) / 3;
  services.forEach((sv, i) => {
    const x = M + i * (cardW + 0.25);
    const y = 2.9;
    const h = 3.9;
    // Card
    s.addShape('roundRect', {
      x, y, w: cardW, h,
      fill: { color: C.white }, line: { color: C.line, width: 0.5 }, rectRadius: 0.08,
    });
    // Top color bar
    s.addShape('roundRect', {
      x, y, w: cardW, h: 0.65,
      fill: { color: i === 1 ? C.brand : C.bgDark }, line: { width: 0 }, rectRadius: 0.08,
    });
    // Bottom of top bar — square the corners by overlay
    s.addShape('rect', {
      x, y: y + 0.4, w: cardW, h: 0.25,
      fill: { color: i === 1 ? C.brand : C.bgDark }, line: { width: 0 },
    });

    s.addText(sv.no, {
      x: x + 0.3, y: y + 0.12, w: 1, h: 0.45, fontFace: FONT, fontSize: 14, color: C.cyan, bold: true,
    });
    s.addText(sv.sub.toUpperCase(), {
      x: x + cardW - 1.7, y: y + 0.18, w: 1.5, h: 0.35, fontFace: FONT, fontSize: 10, color: C.subtleSoft, charSpacing: 3, align: 'right',
    });

    s.addText(sv.title, {
      x: x + 0.3, y: y + 0.85, w: cardW - 0.6, h: 0.55, fontFace: FONT, fontSize: 18, bold: true, color: C.text,
    });
    s.addText(sv.desc, {
      x: x + 0.3, y: y + 1.45, w: cardW - 0.6, h: 0.95, fontFace: FONT, fontSize: 11, color: C.textMute,
    });

    // Bullet rows
    sv.bullets.forEach((b, j) => {
      const by = y + 2.6 + j * 0.32;
      s.addShape('ellipse', { x: x + 0.32, y: by + 0.12, w: 0.08, h: 0.08, fill: { color: C.brand }, line: { width: 0 } });
      s.addText(b, {
        x: x + 0.5, y: by, w: cardW - 0.7, h: 0.32, fontFace: FONT, fontSize: 11, color: C.text, valign: 'middle',
      });
    });
  });
}

// ============ Slide 6 — Process (6 steps) ============
{
  const s = pres.addSlide();
  lightBg(s);
  headerLogo(s);
  pageFooter(s, 6);

  eyebrow(s, 'OUR  PROCESS', M, 1.1);
  s.addText('계약 전부터 함께, 오픈 후에도 함께.', {
    x: M, y: 1.45, w: 12, h: 0.7, fontFace: FONT, fontSize: 32, bold: true, color: C.text,
  });
  s.addText('6단계 표준 프로세스. 매 단계마다 의사결정자가 보고 결정합니다.', {
    x: M, y: 2.2, w: 12, h: 0.4, fontFace: FONT, fontSize: 14, color: C.textMute,
  });

  const steps = [
    { no: '01', title: '문의 · 상담', desc: '목적 · 예산 · 일정\n타깃 · 경쟁사 파악' },
    { no: '02', title: '적합성 검토', desc: '내부 리뷰\n솔직한 방향 제안' },
    { no: '03', title: '시안 제작', desc: '계약 전 메인 시안\n보고 결정' },
    { no: '04', title: '계약 · 킥오프', desc: '범위·일정 확정\nPM 배정' },
    { no: '05', title: '디자인 · 개발', desc: '주간 진행 공유\n스테이징 검수' },
    { no: '06', title: '오픈 · 케어', desc: '실서버 배포\n2주 안정화' },
  ];
  const colW = (W - 2 * M - 1.0) / 6;
  steps.forEach((st, i) => {
    const x = M + i * (colW + 0.2);
    const y = 3.0;
    // Step number circle
    s.addShape('ellipse', {
      x: x + colW/2 - 0.45, y, w: 0.9, h: 0.9,
      fill: { color: i === 0 || i === 5 ? C.brand : C.bgDark }, line: { width: 0 },
    });
    s.addText(st.no, {
      x: x + colW/2 - 0.45, y, w: 0.9, h: 0.9,
      fontFace: FONT, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle',
    });

    // Connector line to next step
    if (i < steps.length - 1) {
      s.addShape('rect', {
        x: x + colW/2 + 0.5, y: y + 0.42, w: colW - 0.6, h: 0.03,
        fill: { color: C.line }, line: { width: 0 },
      });
    }

    // Title
    s.addText(st.title, {
      x, y: y + 1.1, w: colW, h: 0.5,
      fontFace: FONT, fontSize: 14, bold: true, color: C.text, align: 'center',
    });
    // Desc
    s.addText(st.desc, {
      x, y: y + 1.7, w: colW, h: 1.1,
      fontFace: FONT, fontSize: 10.5, color: C.textMute, align: 'center',
    });
  });

  // Bottom callout — what the process guarantees
  s.addShape('roundRect', {
    x: M, y: 6.0, w: W - 2*M, h: 0.55,
    fill: { color: C.light }, line: { width: 0 }, rectRadius: 0.06,
  });
  s.addText([
    { text: '💡  ', options: { color: C.brand, fontSize: 14 } },
    { text: '계약 전 시안 단계까지는 의사결정자가 보고 결정합니다. ', options: { color: C.text, bold: true } },
    { text: '진행 중 매주 자료로 공유, 오픈 후 2주 안정화까지 책임.', options: { color: C.textMute } },
  ], {
    x: M + 0.2, y: 6.0, w: W - 2*M - 0.4, h: 0.55,
    fontFace: FONT, fontSize: 12, valign: 'middle',
  });
}

// ============ Slide 7 — Major Clients ============
{
  const s = pres.addSlide();
  lightBg(s);
  headerLogo(s);
  pageFooter(s, 7);

  eyebrow(s, 'OUR  CLIENTS', M, 1.1);
  s.addText('함께 일한 110+ 기업', {
    x: M, y: 1.45, w: 12, h: 0.7, fontFace: FONT, fontSize: 36, bold: true, color: C.text,
  });
  s.addText('공공·금융·제조·의료·SaaS·물류까지, 다양한 산업의 기업이 websLAB을 선택했습니다.', {
    x: M, y: 2.2, w: 12, h: 0.4, fontFace: FONT, fontSize: 14, color: C.textMute,
  });

  const clients = [
    'SMC', 'OECD Korea', '한일원자력', 'Galux', 'FASTFIVE C&D', '크리스천메이트', '식약처',
    'NKS', '디알코디', '브레인맵', '문화체육관광부', 'RadiSen', 'Medical Korea',
    'NovaDO', 'X-LOG', 'Virex', 'S-COM Tech', 'Nordinary', 'AZgram',
    '에코커피컴', '과학의전당',
  ];

  // 7 cols x 3 rows
  const cols = 7;
  const rows = 3;
  const gx = 0.15;
  const gy = 0.15;
  const cellW = (W - 2 * M - gx * (cols - 1)) / cols;
  const cellH = (4.0 - gy * (rows - 1)) / rows;
  const top = 2.85;
  clients.forEach((name, i) => {
    if (i >= cols * rows) return;
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = M + c * (cellW + gx);
    const y = top + r * (cellH + gy);
    s.addShape('roundRect', {
      x, y, w: cellW, h: cellH,
      fill: { color: C.light }, line: { color: C.line, width: 0.4 }, rectRadius: 0.06,
    });
    s.addText(name, {
      x: x + 0.05, y, w: cellW - 0.1, h: cellH,
      fontFace: FONT, fontSize: 11, bold: true, color: C.text, align: 'center', valign: 'middle',
    });
  });
}

// ============ Slides 8-13 — Top 6 portfolio highlights ============
const TOP_PORTFOLIO = [
  {
    co: '코스모스악기 · Roland Korea', kind: '브랜드 사이트 신규 제작', industry: '브랜드 · 음악', tag: 'BRAND / MUSIC',
    period: '2024.06 – 2024.12', services: ['UI/UX 신규', '브랜드 사이트', 'CMS 구축', '미디어 큐레이션'],
    summary: 'Roland 글로벌 브랜드의 한국 공식 사이트. 제품 카탈로그·영상·뉴스를 마케팅 팀이 직접 운영하도록 CMS 기반으로 신규 구축.',
    results: [['제품 카테고리', '9개'], ['콘텐츠 모듈', '3개'], ['운영', '자체 CMS']],
  },
  {
    co: '주식회사 바이렉스', kind: '홈페이지 리뉴얼', industry: '제조', tag: 'MANUFACTURING',
    period: '2024.12 – 2025.07', services: ['UI/UX 리뉴얼', 'SEO 최적화', 'CMS 구축'],
    summary: '1,700개 산업용 상품 카탈로그를 검색 친화적으로 재구성. 카테고리·상세 페이지 템플릿 재설계.',
    results: [['검색 유입', '+214%'], ['상품 인덱싱', '1,712건'], ['평균 세션', '+38%']],
  },
  {
    co: 'IMPEX GLS, INC.', kind: '홈페이지 리뉴얼', industry: '물류', tag: 'LOGISTICS',
    period: '2025.05 – 2025.07', services: ['UI/UX 리뉴얼', '그래픽 디자인', '반응형 퍼블리싱'],
    summary: '전 세계 12개국 네트워크 시각화. 서비스별 케이스 스터디를 강조한 구조로 재편.',
    results: [['평균 체류시간', '+62%'], ['문의 전환', '+38%']],
  },
  {
    co: 'SMC 코리아', kind: '카탈로그 사이트 신규', industry: '제조', tag: 'MANUFACTURING',
    period: '2024.06 – 2024.12', services: ['기획', 'UI/UX', '제품 DB', 'SEO'],
    summary: '공압 부품 3,000개의 카탈로그를 카테고리별 검색·비교·문의 가능한 구조로 설계.',
    results: [['제품 인덱싱', '3,000+'], ['오가닉 트래픽', '+125%']],
  },
  {
    co: 'Galux', kind: 'AI 플랫폼 사이트', industry: 'IT 솔루션', tag: 'IT SOLUTION',
    period: '2024.04 – 2024.09', services: ['기획', 'UI/UX', '인터랙션', '영문 카피'],
    summary: 'AI 단백질 디자인 플랫폼의 영문 사이트. 글로벌 투자자·연구자 대응.',
    results: [['리드 신청', '+220%'], ['글로벌 노출', '12개국']],
  },
  {
    co: '한국보건산업진흥원', kind: 'Medical Korea 캠페인', industry: '공공', tag: 'PUBLIC',
    period: '2023.04 – 2023.07', services: ['다국어 사이트', '캠페인 디자인', 'CMS'],
    summary: '의료관광 진흥 다국어 캠페인 사이트. 5개 언어 · 100+ 의료기관 데이터 연동.',
    results: [['지원 언어', '5개'], ['연동 의료기관', '100+']],
  },
];

TOP_PORTFOLIO.forEach((p, idx) => {
  const s = pres.addSlide();
  lightBg(s);
  headerLogo(s);
  pageFooter(s, 8 + idx);

  // Eyebrow with project number — wider w to prevent wrap
  s.addText(`PORTFOLIO  /  ${String(idx + 1).padStart(2, '0')} of 12  ·  ${p.tag}`, {
    x: M, y: 1.1, w: 11, h: 0.3,
    fontFace: FONT, fontSize: 10, bold: true, color: C.brand, charSpacing: 4,
  });

  // Company name (large)
  s.addText(p.co, {
    x: M, y: 1.45, w: 12, h: 1.0,
    fontFace: FONT, fontSize: 40, bold: true, color: C.text,
  });
  s.addText(p.kind, {
    x: M, y: 2.45, w: 8, h: 0.5,
    fontFace: FONT, fontSize: 18, color: C.brand, bold: true,
  });

  // Left — dark visual block with summary
  s.addShape('roundRect', {
    x: M, y: 3.2, w: 7.0, h: 3.4,
    fill: { color: C.bgDark }, line: { width: 0 }, rectRadius: 0.08,
  });
  // Diagonal accent
  s.addShape('rightTriangle', {
    x: M + 6.3, y: 3.2, w: 0.7, h: 0.5, fill: { color: C.brand }, line: { width: 0 }, flipH: true,
  });
  // Watermark project number — sized to stay inside dark card
  s.addText(String(idx + 1).padStart(2, '0'), {
    x: M + 5.0, y: 3.5, w: 1.9, h: 2.9,
    fontFace: FONT, fontSize: 88, bold: true, color: '1A2D52', align: 'right', valign: 'bottom',
  });
  // Eyebrow
  s.addText('PROJECT  HIGHLIGHT', {
    x: M + 0.4, y: 3.5, w: 5, h: 0.3,
    fontFace: FONT, fontSize: 10, color: C.cyan, bold: true, charSpacing: 3,
  });
  // Summary
  s.addText(p.summary, {
    x: M + 0.4, y: 3.85, w: 5.5, h: 1.5,
    fontFace: FONT, fontSize: 15, color: C.white, bold: false,
  });
  // Services tags
  p.services.forEach((sv, i) => {
    const tx = M + 0.4 + (i % 3) * 1.85;
    const ty = 5.55 + Math.floor(i / 3) * 0.4;
    s.addShape('roundRect', {
      x: tx, y: ty, w: 1.7, h: 0.32,
      fill: { color: '1A2D52' }, line: { color: C.cyan, width: 0.4 }, rectRadius: 0.04,
    });
    s.addText(sv, {
      x: tx, y: ty, w: 1.7, h: 0.32,
      fontFace: FONT, fontSize: 10, color: C.cyan, align: 'center', valign: 'middle',
    });
  });

  // Right — meta + results
  s.addText('PROJECT  PERIOD', {
    x: 7.6, y: 3.2, w: 5, h: 0.3,
    fontFace: FONT, fontSize: 9, color: C.subtle, bold: true, charSpacing: 3,
  });
  s.addText(p.period, {
    x: 7.6, y: 3.5, w: 5, h: 0.45,
    fontFace: FONT, fontSize: 17, bold: true, color: C.text,
  });

  s.addText('INDUSTRY', {
    x: 7.6, y: 4.1, w: 5, h: 0.3,
    fontFace: FONT, fontSize: 9, color: C.subtle, bold: true, charSpacing: 3,
  });
  s.addText(p.industry, {
    x: 7.6, y: 4.4, w: 5, h: 0.45,
    fontFace: FONT, fontSize: 17, bold: true, color: C.text,
  });

  // Results grid
  s.addText('KEY  RESULTS', {
    x: 7.6, y: 5.05, w: 5, h: 0.3,
    fontFace: FONT, fontSize: 9, color: C.subtle, bold: true, charSpacing: 3,
  });
  p.results.forEach((r, i) => {
    const ry = 5.4 + i * 0.42;
    s.addShape('rect', { x: 7.6, y: ry + 0.4, w: 5.0, h: 0.012, fill: { color: C.line }, line: { width: 0 } });
    s.addText(r[0], {
      x: 7.6, y: ry, w: 3.0, h: 0.4, fontFace: FONT, fontSize: 12, color: C.textMute, valign: 'middle',
    });
    s.addText(r[1], {
      x: 10.6, y: ry, w: 2.0, h: 0.4, fontFace: FONT, fontSize: 18, bold: true, color: C.brand, align: 'right', valign: 'middle',
    });
  });
});

// ============ Slide 14 — Other portfolio grid (6 more) ============
{
  const s = pres.addSlide();
  lightBg(s);
  headerLogo(s);
  pageFooter(s, 14);

  s.addText('PORTFOLIO  /  REMAINING  ·  07 – 12', {
    x: M, y: 1.1, w: 10, h: 0.3,
    fontFace: FONT, fontSize: 10, bold: true, color: C.brand, charSpacing: 4,
  });
  s.addText('더 다양한 프로젝트', {
    x: M, y: 1.45, w: 12, h: 0.7, fontFace: FONT, fontSize: 32, bold: true, color: C.text,
  });
  s.addText('SaaS · 의료기기 · 브랜드 · IR — 도메인별 깊이 있는 사례.', {
    x: M, y: 2.2, w: 12, h: 0.4, fontFace: FONT, fontSize: 14, color: C.textMute,
  });

  const more = [
    { co: 'FASTFIVE C&D', kind: '비즈니스 사이트 신규', period: '2024.03 – 2024.07', industry: 'IT 솔루션' },
    { co: 'NKS', kind: '바이오 IR 사이트', period: '2024.07 – 2024.10', industry: '의료/바이오' },
    { co: 'X-LOG', kind: '풀필먼트 SaaS', period: '2024.05 – 2024.08', industry: '물류' },
    { co: 'RadiSen', kind: '의료기기 글로벌', period: '2024.02 – 2024.09', industry: '의료기기' },
    { co: 'NovaDO', kind: '친환경 브랜드 D2C', period: '2024.06 – 2024.07', industry: '브랜드' },
    { co: 'AZgram', kind: 'SaaS 컨버전 랜딩', period: '2024.08 – 2024.09', industry: 'IT 솔루션' },
  ];
  const cols = 3;
  const rows = 2;
  const gx = 0.25;
  const gy = 0.25;
  const cellW = (W - 2 * M - gx * (cols - 1)) / cols;
  const cellH = (3.7 - gy * (rows - 1)) / rows;
  const top = 2.9;
  more.forEach((m, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = M + c * (cellW + gx);
    const y = top + r * (cellH + gy);
    s.addShape('roundRect', {
      x, y, w: cellW, h: cellH,
      fill: { color: C.white }, line: { color: C.line, width: 0.5 }, rectRadius: 0.06,
    });
    // Side accent
    s.addShape('rect', { x, y, w: 0.08, h: cellH, fill: { color: C.brand }, line: { width: 0 } });
    // Top row: project # + industry
    s.addText(String(i + 7).padStart(2, '0'), {
      x: x + 0.3, y: y + 0.18, w: 1, h: 0.35, fontFace: FONT, fontSize: 11, bold: true, color: C.brand,
    });
    s.addText(m.industry.toUpperCase(), {
      x: x + cellW - 2.0, y: y + 0.18, w: 1.85, h: 0.35, fontFace: FONT, fontSize: 9, color: C.subtle, bold: true, charSpacing: 3, align: 'right',
    });
    // Company name large
    s.addText(m.co, {
      x: x + 0.3, y: y + 0.6, w: cellW - 0.5, h: 0.55, fontFace: FONT, fontSize: 20, bold: true, color: C.text,
    });
    // Kind (project sub-title) — tighter height
    s.addText(m.kind, {
      x: x + 0.3, y: y + 1.13, w: cellW - 0.5, h: 0.28, fontFace: FONT, fontSize: 12, color: C.brand,
    });
    // Period at bottom — divider line above with clear gap
    s.addShape('rect', {
      x: x + 0.3, y: y + cellH - 0.35, w: cellW - 0.6, h: 0.012,
      fill: { color: C.line }, line: { width: 0 },
    });
    s.addText(m.period, {
      x: x + 0.3, y: y + cellH - 0.3, w: cellW - 0.5, h: 0.25,
      fontFace: FONT, fontSize: 10.5, bold: true, color: C.text, valign: 'middle',
    });
  });
}

// ============ Slide 15 — Why websLAB (9 strengths) ============
{
  const s = pres.addSlide();
  lightBg(s);
  headerLogo(s);
  pageFooter(s, 15);

  eyebrow(s, 'WHY  WEBSLAB', M, 1.1);
  s.addText('우리가 약속하는 9가지', {
    x: M, y: 1.45, w: 12, h: 0.7, fontFace: FONT, fontSize: 32, bold: true, color: C.text,
  });
  s.addText('어떤 도움이 필요하신가요? 9가지 약속으로 답합니다.', {
    x: M, y: 2.2, w: 12, h: 0.4, fontFace: FONT, fontSize: 14, color: C.textMute,
  });

  const strengths = [
    { mark: '110+', t: '프로젝트 완수', b: '모든 약속을 끝까지 책임집니다' },
    { mark: '85%', t: '재계약률', b: '한 번 만난 고객과 오래 갑니다' },
    { mark: '안정', t: '시스템 전환', b: 'SEO·데이터 손실 없는 마이그레이션' },
    { mark: '24/7', t: '유지보수 체계', b: '오픈 후에도 즉각 대응 보장' },
    { mark: '전담', t: 'PM 배정', b: '프로젝트 책임자와 직접 소통' },
    { mark: '주간', t: '진행 공유', b: '매주 자료로 투명하게 공유' },
    { mark: '0건', t: '보안 사고', b: '운영 중 0건의 사고 기록' },
    { mark: '분석', t: '기업별 특성', b: '업종·조직·타깃 맞춤 컨설팅' },
    { mark: '투명', t: '견적 시스템', b: '항목별 견적, 숨은 비용 없음' },
  ];
  const cols = 3;
  const rows = 3;
  const gx = 0.18;
  const gy = 0.18;
  const cellW = (W - 2 * M - gx * (cols - 1)) / cols;
  const cellH = 1.25;
  const top = 2.85;
  strengths.forEach((st, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = M + c * (cellW + gx);
    const y = top + r * (cellH + gy);
    const isAccent = [0, 4, 8].includes(i);
    s.addShape('roundRect', {
      x, y, w: cellW, h: cellH,
      fill: { color: isAccent ? C.bgDark : C.light },
      line: { width: 0 },
      rectRadius: 0.06,
    });
    s.addText(st.mark, {
      x: x + 0.3, y: y + 0.13, w: cellW - 0.6, h: 0.42,
      fontFace: FONT, fontSize: 22, bold: true,
      color: isAccent ? C.cyan : C.brand,
    });
    s.addText(st.t, {
      x: x + 0.3, y: y + 0.55, w: cellW - 0.6, h: 0.32,
      fontFace: FONT, fontSize: 13, bold: true,
      color: isAccent ? C.white : C.text,
    });
    s.addText(st.b, {
      x: x + 0.3, y: y + 0.87, w: cellW - 0.6, h: 0.3,
      fontFace: FONT, fontSize: 10.5,
      color: isAccent ? C.subtleSoft : C.textMute,
    });
  });
}

// ============ Slide 16 — Closing CTA ============
{
  const s = pres.addSlide();
  darkBg(s);

  // Large logo center-left (white variant for dark back-cover)
  s.addImage({ path: LOGO_WHITE, x: M, y: 0.3, w: 1.8, h: 0.36 });

  // Big headline
  s.addText([
    { text: '준비되셨다면, ', options: { color: C.subtleSoft } },
    { text: '시작하겠습니다.', options: { color: C.white } },
  ], {
    x: M, y: 2.3, w: 12, h: 1.1,
    fontFace: FONT, fontSize: 54, bold: true,
  });

  s.addText('프로젝트 목적 · 예산 · 일정만 알려주세요. 1영업일 안에 회신드립니다.', {
    x: M, y: 3.55, w: 12, h: 0.5,
    fontFace: FONT, fontSize: 18, color: C.subtleSoft,
  });

  // CTA blocks (3 columns)
  const ctaCards = [
    { label: '프로젝트 문의', value: 'webslab.co.kr/contact', icon: '→' },
    { label: '이메일', value: 'contact@webslab.co.kr', icon: '@' },
    { label: '전화 · 카카오', value: '010-9891-2787', icon: '☎' },
  ];
  const cardW = (W - 2 * M - 0.5) / 3;
  ctaCards.forEach((c, i) => {
    const x = M + i * (cardW + 0.25);
    const y = 4.7;
    s.addShape('roundRect', {
      x, y, w: cardW, h: 1.5,
      fill: { color: '14254A' }, line: { color: C.brand, width: 0.7 }, rectRadius: 0.08,
    });
    s.addText(c.icon, {
      x: x + 0.3, y: y + 0.18, w: 0.5, h: 0.5,
      fontFace: FONT, fontSize: 22, bold: true, color: C.cyan,
    });
    s.addText(c.label, {
      x: x + 0.3, y: y + 0.78, w: cardW - 0.6, h: 0.3,
      fontFace: FONT, fontSize: 10, bold: true, color: C.subtleSoft, charSpacing: 2,
    });
    s.addText(c.value, {
      x: x + 0.3, y: y + 1.06, w: cardW - 0.6, h: 0.4,
      fontFace: FONT, fontSize: 15, bold: true, color: C.white,
    });
  });

  // Bottom strip — moved up to respect margin
  s.addText('웹슬랩  ·  대표 조현도  ·  서울특별시 강남구 역삼로3길 19 10층 1007호  ·  173-58-00764', {
    x: M, y: H - 0.55, w: W - 2 * M, h: 0.3,
    fontFace: FONT, fontSize: 9, color: C.subtle, align: 'center',
  });
}

// ============ Save ============
pres.writeFile({ fileName: '/tmp/websLAB-brochure.pptx' }).then(fn => {
  console.log('Saved:', fn);
}).catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
