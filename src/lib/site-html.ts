// 리뉴얼 정적 페이지(src/site/pages/*.html) → 운영용 HTML 변환. 순수 함수만 둔다(테스트 대상).
//
// 원본은 작업 폴더 그대로 동기화된 "미리보기 시안"이라 그대로 내보내면 안 되는 것들이 있다:
//  - 검색 차단(noindex), 시안용 설명·문구, 라이브 사이트로 새 창 이동하는 절대 링크
//  - 테마 원본에 남은 다른 회사의 분석·소유확인 코드(GA·네이버 애널리틱스·네이버 인증)
//  - 문의 폼의 "미리보기 전용" 처리
// 원본 폴더는 건드리지 않고 여기서 일괄 변환한다 → 원본을 다시 동기화해도 결과가 같다.

import { brand } from '@/config/brand';

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 테마 원본에 남아 있던 다른 회사 계정의 추적·인증 값. 어느 경로로도 운영 HTML에 남으면 안 된다. */
export const FOREIGN_TRACKING_MARKERS = [
  'G-RJPDW9XWX9', // GA4
  's_274261d14747', // 네이버 애널리틱스
  'c7ea562205b83c73b052882a82b99510ce8ac49e', // 네이버 서치어드바이저 소유확인
];

// ---------------------------------------------------------------------------
// 공통 유틸
// ---------------------------------------------------------------------------

/** script/style 블록 밖에서만 fn을 적용한다(인라인 스크립트 문자열을 망가뜨리지 않기 위해). */
function outsideCode(html: string, fn: (chunk: string) => string): string {
  return html
    .split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/i)
    .map((part, i) => (i % 2 === 1 ? part : fn(part)))
    .join('');
}

function splitHead(html: string): [string, string] {
  const i = html.indexOf('</head>');
  if (i < 0) throw new Error('</head>가 없는 페이지입니다.');
  return [html.slice(0, i), html.slice(i)];
}

export function readMeta(html: string, name: string): string | undefined {
  const m = html.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i'));
  return m?.[1];
}

export function readTitle(html: string): string {
  return html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? brand.nameKo;
}

// ---------------------------------------------------------------------------
// head
// ---------------------------------------------------------------------------

/** 시안의 SEO·추적 태그를 걷어낸다. 운영 값은 injectHead가 config에서 새로 넣는다. */
export function stripPreviewHead(html: string): string {
  const [head, rest] = splitHead(html);
  const cleaned = head
    .replace(/<meta\s+name="robots"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="(?:og|article):[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="(?:naver|google)-site-verification"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="webslab-[^"]*"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']https:\/\/api\.w\.org\/["'][^>]*>\s*/gi, '')
    .replace(/<link\b[^>]*(?:wp-json|xmlrpc|oembed)[^>]*>\s*/gi, '');
  return removeTrackingScripts(cleaned + rest);
}

/**
 * 인라인 스크립트 중 다른 회사 추적 코드가 든 것, 분석 스텁(window.wcs = {} 등)을 지운다.
 * 시안의 JSON-LD도 지운다(주소 등 brand.ts와 다른 값) — 운영 JSON-LD는 config에서 다시 만든다.
 */
export function removeTrackingScripts(html: string): string {
  return html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>\s*/gi, (whole, attrs: string, body: string) => {
    if (/application\/ld\+json/i.test(attrs)) return '';
    if (/\bsrc=/i.test(attrs)) return whole;
    if (FOREIGN_TRACKING_MARKERS.some((m) => body.includes(m))) return '';
    if (/window\.wcs\s*=\s*window\.wcs\s*\|\|\s*\{\}/.test(body)) return '';
    return whole;
  });
}

