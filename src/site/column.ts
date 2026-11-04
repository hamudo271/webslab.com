// 전문 칼럼 — 리뉴얼 셸 안에 들어가는 목록 줄·상세 본문 HTML.
// 목록은 리뉴얼 시안(column-v1)과 같은 마크업을 쓰고, 글은 정적 18편 + 관리자(DB) 발행글을 함께 보여준다.

import { escapeHtml as e } from '@/lib/site-html';
import type { ColumnListItem } from '@/lib/column-feed';
import type { ColumnPost } from '@/data/columnPosts';
import type { Author } from '@/data/authors';

/** 목록 탭 분류 — 글 카테고리(POST_CATEGORIES)를 6개 묶음으로. 시안의 분류(제작·리뉴얼 등)를 그대로 잇는다. */
export const COLUMN_GROUPS: { name: string; categories: string[] }[] = [
  { name: '견적·준비', categories: ['비용·견적', '업체 선정', '일정·프로세스'] },
  { name: '제작·리뉴얼', categories: ['리뉴얼', 'B2B 전략', '제조업', '물류·무역', '의료·병원'] },
  { name: 'SEO·CMS', categories: ['SEO', 'SEO·마이그레이션', 'CMS·운영'] },
  { name: '디자인·UX', categories: ['디자인·UX', '공공·접근성'] },
  { name: '기술·플랫폼', categories: ['기술·플랫폼'] },
  { name: '운영·유지보수', categories: ['운영·유지보수'] },
];

export function columnGroupOf(category: string): string {
  return COLUMN_GROUPS.find((g) => g.categories.includes(category))?.name ?? '제작·리뉴얼';
}

const seoulDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' });

/** ISO(날짜 또는 일시) → YYYY-MM-DD (한국 시간) */
export function isoDay(iso: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return seoulDate.format(new Date(iso));
}

const dotted = (iso: string) => isoDay(iso).replace(/-/g, '.');
const two = (n: number) => (n < 10 ? `0${n}` : String(n));

const ARROW =
  '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5m0 0H7.5M15 5v7.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** 시안의 분류 탭 + 개수 + 목록(ol)을 실제 글 목록으로 다시 그린다. */
export function renderColumnList(items: ColumnListItem[]): string {
  const groups = COLUMN_GROUPS.map((g) => ({
    name: g.name,
    count: items.filter((it) => columnGroupOf(it.category) === g.name).length,
  })).filter((g) => g.count > 0);

  const tabs = [
    `<li><button type="button" data-cat="all" aria-pressed="true">전체<small>${items.length}</small></button></li>`,
    ...groups.map(
      (g) =>
        `<li><button type="button" data-cat="${e(g.name)}" aria-pressed="false">${e(g.name)}<small>${g.count}</small></button></li>`,
    ),
  ].join('');

  const rows = items
    .map(
      (it, i) =>
        `<li class="col-row" data-cat="${e(columnGroupOf(it.category))}"><a href="/column/${encodeURIComponent(it.slug)}"><span class="col-row__no">${two(i + 1)}</span><span class="col-row__body"><span class="col-row__tag">${e(it.category)}</span><strong class="col-row__title">${e(it.title)}</strong><span class="col-row__meta"><time datetime="${isoDay(it.publishedAt)}">${dotted(it.publishedAt)}</time><span>${it.readMinutes}분 분량</span></span></span><span class="col-row__go">${ARROW}</span></a></li>`,
    )
    .join('\n');

  return `<div class="col-bar">
<ul class="col-tabs" aria-label="칼럼 분류">${tabs}</ul>
<p class="col-count" aria-live="polite"><b>${items.length}</b>편</p>
</div>
<ol class="col-list">
${rows}
</ol>`;
}

/** /column 원본 HTML의 목록 부분 교체 + "웹스랩 사이트에서 전체 칼럼 보기"(시안용 외부 링크) 제거 */
export function applyColumnList(raw: string, items: ColumnListItem[]): string {
  const start = raw.indexOf('<div class="col-bar">');
  const end = raw.indexOf('</ol>', start);
  if (start < 0 || end < 0) throw new Error('칼럼 목록 자리(col-bar ~ col-list)를 찾지 못했습니다.');
  return (raw.slice(0, start) + renderColumnList(items) + raw.slice(end + '</ol>'.length)).replace(
    /<p class="col-more">[\s\S]*?<\/p>/,
    '',
  );
}

// ---------------------------------------------------------------------------
// 상세
// ---------------------------------------------------------------------------

