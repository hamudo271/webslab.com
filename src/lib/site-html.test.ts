import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { brand } from '@/config/brand';
import {
  extractFaqs,
  FOREIGN_TRACKING_MARKERS,
  normalizeLinks,
  clampDescription,
  normalizePagePath,
  pageImages,
  renderHeadMeta,
  toProductionHtml,
} from './site-html';

const PAGES_DIR = path.join(__dirname, '../site/pages');
const pages = fs
  .readdirSync(PAGES_DIR)
  .filter((f) => f.endsWith('.html'))
  .map((f) => ({ name: f, raw: fs.readFileSync(path.join(PAGES_DIR, f), 'utf8') }));

const produce = (raw: string) =>
  toProductionHtml(raw, { headStart: '<!--head-start-->', headEnd: '<!--head-end-->' });

// 원본 시안에만 있어야 하는 문구·값 — 운영 HTML에 하나라도 남으면 실패
const PREVIEW_LEFTOVERS = [
  'noindex',
  'Private noindex design concept',
  '공식 문의 페이지',
  '비교 시안',
  '미리보기 안내',
  '메일 쓰기 창',
  '비공개 디자인 시안',
  'data-preview-only',
  'ogimage.png',
  'christian-mate',
  'webslab-build',
  'UNWEBS_EXACT_FRONT',
];