/** 디자인 메모 주석 제거(원본 작업 노트가 페이지 소스에 노출되지 않게). 스크립트 안은 건드리지 않는다. */
export function stripComments(html: string): string {
  return outsideCode(html, (chunk) => chunk.replace(/<!--(?!\[if)[\s\S]*?-->/g, ''));
}

export function replaceTitle(html: string, title: string): string {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

/** headStart: <meta charset> 바로 뒤(분석·폼 스크립트가 테마 스크립트보다 먼저 실행되도록), headEnd: </head> 직전(CSS 덮어쓰기) */
export function injectHead(html: string, headStart: string, headEnd: string): string {
  const charset = html.match(/<meta\s+charset=["']?[^"'>]+["']?\s*\/?>/i);
  const withStart = charset
    ? html.replace(charset[0], `${charset[0]}\n${headStart}`)
    : html.replace(/<head>/i, `<head>\n${headStart}`);
  return withStart.replace('</head>', `${headEnd}\n</head>`);
}

/**
 * Cloudflare 이메일 난독화 끄기 — 켜져 있으면 메일 주소를 /cdn-cgi/l/email-protection 링크로 바꿔,
 * 구글이 그 주소를 따라가 404로 보고한다(Search Console '찾을 수 없음'). 메일 주소는 어차피 공개값이다.
 * stripComments 뒤에 넣어야 살아남는다.
 */
export function disableEmailObfuscation(html: string): string {
  return html
    .replace(/<body\b[^>]*>/i, (tag) => `${tag}<!--email_off-->`)
    .replace(/<\/body>(?![\s\S]*<\/body>)/i, '<!--/email_off--></body>');
}

export function injectBodyStart(html: string, snippet: string): string {
  if (!snippet) return html;
  return html.replace(/<body\b[^>]*>/i, (tag) => `${tag}\n${snippet}`);
}

export type HeadMeta = {
  path: string;
  canonical: string; // 절대 URL
  description: string;
  title: string;
  ogImage: string; // 절대 URL
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  siteName: string;
  locale: string;
  verification: { google?: string; naver?: string };
  rssUrl: string;
  jsonLd: object[];
  /** 404 등 색인하면 안 되는 응답 */
  noindex?: boolean;
};

export function renderHeadMeta(m: HeadMeta): string {
  const e = escapeHtml;
  const robots = m.noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const lines = [
    `<meta name="description" content="${e(m.description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${e(m.canonical)}">`,
    `<link rel="alternate" type="application/rss+xml" title="${e(m.siteName)} 전문 칼럼" href="${e(m.rssUrl)}">`,
    `<meta property="og:type" content="${m.ogType ?? 'website'}">`,
    `<meta property="og:site_name" content="${e(m.siteName)}">`,
    `<meta property="og:locale" content="${e(m.locale)}">`,
    `<meta property="og:url" content="${e(m.canonical)}">`,
    `<meta property="og:title" content="${e(m.title)}">`,
    `<meta property="og:description" content="${e(m.description)}">`,
    `<meta property="og:image" content="${e(m.ogImage)}">`,
    m.ogImageWidth ? `<meta property="og:image:width" content="${m.ogImageWidth}">` : '',
    m.ogImageHeight ? `<meta property="og:image:height" content="${m.ogImageHeight}">` : '',
    m.publishedTime ? `<meta property="article:published_time" content="${e(m.publishedTime)}">` : '',
    m.modifiedTime ? `<meta property="article:modified_time" content="${e(m.modifiedTime)}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${e(m.title)}">`,
    `<meta name="twitter:description" content="${e(m.description)}">`,
    `<meta name="twitter:image" content="${e(m.ogImage)}">`,
    m.verification.google ? `<meta name="google-site-verification" content="${e(m.verification.google)}">` : '',
    m.verification.naver ? `<meta name="naver-site-verification" content="${e(m.verification.naver)}">` : '',
    ...m.jsonLd.map((d) => `<script type="application/ld+json">${jsonForScript(d)}</script>`),
  ];
  return lines.filter(Boolean).join('\n');
}

/** <script> 안에 넣는 JSON — </script> 조기 종료를 막는다. */
export function jsonForScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

// ---------------------------------------------------------------------------
// body
// ---------------------------------------------------------------------------

const SITE_ORIGIN = /^https?:\/\/(?:www\.)?webslab\.co\.kr/i;

/** 페이지 경로의 끝 슬래시 제거('/about/' → '/about'). 루트·파일 경로·외부 링크는 그대로. */
export function normalizePagePath(href: string): string {
  const m = href.match(/^(\/[^?#]*?)\/([?#].*)?$/);
  if (!m || m[1] === '') return href;
  const last = m[1].split('/').pop() ?? '';
  if (last.includes('.')) return href;
  return m[1] + (m[2] ?? '');
}

/**
 * 링크 정리
 *  - 시안이 라이브 사이트로 보내던 절대 링크(target=_blank)를 같은 창 상대 경로로
 *  - '/about/' 식 끝 슬래시 제거(Next가 308로 돌리는 왕복을 없앤다)
 */
export function normalizeLinks(html: string): string {
  return outsideCode(html, (chunk) =>
    chunk.replace(/<a\b[^>]*>/gi, (tag) => {
      const hrefM = tag.match(/\shref="([^"]*)"/i);
      if (!hrefM) return tag;
      let href = hrefM[1];
      let next = tag;
      if (SITE_ORIGIN.test(href)) {
        href = href.replace(SITE_ORIGIN, '') || '/';
        next = next.replace(/\starget="_blank"/i, '').replace(/\srel="noopener(?: noreferrer)?"/i, '');
      }
      if (href.startsWith('/')) href = normalizePagePath(href);
      return next.replace(hrefM[0], ` href="${href}"`);
    }),
  );
}

export function removePreviewAttributes(html: string): string {
  return html.replace(/\sdata-preview-only(?:="[^"]*")?/gi, '');
}

/** 시안 전용 안내 문구 → 운영 문구. 원본이 바뀌어 일치하지 않으면 건너뛴다(테스트가 잔존 여부를 검사). */
export const PREVIEW_COPY: [from: string, to: string][] = [
  // 견적 문의 폼(메인 하단 · /contact)
  [
    '보내시면 웹스랩 공식 문의 페이지로 이어집니다. 예산이나 범위가 정해지지 않아도 괜찮아요.',
    '예산이나 범위가 정해지지 않아도 괜찮아요. 남겨주시면 1영업일 안에 회신드립니다.',
  ],
  // 메인 간편문의 도크
  [
    '필요한 정보만 간단히 확인한 뒤<br>공식 문의 페이지로 안전하게 연결해 드려요.',
    '이름과 연락처만 남겨주시면<br>1영업일 안에 먼저 연락드려요.',
  ],
  [
    '<b>입력 정보는 이 화면에 저장되지 않아요.</b><small>실제 상담은 웹스랩 공식 문의 페이지에서 진행됩니다.</small>',
    '<b>상담 회신에만 사용해요.</b><small>자세한 내용은 개인정보 처리방침에서 확인할 수 있어요.</small>',
  ],
  ['<span>공식 문의 페이지에서 상담하기</span>', '<span>무료 상담 신청하기</span>'],
  // 유지보수 신청서
  ['신청 메일 작성하기<span', '유지보수 신청하기<span'],
  [
    '마지막 버튼을 누르면 적은 내용이 담긴 메일 쓰기 창이 열려요. 입력한 정보는 이 화면에 저장되지 않아요.',
    '보내주시면 1영업일 안에 남겨주신 연락처로 회신드립니다.',
  ],
  ['<strong>메일 쓰기 창을 열었어요</strong>', '<strong>신청이 접수되었어요</strong>'],
];

/** 시안 모달 본문(미리보기 안내) → 실제 수집·이용 동의 안내 */
const QUICK_MODAL_BODY = /<div class="uw-qi-modal__body">[\s\S]*?<\/div>/;
const PROJECT_MODAL_BODY = /<div class="main-contact-modal-body">[\s\S]*?<\/div>/g;
/** 유지보수 완료 안내 문단(메일 앱 안내) */
const MX_DONE_P = /(<strong>신청이 접수되었어요<\/strong>\s*)<p>[\s\S]*?<\/p>/;

export function privacyNotice(kind: 'project' | 'quick' | 'maintenance'): string {
  const items = {
    project: '회사명, 담당자 성함·직책, 연락처, 이메일, 기존 홈페이지 주소, 참고 사이트, 예산, 일정, 문의 내용, 첨부파일',
    quick: '이름, 연락처, 상담 분야',
    maintenance: '사이트 주소, 이름 또는 회사명, 연락처(전화번호 또는 이메일), 요청 내용',
  }[kind];
  return [
    `<p>${escapeHtml(brand.nameKo)}은 상담 회신을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>`,
    '<h4>수집 항목</h4>',
    `<ul><li>${escapeHtml(items)}</li></ul>`,
    '<h4>이용 목적</h4>',
    '<ul><li>문의·상담 응대 및 견적 회신</li></ul>',
    '<h4>보유 기간</h4>',
    '<ul><li>문의 응대 종료 후 3년 (개인정보 처리방침과 동일)</li></ul>',
    '<p>동의를 거부할 수 있으나, 거부 시 상담 접수가 어렵습니다. 자세한 내용은 <a href="/privacy-policy" target="_blank" rel="noopener">개인정보 처리방침</a>을 확인해 주세요.</p>',
  ].join('');
}

export function replacePreviewCopy(html: string): string {
  let out = html;
  for (const [from, to] of PREVIEW_COPY) out = out.split(from).join(to);
  out = out.replace(QUICK_MODAL_BODY, `<div class="uw-qi-modal__body">${privacyNotice('quick')}</div>`);
  out = out.replace(PROJECT_MODAL_BODY, `<div class="main-contact-modal-body">${privacyNotice('project')}</div>`);
  out = out.replace(
    MX_DONE_P,
    `$1<p>1영업일 안에 남겨주신 연락처로 회신드릴게요. 급한 요청은 <a href="tel:${brand.phone.replace(/\D/g, '')}">${escapeHtml(brand.phone)}</a>로 전화 주세요.</p>`,
  );
  return out;
}

/** 견적 폼에서 필수가 아니어도 되는 칸 — 시안은 전부 필수(첨부파일까지)라 문의 자체를 막는다. */
export const OPTIONAL_PROJECT_FIELDS = [
  'field_current_site',
  'field_ref_urls',
  'field_budget',
  'field_deadline',
  'field_attachment',
];

/**
 * 시안의 동의 표시는 "시각용 — 항상 체크"(체크 칸 없음)라 실제 동의를 받지 않는다.
 * 같은 자리·같은 클래스(테마 main.js가 폼 제출 버튼 위로 옮기고 #cmContactAgreeBtn에 모달을 건다)에
 * 실제 체크박스를 넣는다.
 */
const AGREE_BLOCK = /<div class="main-contact-agree">[\s\S]*?<\/button>\s*<\/div>/g;
const AGREE_PROJECT = `<div class="main-contact-agree ws-consent">
  <label class="ws-agree"><input type="checkbox" name="privacy_agree" value="1" class="ws-agree__input" required><span class="main-contact-agree-check ws-agree__box" aria-hidden="true"><i class="xi-check"></i></span><span class="ws-agree__text"><span class="main-contact-agree-required">[필수]</span> 개인정보 수집·이용에 동의합니다</span></label>
  <button type="button" class="main-contact-agree-btn" id="cmContactAgreeBtn" aria-haspopup="dialog">내용 보기 <i class="xi-angle-right-min" aria-hidden="true"></i></button>
  <span class="uw-inquiry-field-error ws-consent__error" role="alert" aria-live="polite"></span>
</div>`;

/** 동의 블록이 없는 견적 폼(시안 구조가 바뀐 경우)용 대체 */
const CONSENT_PROJECT = `<div class="ws-consent">
  <label class="ws-agree"><input type="checkbox" name="privacy_agree" value="1" class="ws-agree__input" required><span class="ws-agree__box" aria-hidden="true"></span><span class="ws-agree__text"><em>[필수]</em> 개인정보 수집·이용에 동의합니다</span></label>
  <a class="ws-consent__link" href="/privacy-policy" target="_blank" rel="noopener">내용 보기</a>
  <span class="uw-inquiry-field-error ws-consent__error" role="alert" aria-live="polite"></span>
</div>`;

const CONSENT_MAINTENANCE = `<div class="ws-consent ws-consent--mx">
  <label class="ws-consent__check"><input type="checkbox" name="privacy_agree" value="1" required><span>개인정보 수집·이용에 동의합니다 <em>(필수)</em></span></label>
  <a class="ws-consent__link" href="/privacy-policy" target="_blank" rel="noopener">내용 보기</a>
  <p class="mx-err ws-consent__error" hidden>개인정보 수집·이용에 동의해 주세요.</p>
</div>`;

/** 문의 폼 운영화: 선택 항목 완화 + 개인정보 동의 체크 추가 */
export function prepareForms(html: string): string {
  let out = html.replace(
    /<fieldset class="uw-inquiry-field\b[^"]*"[^>]*data-field-id="([^"]+)"[\s\S]*?<\/fieldset>/g,
    (block, id: string) => {
      if (!OPTIONAL_PROJECT_FIELDS.includes(id)) return block;
      return block
        .replace(/\suw-inquiry-field--required/g, '')
        .replace(/\srequired(?:="")?(?=[\s>])/g, '')
        .replace(
          /<abbr class="uw-inquiry-field-required"[^>]*>\*<\/abbr>/g,
          '<span class="ws-optional">선택</span>',
        );
    },
  );
  // 견적 폼: 시안의 시각용 동의 표시 → 실제 체크. 표시가 없는 페이지면 제출 버튼 바로 위에 넣는다.
  out = out.replace(AGREE_BLOCK, AGREE_PROJECT);
  if (!out.includes('name="privacy_agree" value="1" class="ws-agree__input"')) {
    out = out.replace(
      /(<form\b[^>]*class="uw-inquiry-form[\s\S]*?)(<div class="uw-inquiry-actions)/g,
      (_m, before: string, actions: string) => `${before}${CONSENT_PROJECT}\n${actions}`,
    );
  }
  // 유지보수 신청서: 3단계(회신받을 곳) 요약 아래에 동의 체크
  out = out.replace(
    /(<form class="mx-form"[\s\S]*?<div class="mx-summary"[^>]*><\/div>)/,
    (m) => (m.includes('name="privacy_agree"') ? m : `${m}\n${CONSENT_MAINTENANCE}`),
  );
  return out;
}

/** 다른 회사 제작사례 이미지를 쓰던 포트폴리오 모달 속성 비우기(다른 사례와 같은 '이미지 없음' 모드) */
export function removeForeignCaseImages(html: string): string {
  return html
    .replace(/data-port-hero="[^"]*\/main\/projects\/[^"]*"/g, 'data-port-hero=""')
    .replace(/data-port-designs="[^"]*\/main\/projects\/[^"]*"/g, 'data-port-designs=""');
}

/** 푸터 하단: 시안 문구("Private noindex design concept") → 사업자 정보 + 약관 링크 (brand.ts 단일 소스) */
export function rewriteFooter(html: string): string {
  const e = escapeHtml;
  const tel = brand.phone.replace(/\D/g, '');
  const info = `<div class="cm-footer-info">
<dl class="cm-footer-info-item"><dt>메일</dt><dd><a href="mailto:${e(brand.email)}">${e(brand.email)}</a></dd></dl>
<dl class="cm-footer-info-item"><dt>전화</dt><dd><a href="tel:${tel}">${e(brand.phone)}</a></dd></dl>
<dl class="cm-footer-info-item"><dt>주소</dt><dd>${e(brand.address.streetAddress)}</dd></dl>
</div>`;
  const copyright = `<div class="cm-footer-copyright">
<p class="ws-foot-biz"><span>상호 ${e(brand.nameKo)}(${e(brand.name)})</span><span>대표 ${e(brand.legal.representativeName)}</span><span>사업자등록번호 ${e(brand.legal.businessNumber)}</span></p>
<p class="ws-foot-legal"><a href="/privacy-policy"><b>개인정보 처리방침</b></a><a href="/terms">이용약관</a></p>
<p>&copy; ${new Date().getFullYear()} ${e(brand.name)}. All rights reserved.</p>
</div>`;
  return html
    .replace(/<div class="cm-footer-info">[\s\S]*?<\/div>(?=\s*<div class="cm-footer-copyright">)/, info)
    .replace(/<div class="cm-footer-copyright">[\s\S]*?<\/div>/, copyright);
}

/** <main>…</main> 통째 교체 (칼럼 상세·약관 등 리뉴얼 셸을 빌려 쓰는 페이지) */
export function replaceMain(html: string, inner: string, mainClass: string): string {
  const start = html.search(/<main\b/i);
  const end = html.indexOf('</main>');
  if (start < 0 || end < 0) throw new Error('<main>이 없는 셸입니다.');
  return (
    html.slice(0, start) +
    `<main class="cm-main ${mainClass}" id="main-content" role="main">${inner}</main>` +
    html.slice(end + '</main>'.length)
  );
}

/** FAQ 페이지 문답 추출 → FAQPage JSON-LD (화면에 보이는 문답과 같아야 한다) */
export function extractFaqs(html: string): { question: string; answer: string }[] {
  const items = html.match(/<li class="ws-faq-item"[\s\S]*?<\/li>/g) ?? [];
  return items
    .map((li) => {
      const q = li.match(/<span class="ws-faq-q__text">([\s\S]*?)<\/span>/)?.[1] ?? '';
      const body = li.match(/<div class="ws-faq-a__body">([\s\S]*?)<\/div>/)?.[1] ?? '';
      const paras = (body.match(/<p>[\s\S]*?<\/p>/g) ?? []).map(textOf);
      return { question: textOf(q), answer: paras.join(' ') };
    })
    .filter((f) => f.question && f.answer);
}

function textOf(fragment: string): string {
  return fragment
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// 속도 — 시안에 딸려 온 WordPress 군더더기와 렌더를 막는 스크립트 정리 (2026-11-05 Lighthouse 기준)
// ---------------------------------------------------------------------------

/** 블록 에디터용 인라인 스타일 — 리뉴얼 페이지는 wp-block·has-* 클래스를 쓰지 않는다(페이지당 약 14KB) */
const UNUSED_WP_STYLES = [
  'wp-img-auto-sizes-contain-inline-css',
  'wp-block-library-inline-css',
  'classic-theme-styles-inline-css',
  'global-styles-inline-css',
];
/** 버전 없는 unpkg 주소는 302를 한 번 거친다 — 버전을 고정한 jsDelivr(이미 preconnect)로 */
const SPLITTING_SRC = 'https://cdn.jsdelivr.net/npm/splitting@1.1.0/dist/splitting.min.js';

export function optimizeAssets(html: string): string {
  let out = html;
  for (const id of UNUSED_WP_STYLES) out = out.replace(new RegExp(`<style id="${id}">[\\s\\S]*?</style>\\s*`, 'g'), '');
  out = out
    .replace(/src="https:\/\/unpkg\.com\/splitting\/dist\/splitting\.min\.js[^"]*"/g, `src="${SPLITTING_SRC}"`)
    .replace(/<link rel="preconnect" href="https:\/\/unpkg\.com"[^>]*>\s*/g, '')
    .replace(/<link rel=['"]dns-prefetch['"] href=['"]\/\/unpkg\.com['"][^>]*>\s*/g, '');
  // 자동 재생 영상: autoplay가 있으면 preload 값과 상관없이 처음부터 내려받는다 — 화면에 보일 때 public/site/ws-media.js가 재생
  out = out.replace(/<video\b[^>]*>/g, (tag) => {
    if (!/\sautoplay(?:="[^"]*")?(?=[\s>])/.test(tag)) return tag;
    return tag
      .replace(/\sautoplay(?:="[^"]*")?(?=[\s>])/, ' data-ws-autoplay')
      .replace(/\spreload="[^"]*"/, '')
      .replace(/^<video\b/, '<video preload="none"');
  });
  // 외부 스크립트는 전부 defer — 문서 순서대로 실행되므로 jQuery → 테마 → 리뉴얼 레이어 순서는 그대로다.
  // 인라인 스크립트는 설정값(uwBoard·uwInquiry)만 정의해 외부 스크립트보다 먼저 돌아도 된다.
  // 운영 head 조각(폼 연결·분석)은 이 변환 뒤에 들어가 영향을 받지 않는다.
  out = out.replace(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)><\/script>/g, (tag, before: string, src: string, after: string) => {
    const attrs = before + after;
    if (/\b(defer|async)\b|type="module"/.test(attrs)) return tag;
    return `<script${before}src="${src}"${after} defer></script>`;
  });
  // 채용 히어로 사진은 CSS 배경이라 늦게 발견된다(가장 큰 화면 요소) — 미리 받기
  if (out.includes('class="cr-hero__photo"')) {
    out = out.replace('</head>', '<link rel="preload" as="image" href="/assets/webslab/careers-team-v2.webp" media="(min-width: 641px)" fetchpriority="high">\n' +
        '<link rel="preload" as="image" href="/assets/webslab/careers-team-v2-800.webp" media="(max-width: 640px)" fetchpriority="high">\n</head>');
  }
  return out;
}

export type ProductionOptions = {
  title?: string;
  headStart: string;
  headEnd: string;
  bodyStart?: string;
};

/** 모든 리뉴얼 페이지 공통 변환 (페이지별 본문 치환은 호출 쪽에서 먼저 한다) */
export function toProductionHtml(raw: string, opts: ProductionOptions): string {
  let html = stripPreviewHead(raw);
  html = stripComments(html);
  if (opts.title) html = replaceTitle(html, opts.title);
  html = removePreviewAttributes(html);
  html = replacePreviewCopy(html);
  html = prepareForms(html);
  html = removeForeignCaseImages(html);
  html = rewriteFooter(html);
  html = normalizeLinks(html);
  html = optimizeAssets(html);
  html = injectHead(html, opts.headStart, opts.headEnd);
  html = injectBodyStart(html, opts.bodyStart ?? '');
  html = disableEmailObfuscation(html);
  return html;
}
