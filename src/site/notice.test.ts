import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { notices } from '@/data/notices';
import { columnPosts } from '@/data/columnPosts';
import { portfolios } from '@/data/portfolios';
import { STATIC_PAGE_DATES } from '@/lib/seo-policy';
import { applyNoticeList, applyNoticePost, NOTICES_PER_PAGE, noticeText, orderNotices } from './notice';

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');
const raw = read('src/site/pages/notice.html');
const faq = read('src/site/pages/faq.html');

/** 사이트 안 주소가 실제로 있는 페이지인지 — 칼럼·사례는 데이터, 그 밖은 등록된 경로와 공개 파일 */
function exists(href: string): boolean {
  const p = href.replace(/[#?].*$/, '').replace(/(.)\/$/, '$1');
  if (p.startsWith('/column/')) return columnPosts.some((c) => `/column/${c.slug}` === p);
  if (p.startsWith('/portfolio/')) return portfolios.some((c) => `/portfolio/${c.slug}` === p);
  if (p.startsWith('/notice/')) return notices.some((n) => `/notice/${n.no}` === p);
  if (p === '/rss.xml') return true;
  if (p.startsWith('/assets/')) return fs.existsSync(path.join(process.cwd(), 'public', p));
  return p in STATIC_PAGE_DATES;
}
const internalLinks = (html: string) => Array.from(html.matchAll(/href="(\/[^"]*)"/g), (m) => m[1]);

describe('공지사항 데이터', () => {
  it('번호는 겹치지 않고, 날짜는 YYYY-MM-DD, 본문은 비어 있지 않다', () => {
    expect(new Set(notices.map((n) => n.no)).size).toBe(notices.length);
    for (const n of notices) {
      expect(n.date, `${n.no}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(n.title.trim().length, `${n.no}`).toBeGreaterThan(5);
      expect(noticeText(n).length, `${n.no}`).toBeGreaterThan(60);
    }
  });

  it('본문에는 strong·a 말고 다른 태그를 쓰지 않는다', () => {
    for (const n of notices) {
      const tags = n.body.join(' ').match(/<\/?([a-z0-9]+)/gi) ?? [];
      for (const t of tags) expect(['<strong', '</strong', '<a', '</a'], `${n.no}: ${t}`).toContain(t.toLowerCase());
    }
  });

  it('본문의 사이트 안 링크는 모두 실제로 있는 페이지다', () => {
    for (const n of notices) {
      for (const href of internalLinks(n.body.join(' '))) expect(exists(href), `${n.no}: ${href}`).toBe(true);
    }
  });

  it('고정 글이 맨 위, 그다음은 새 글부터', () => {
    const ordered = orderNotices(notices);
    const firstNormal = ordered.findIndex((n) => !n.pinned);
    expect(ordered.slice(0, firstNormal).every((n) => n.pinned)).toBe(true);
    const rest = ordered.slice(firstNormal).map((n) => n.no);
    expect(rest).toEqual([...rest].sort((a, b) => b - a));
  });
});

describe('공지사항 페이지', () => {
  const list = applyNoticeList(raw, notices);

  it('목록은 모든 글의 제목과 주소를 HTML에 담는다(스크립트 없이도 읽힌다)', () => {
    expect(list).toContain(`전체 <strong>${notices.length}</strong>건`);
    for (const n of notices) {
      expect(list, `${n.no}`).toContain(`href="/notice/${n.no}"`);
      expect(list, `${n.no}`).toContain(n.title.replace(/&/g, '&amp;'));
    }
    expect(list).not.toContain('<article class="ws-post"');
    expect(list).not.toContain('notices.js');
  });

  it('한 쪽을 넘는 글은 접어 두고, 접힌 줄 수가 맞다', () => {
    expect((list.match(/<li data-search="[^"]*" hidden>/g) ?? []).length).toBe(
      Math.max(0, notices.length - NOTICES_PER_PAGE),
    );
  });

  it('본문 페이지는 글 제목이 h1 하나이고 목록·검색창이 없다', () => {
    for (const n of notices) {
      const html = applyNoticePost(raw, n, notices);
      expect(html.match(/<h1\b/g) ?? [], `${n.no}`).toHaveLength(1);
      expect(html, `${n.no}`).toContain(`<h1 class="ws-post__title">${n.title.replace(/&/g, '&amp;')}</h1>`);
      expect(html, `${n.no}`).toContain(`<p>${n.body[0]}</p>`);
      expect(html, `${n.no}`).not.toContain('ws-sup__listview');
      expect(html, `${n.no}`).not.toContain('ws-post" hidden');
    }
  });

  it('이전·다음 글은 번호 순서로 잇는다', () => {
    const nos = notices.map((n) => n.no).sort((a, b) => a - b);
    const first = applyNoticePost(raw, notices.find((n) => n.no === nos[0])!, notices);
    expect(first).toContain('<small>다음 글</small>');
    expect(first).not.toContain('<small>이전 글</small>');
    expect(first).toContain(`href="/notice/${nos[1]}"`);
  });
});

describe('자주묻는질문 페이지', () => {
  it('답의 사이트 안 링크는 모두 실제로 있는 페이지다', () => {
    const main = faq.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '';
    const links = internalLinks(main);
    expect(links.length).toBeGreaterThan(40);
    for (const href of links) expect(exists(href), href).toBe(true);
  });

  it('질문 번호(faq-N)와 분류별 개수 표시가 실제 질문과 맞다', () => {
    const items = Array.from(faq.matchAll(/<li class="ws-faq-item" id="(faq-\d+)" data-cat="([^"]+)"/g));
    expect(new Set(items.map((m) => m[1])).size).toBe(items.length);
    expect(faq).toContain(`data-cat="all" aria-pressed="true">전체<small>${items.length}</small>`);
    for (const cat of Array.from(new Set(items.map((m) => m[2])))) {
      const count = items.filter((m) => m[2] === cat).length;
      expect(faq, cat).toContain(`data-cat="${cat}" aria-pressed="false">${cat}<small>${count}</small>`);
    }
  });
});
