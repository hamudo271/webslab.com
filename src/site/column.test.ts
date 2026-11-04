import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ColumnListItem } from '@/lib/column-feed';
import { POST_CATEGORIES } from '@/data/postCategories';
import { applyColumnList, COLUMN_GROUPS, columnGroupOf, isoDay, renderArticle } from './column';
import { representative } from '@/data/authors';

const item = (slug: string, category: string, publishedAt = '2026-06-22'): ColumnListItem => ({
  slug,
  title: `제목 ${slug}`,
  excerpt: '요약',
  category,
  publishedAt,
  readMinutes: 8,
  cover: null,
  source: 'static',
});

describe('칼럼 목록', () => {
  it('모든 글 카테고리가 목록 분류 하나에 들어간다', () => {
    const grouped = COLUMN_GROUPS.flatMap((g) => g.categories);
    for (const c of POST_CATEGORIES) expect(grouped, c).toContain(c);
  });

  it('시안 목록 자리를 실제 글로 채우고, 라이브 사이트 링크를 없앤다', () => {
    const raw = fs.readFileSync(path.join(__dirname, 'pages/column.html'), 'utf8');
    const html = applyColumnList(raw, [
      item('a', 'SEO'),
      item('b', '비용·견적'),
      item('c', 'CMS·운영'),
    ]);
    expect(html.match(/class="col-row"/g)).toHaveLength(3);
    expect(html).toContain('<a href="/column/a">');
    expect(html).toContain('data-cat="SEO·CMS"');
    expect(html).toContain('>SEO·CMS<small>2</small>');
    expect(html).toContain('>견적·준비<small>1</small>');
    expect(html).toContain('<b>3</b>편');
    expect(html).not.toContain('col-more');
    expect(html).not.toContain('웹스랩 사이트에서 전체 칼럼 보기');
  });

  it('없는 분류 탭은 만들지 않는다', () => {
    const raw = fs.readFileSync(path.join(__dirname, 'pages/column.html'), 'utf8');
    const html = applyColumnList(raw, [item('a', 'SEO')]);
    expect(html).not.toContain('data-cat="운영·유지보수" aria-pressed');
  });

  it('DB 글 일시는 한국 날짜로', () => {
    expect(isoDay('2026-06-22')).toBe('2026-06-22');
    expect(isoDay('2026-11-03T16:30:00.000Z')).toBe('2026-11-04');
    expect(columnGroupOf('알수없음')).toBe('제작·리뉴얼');
  });
});

describe('칼럼 상세', () => {
  it('제목·요약·FAQ를 이스케이프해 그리고 본문 HTML은 그대로 둔다', () => {
    const html = renderArticle({
      slug: 's',
      title: '<제목>',
      excerpt: '요약',
      category: 'SEO',
      publishedAt: '2026-06-22',
      modifiedAt: '2026-06-22',
      readMinutes: 5,
      cover: '/images/column/s.png',
      author: representative,
      bodyHtml: '<h2>본문</h2>',
      tldr: 'TL;DR',
      directAnswer: '한 줄',
      faqs: [{ question: 'Q<1>', answer: 'A' }],
      related: [],
      cta: { title: 'CTA', description: '설명', serviceHref: '/service', serviceLabel: '서비스' },
    });
    expect(html).toContain('&lt;제목&gt;');
    expect(html).toContain('<h2>본문</h2>');
    expect(html).toContain('Q&lt;1&gt;');
    expect(html).toContain('src="/images/column/s.png"');
    expect(html).not.toContain('수정 <time'); // 발행일과 같으면 수정일 생략
  });
});
