// 공지사항 — 리뉴얼 원본(/notice)의 빈 목록 자리에 실제 글을 채우고, 글 한 편의 본문 화면을 만든다.
// 예전에는 브라우저가 notices.js로 그려서 검색·AI 수집기가 본문을 읽지 못했다(2026-11-23 서버 렌더로 변경).
// 순수 함수만 둔다 — head(SEO)까지 붙인 완성 페이지는 notice-pages.ts.

import { escapeHtml as e } from '@/lib/site-html';
import type { Notice } from '@/data/notices';

/** 목록 한 쪽에 보이는 글 수 — support-v1.js의 PER와 같아야 한다 */
export const NOTICES_PER_PAGE = 10;

const CHEV =
  '<svg class="ws-notice-row__chev" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const LEFT =
  '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const dotted = (iso: string) => iso.replace(/-/g, '.');

export const noticePath = (n: Pick<Notice, 'no'>) => `/notice/${n.no}`;

/** 문단(HTML) → 글자만 */
export function noticeText(n: Notice): string {
  return n.body
    .join(' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 고정 글 먼저, 그다음 번호가 큰(새) 글부터 */
export function orderNotices(list: Notice[]): Notice[] {
  const byNo = (a: Notice, b: Notice) => b.no - a.no;
  return [...list.filter((n) => n.pinned).sort(byNo), ...list.filter((n) => !n.pinned).sort(byNo)];
}

export function renderNoticeRows(list: Notice[]): string {
  return orderNotices(list)
    .map((n, i) => {
      const mark = n.pinned
        ? '<span class="ws-notice-row__pin">공지</span>'
        : `<span class="ws-notice-row__no">${n.no}</span>`;
      // data-search: 목록 검색이 본문까지 찾도록(소문자). 11번째 글부터는 스크립트가 쪽을 나누기 전에도 접어 둔다.
      return `<li data-search="${e(`${n.title} ${noticeText(n)}`.toLowerCase())}"${i >= NOTICES_PER_PAGE ? ' hidden' : ''}><a class="ws-notice-row${n.pinned ? ' is-pinned' : ''}" href="${noticePath(n)}">${mark}<strong class="ws-notice-row__title"><span>${e(n.title)}</span></strong><time class="ws-notice-row__date" datetime="${n.date}">${dotted(n.date)}</time>${CHEV}</a></li>`;
    })
    .join('\n');
}

const COUNT_SLOT = '<p class="ws-sup__count" aria-live="polite"></p>';
const LIST_SLOT = '<ul class="ws-notice-list"></ul>';
const LISTVIEW_START = '<div class="ws-sup__listview">';
const POST_START = '<article class="ws-post" hidden>';
const POST_END = '</article>';

function slots(raw: string) {
  const listview = raw.indexOf(LISTVIEW_START);
  const post = raw.indexOf(POST_START);
  const postEnd = raw.indexOf(POST_END, post);
  if (listview < 0 || post < listview || postEnd < 0) {
    throw new Error('공지사항 원본에서 목록(ws-sup__listview)·본문(ws-post) 자리를 찾지 못했습니다.');
  }
  return { listview, post, postEnd: postEnd + POST_END.length };
}

/** /notice — 글 수와 목록 줄을 채우고, 브라우저용 빈 본문 틀은 뺀다 */
export function applyNoticeList(raw: string, list: Notice[]): string {
  if (!raw.includes(COUNT_SLOT) || !raw.includes(LIST_SLOT)) {
    throw new Error('공지사항 원본에서 글 수(ws-sup__count)·목록(ws-notice-list) 자리를 찾지 못했습니다.');
  }
  const { post, postEnd } = slots(raw);
  return (raw.slice(0, post) + raw.slice(postEnd))
    .replace(COUNT_SLOT, `<p class="ws-sup__count" aria-live="polite">전체 <strong>${list.length}</strong>건</p>`)
    .replace(LIST_SLOT, `<ul class="ws-notice-list">\n${renderNoticeRows(list)}\n</ul>`);
}

function renderPost(n: Notice, list: Notice[]): string {
  // 이전·다음은 고정 여부와 상관없이 번호 순서
  const byNo = [...list].sort((a, b) => b.no - a.no);
  const at = byNo.findIndex((x) => x.no === n.no);
  const neighbors: [string, Notice | undefined][] = [
    ['다음 글', byNo[at - 1]],
    ['이전 글', byNo[at + 1]],
  ];
  const nav = neighbors
    .map(([label, x]) =>
      x
        ? `<li><a href="${noticePath(x)}"><small>${label}</small><span>${e(x.title)}</span><time datetime="${x.date}">${dotted(x.date)}</time></a></li>`
        : '',
    )
    .join('');
  return `<article class="ws-post">
      <a class="ws-post__back" href="/notice">${LEFT}공지사항 목록</a>
      <header class="ws-post__head">
        ${n.pinned ? '<span class="ws-notice-row__pin ws-post__pin">공지</span>' : ''}
        <h1 class="ws-post__title">${e(n.title)}</h1>
        <p class="ws-post__meta"><span>웹스랩</span><span><time class="ws-post__date" datetime="${n.date}">${dotted(n.date)}</time></span></p>
      </header>
      <div class="ws-post__body">${n.body.map((p) => `<p>${p}</p>`).join('')}</div>
      ${nav ? `<ul class="ws-post__nav" aria-label="다른 공지">${nav}</ul>` : ''}
      <div class="ws-post__foot"><a class="ws-sup__btn ws-post__back" href="/notice">목록으로</a></div>
    </article>`;
}

/** /notice/<번호> — 목록 자리를 글 한 편으로 바꾼다. 페이지 제목(h1)은 글 제목이 되고, '공지사항'은 한 단계 내린다. */
export function applyNoticePost(raw: string, n: Notice, list: Notice[]): string {
  const { listview, postEnd } = slots(raw);
  return (raw.slice(0, listview) + renderPost(n, list) + raw.slice(postEnd)).replace(
    /<h1 class="ws-sup__title">([\s\S]*?)<\/h1>/,
    '<p class="ws-sup__title">$1</p>',
  );
}