describe('리뉴얼 페이지 운영 변환 (src/site/pages 전체)', () => {
  it('동기화된 페이지가 있다', () => {
    expect(pages.length).toBeGreaterThanOrEqual(16);
  });

  it.each(pages)('$name — 시안 흔적·다른 회사 추적 코드가 남지 않는다', ({ raw }) => {
    const html = produce(raw);
    for (const word of [...PREVIEW_LEFTOVERS, ...FOREIGN_TRACKING_MARKERS]) {
      expect(html, word).not.toContain(word);
    }
    expect(html).not.toMatch(/<script type="application\/ld\+json">/);
    expect(html).not.toMatch(/<a\b[^>]*href="https?:\/\/(?:www\.)?webslab\.co\.kr/);
  });

  it.each(pages)('$name — Cloudflare 이메일 난독화를 끈다(본문 전체가 email_off 안)', ({ raw }) => {
    const html = produce(raw);
    const body = html.slice(html.search(/<body\b/i));
    expect(body).toMatch(/^<body\b[^>]*><!--email_off-->/i);
    expect(html.trimEnd()).toMatch(/<!--\/email_off--><\/body>\s*<\/html>$/i);
  });

  it.each(pages)('$name — 속도: 안 쓰는 WP 인라인 스타일이 없고, 외부 스크립트는 defer(폼 연결만 동기)', ({ raw }) => {
    const html = toProductionHtml(raw, { headStart: '<script src="/site/ws-forms.js?v=x"></script>', headEnd: '' });
    expect(html).not.toContain('global-styles-inline-css');
    expect(html).not.toContain('wp-block-library-inline-css');
    expect(html).not.toContain('unpkg.com');
    // jQuery·게시판·시안 문의 스크립트는 운영에서 빠진다(URL 추가는 ws-forms.js, 파일 위젯은 main.js)
    expect(html).not.toMatch(/jquery(?:-migrate)?\.min\.js|uw-board\.js|uw-inquiry\.js|uw-(?:board|inquiry)-js-extra/);
    // 아이콘 폰트는 부분집합(public/site/xeicon-sub.woff2 + ws-site.css) — jsDelivr XEIcon 링크 없음
    expect(html).not.toContain('XEIcon');
    const sync = (html.match(/<script\b[^>]*\bsrc="[^"]+"[^>]*>/g) ?? [])
      .filter((tag) => !/\b(defer|async)\b|type="module"/.test(tag))
      .map((tag) => tag.match(/src="([^"]+)"/)![1]);
    expect(sync).toEqual(['/site/ws-forms.js?v=x']);
  });

  it.each(pages)('$name — 속도: 영상은 autoplay 없이 preload="none"(재생은 ws-media.js가 보일 때만)', ({ raw }) => {
    const videos = produce(raw).match(/<video\b[^>]*>/g) ?? [];
    for (const tag of videos) {
      expect(tag).not.toMatch(/\sautoplay\b/);
      expect(tag).toContain('preload="none"');
    }
  });

  it('무한 애니메이션이 있는 섹션에 data-ws-live가 붙는다(화면 밖에서는 멈춤)', () => {
    const home = produce(pages.find((p) => p.name === 'home.html')!.raw);
    expect(home).toMatch(/<section data-ws-live[^>]*class="ws-numbers/);
    expect(home).toMatch(/<section data-ws-live[^>]*class="ws-process/);
    const careers = produce(pages.find((p) => p.name === 'careers.html')!.raw);
    expect(careers).toMatch(/<section data-ws-live[^>]*class="mx-hero/);
    expect((careers.match(/data-ws-live/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(fs.readFileSync(path.join(__dirname, '../../public/site/ws-site.css'), 'utf8')).toContain('[data-ws-live]:not(.ws-on)');
  });

  it('아이콘 폰트 부분집합이 페이지가 쓰는 xi-* 글리프를 전부 담는다', () => {
    const site = fs.readFileSync(path.join(__dirname, '../../public/site/ws-site.css'), 'utf8');
    expect(site).toContain('font-family:xeicon');
    expect(fs.existsSync(path.join(__dirname, '../../public/site/xeicon-sub.woff2'))).toBe(true);
    const used = new Set<string>();
    for (const { raw } of pages) (raw.match(/\bxi-[a-z0-9-]+/g) ?? []).forEach((cls) => used.add(cls));
    expect(used.size).toBeGreaterThan(10);
    used.forEach((cls) => expect(site, cls).toContain(`.${cls}:before{content:`));
  });

  it.each(pages)('$name — 속도: 로컬 CSS는 동기화 때 만든 묶음(공통 + 페이지) 두 개뿐이다', ({ raw }) => {
    const head = raw.slice(0, raw.indexOf('</head>')).replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
    const local = (head.match(/<link\b[^>]*rel="stylesheet"[^>]*href="\/(?!\/)[^"]+"/g) ?? []).map(
      (tag) => tag.match(/href="([^"]+)"/)![1],
    );
    expect(local.length).toBeLessThanOrEqual(2);
    for (const href of local) {
      expect(href).toMatch(/^\/assets\/bundle\/[0-9a-f]{12}\.css$/);
      expect(fs.existsSync(path.join(__dirname, '../../public', href)), href).toBe(true);
    }
  });

  it.each(pages)('$name — 푸터에 사업자 정보와 약관 링크가 들어간다', ({ raw }) => {
    const html = produce(raw);
    expect(html).toContain(brand.legal.businessNumber);
    expect(html).toContain(brand.address.streetAddress);
    expect(html).toContain('href="/privacy-policy"');
    expect(html).toContain('href="/terms"');
  });

  it.each(pages)('$name — 운영 head 조각이 <meta charset> 뒤와 </head> 앞에 들어간다', ({ raw }) => {
    const html = produce(raw);
    const head = html.slice(0, html.indexOf('</head>'));
    expect(head.indexOf('<!--head-start-->')).toBeGreaterThan(head.search(/<meta charset/i));
    expect(head.trimEnd().endsWith('<!--head-end-->')).toBe(true);
  });

  it('견적 문의 폼은 실제 개인정보 동의 체크를 갖고, 선택 항목은 필수가 아니다', () => {
    for (const name of ['home.html', 'contact.html']) {
      const html = produce(pages.find((p) => p.name === name)!.raw);
      expect(html, name).toContain('name="privacy_agree" value="1" class="ws-agree__input"');
      expect(html, name).toContain('id="cmContactAgreeBtn"');
      const attachment = html.match(/data-field-id="field_attachment"[\s\S]*?<\/fieldset>/)![0];
      expect(attachment).not.toMatch(/\srequired/);
      const company = html.match(/data-field-id="field_company"[\s\S]*?<\/fieldset>/)![0];
      expect(company).toMatch(/\srequired/);
    }
  });

  it('유지보수 신청서에 동의 체크가 들어가고, 완료 안내가 메일 앱 문구가 아니다', () => {
    const html = produce(pages.find((p) => p.name === 'maintenance.html')!.raw);
    const form = html.match(/<form class="mx-form"[\s\S]*?<\/form>/)![0];
    expect(form).toContain('name="privacy_agree"');
    expect(form).toContain('신청이 접수되었어요');
    expect(form).toContain('유지보수 신청하기');
  });

  it('모든 페이지 헤더·모바일 메뉴·푸터에 채용 메뉴가 있다', () => {
    for (const { name, raw } of pages) {
      const html = produce(raw);
      expect(html, name).toContain('<a href="/careers" class="cm-gnb-link">');
      expect(html, name).toContain('<a href="/careers" class="cm-mobile-nav-link">');
      expect(html, name).toContain('<a href="/careers">채용</a>');
    }
  });

  it('채용 지원서는 실제 동의 체크와 수집 안내를 갖고, 문의 리드 이벤트를 쓰지 않는다', () => {
    const html = produce(pages.find((p) => p.name === 'careers.html')!.raw);
    const form = html.match(/<form class="ws-prep__grid cr-form" id="crForm"[\s\S]*?<\/form>/)![0];
    expect(form).toContain('name="privacy_agree" value="1" class="ws-agree__input" required');
    expect(form).toContain('채용 전형 진행과 결과 안내');
    expect(form.match(/name="position"/g)).toHaveLength(4);
    expect(form).toContain('type="file"');
    const forms = fs.readFileSync(path.join(__dirname, '../../public/site/ws-forms.js'), 'utf8');
    const career = forms.slice(forms.indexOf('function submitCareer'), forms.indexOf('/* ---------- 유지보수 신청'));
    expect(career).not.toContain("track(");
    expect(career).toContain('career_apply_submit');
  });

  it('메인 간편문의 모달은 실제 수집·이용 안내를 보여준다', () => {
    const html = produce(pages.find((p) => p.name === 'home.html')!.raw);
    const modal = html.match(/<div class="uw-qi-modal__body">[\s\S]*?<\/div>/)![0];
    expect(modal).toContain('수집 항목');
    expect(modal).toContain('이름, 연락처, 상담 분야');
  });

  it('사이트맵용 본문 사진을 뽑는다 — srcset은 가장 큰 후보, 아이콘·로고·외부 주소 제외, 지연 로드 포함', () => {
    const html = '<header><img src="/assets/hero.webp"></header><main>' +
      '<img srcset="/a-800.webp 800w, /a-1600.webp 1600w" src="/a-1600.webp">' +
      '<img data-src="/b.jpg?v=2"><img src="/site/icon-64.png"><img src="/assets/webslab/webslab-logo.png">' +
      '<img src="https://other.kr/c.png"><img src="/d.svg"><img src="/a-1600.webp"></main>';
    expect(pageImages(html)).toEqual(['/a-1600.webp', '/b.jpg']);
    const home = pageImages(pages.find((p) => p.name === 'home.html')!.raw);
    expect(home.length).toBeGreaterThan(2);
  });

  it('FAQ 페이지 문답을 그대로 추출한다 (FAQPage JSON-LD 소스)', () => {
    const faqs = extractFaqs(pages.find((p) => p.name === 'faq.html')!.raw);
    expect(faqs.length).toBeGreaterThanOrEqual(5);
    expect(faqs[0].question).toBe('홈페이지 제작 비용은 어떻게 산정되나요?');
    expect(faqs[0].answer).toMatch(/^프로젝트 규모와 페이지 수/);
    expect(faqs[0].answer).not.toContain('<');
  });
});

describe('링크 정리', () => {
  it('페이지 경로 끝 슬래시만 지운다', () => {
    expect(normalizePagePath('/about/')).toBe('/about');
    expect(normalizePagePath('/maintenance/pricing/')).toBe('/maintenance/pricing');
    expect(normalizePagePath('/contact/?from=home#inquiry')).toBe('/contact?from=home#inquiry');
    expect(normalizePagePath('/service/#process')).toBe('/service#process');
    expect(normalizePagePath('/')).toBe('/');
    expect(normalizePagePath('/assets/webslab/files/a.pdf')).toBe('/assets/webslab/files/a.pdf');
  });

  it('라이브 사이트로 새 창 이동하던 절대 링크를 같은 창 상대 경로로 바꾼다', () => {
    const out = normalizeLinks(
      '<a href="https://webslab.co.kr/column/hospital-website" target="_blank" rel="noopener">x</a>' +
        '<a href="https://blueoceanguardians.org/" target="_blank" rel="noopener">y</a>',
    );
    expect(out).toContain('<a href="/column/hospital-website">x</a>');
    expect(out).toContain('href="https://blueoceanguardians.org/" target="_blank"');
  });

  it('스크립트 안의 문자열은 건드리지 않는다', () => {
    const src = '<script>var a = \'<a href="/about/">\';</script>';
    expect(normalizeLinks(src)).toBe(src);
  });
});

describe('운영 head 메타', () => {
  const base = {
    path: '/about',
    canonical: 'https://webslab.co.kr/about',
    title: '회사소개 | 웹스랩',
    description: '설명 "따옴표" <태그>',
    ogImage: 'https://webslab.co.kr/og/default.png',
    siteName: '웹스랩',
    locale: 'ko_KR',
    verification: { google: 'g-code', naver: 'n-code' },
    rssUrl: 'https://webslab.co.kr/rss.xml',
    jsonLd: [{ '@type': 'Thing', name: '</script><b>' }],
  };

  it('canonical·OG·소유확인·JSON-LD를 만든다 (값은 이스케이프)', () => {
    const head = renderHeadMeta(base);
    expect(head).toContain('<link rel="canonical" href="https://webslab.co.kr/about">');
    expect(head).toContain('content="설명 &quot;따옴표&quot; &lt;태그&gt;"');
    expect(head).toContain('<meta name="naver-site-verification" content="n-code">');
    expect(head).toContain('<meta name="google-site-verification" content="g-code">');
    expect(head).toContain('index, follow');
    expect(head).not.toContain('</script><b>');
  });

  it('설명은 155자 안쪽으로 — 문장 끝에서 자르고, 짧은 설명은 그대로 둔다', () => {
    expect(clampDescription('짧은 설명입니다.')).toBe('짧은 설명입니다.');
    const long = '첫 문장은 충분히 길게 이어지는 소개 문장입니다. '.repeat(3) + '마지막 문장은 잘려야 합니다. '.repeat(5);
    const out = clampDescription(long);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith('다.')).toBe(true);
    expect(clampDescription('가'.repeat(200)).endsWith('…')).toBe(true);
    expect(renderHeadMeta({ ...base, description: long })).not.toContain(long);
  });

  it('404는 noindex', () => {
    expect(renderHeadMeta({ ...base, noindex: true })).toContain('content="noindex, follow"');
  });
});