export type ArticleView = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  modifiedAt?: string;
  readMinutes: number;
  cover?: string | null;
  author: Author;
  bodyHtml: string;
  tldr?: string;
  directAnswer?: string;
  faqs?: { question: string; answer: string }[];
  related?: Pick<ColumnPost, 'slug' | 'title' | 'category' | 'excerpt'>[];
  cta: { title: string; description: string; serviceHref: string; serviceLabel: string };
};

export function renderArticle(a: ArticleView): string {
  const group = columnGroupOf(a.category);
  const showModified = a.modifiedAt && isoDay(a.modifiedAt) !== isoDay(a.publishedAt);

  const summary =
    a.tldr || a.directAnswer
      ? `<aside class="ws-article__summary" aria-label="핵심 요약">
<p class="ws-article__summary-label">핵심 요약</p>
${a.tldr ? `<p>${e(a.tldr)}</p>` : ''}
${a.directAnswer ? `<p class="ws-article__answer"><b>한 줄 답</b>${e(a.directAnswer)}</p>` : ''}
</aside>`
      : '';

  const faqs = a.faqs?.length
    ? `<section class="ws-article__faq" aria-labelledby="faq-title">
<h2 id="faq-title">자주 묻는 질문</h2>
${a.faqs
  .map(
    (f) =>
      `<details class="ws-article__qa"><summary><span class="ws-article__q">Q</span>${e(f.question)}</summary><p>${e(f.answer)}</p></details>`,
  )
  .join('\n')}
</section>`
    : '';

  const related = a.related?.length
    ? `<section class="ws-article__related" aria-labelledby="related-title">
<h2 id="related-title">함께 읽으면 좋은 글</h2>
<ul>${a.related
        .map(
          (r) =>
            `<li><a href="/column/${encodeURIComponent(r.slug)}"><span>${e(r.category)}</span><strong>${e(r.title)}</strong><small>${e(r.excerpt)}</small></a></li>`,
        )
        .join('')}</ul>
</section>`
    : '';

  return `<article class="ws-article">
<div class="ws-article__inner">
<nav class="ws-article__crumbs" aria-label="현재 위치"><a href="/">홈</a><span aria-hidden="true">/</span><a href="/column">전문 칼럼</a></nav>
<header class="ws-article__head">
<p class="ws-article__cat"><a href="/column#${encodeURIComponent(group)}">${e(a.category)}</a></p>
<h1 class="ws-article__title">${e(a.title)}</h1>
<p class="ws-article__lead">${e(a.excerpt)}</p>
<p class="ws-article__meta"><span>${e(a.author.name)} · ${e(a.author.role)}</span><time datetime="${isoDay(a.publishedAt)}">${dotted(a.publishedAt)}</time>${showModified ? `<span>수정 <time datetime="${isoDay(a.modifiedAt!)}">${dotted(a.modifiedAt!)}</time></span>` : ''}<span>${a.readMinutes}분 분량</span></p>
</header>
${a.cover ? `<figure class="ws-article__cover"><img src="${e(a.cover)}" width="1200" height="630" alt="${e(a.title)}" fetchpriority="high"></figure>` : ''}
${summary}
<div class="ws-prose">${a.bodyHtml}</div>
${faqs}
<aside class="ws-article__author" aria-label="글쓴이">
<p class="ws-article__author-name">${e(a.author.name)}<span>${e(a.author.role)}</span></p>
<p>${e(a.author.bio)}</p>
</aside>
${related}
<aside class="ws-article__cta">
<h2>${e(a.cta.title)}</h2>
<p>${e(a.cta.description)}</p>
<div class="ws-article__cta-actions"><a class="ws-btn ws-btn--primary" href="/contact">무료 상담 신청하기</a><a class="ws-btn" href="${e(a.cta.serviceHref)}">${e(a.cta.serviceLabel)}</a></div>
</aside>
<p class="ws-article__back"><a href="/column">← 칼럼 목록으로</a></p>
</div>
</article>`;
}

/** 없는 글 */
export function renderArticleNotFound(): string {
  return `<section class="ws-doc ws-doc--center">
<div class="ws-doc__inner">
<p class="ws-doc__label">404</p>
<h1 class="ws-doc__title">글을 찾을 수 없어요</h1>
<p class="ws-doc__lead">주소가 바뀌었거나 삭제된 글이에요. 전체 칼럼 목록에서 다시 찾아보세요.</p>
<p class="ws-doc__actions"><a class="ws-btn ws-btn--primary" href="/column">칼럼 목록 보기</a><a class="ws-btn" href="/">홈으로</a></p>
</div>
</section>`;
}
