import { describe, expect, it } from 'vitest';
import pageDates from '@/site/page-dates.json';
import {
  buildCaseSitemapEntries,
  CASE_PAGE_DATES,
  COMMERCIAL_METADATA,
  CORE_GUIDE_LINKS,
  crawlerRules,
  STATIC_PAGE_DATES,
  STATIC_PAGE_PUBLISHED,
} from './seo-policy';

describe('crawlerRules', () => {
  it('네이버·구글 검색봇은 막지 않고, 같은 봇을 허용과 차단에 동시에 두지 않는다', () => {
    const blocked = crawlerRules.filter((r) => r.disallow.includes('/')).map((r) => r.userAgent);
    const allowed = crawlerRules.filter((r) => r.allow === '/').map((r) => r.userAgent);
    for (const bot of ['Yeti', 'Googlebot', 'Bingbot', 'Daum']) expect(blocked, bot).not.toContain(bot);
    expect(allowed.filter((a) => blocked.includes(a))).toEqual([]);
    // Cloudflare 관리 robots가 막는 옛 Anthropic 이름은 허용하지 않는다(두 robots 모순 방지)
    expect(allowed).not.toContain('Claude-Web');
  });

  it('allows Next.js rendering assets and blocks API/admin routes for general crawlers', () => {
    const general = crawlerRules.find((rule) => rule.userAgent === '*');

    expect(general).toEqual({ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] });
  });

  it('defines contextual column links for every core commercial page', () => {
    expect(CORE_GUIDE_LINKS['/'].map((item) => item.href)).toEqual([
      '/column/corporate-website-cost',
      '/column/website-agency-selection',
    ]);
    expect(CORE_GUIDE_LINKS['/service']).toHaveLength(4);
    expect(CORE_GUIDE_LINKS['/portfolio']).toHaveLength(3);
    expect(CORE_GUIDE_LINKS['/about']).toHaveLength(2);
  });
});

describe('commercial page metadata', () => {
  it('maps one distinct target keyword to each core page', () => {
    expect(COMMERCIAL_METADATA['/'].keyword).toBe('기업 홈페이지 제작 업체');
    expect(COMMERCIAL_METADATA['/service'].keyword).toBe('기업 홈페이지 제작');
    expect(COMMERCIAL_METADATA['/portfolio'].keyword).toBe('홈페이지 제작 사례');
    expect(COMMERCIAL_METADATA['/about'].keyword).toBe('기업 홈페이지 전문 에이전시');
    expect(new Set(Object.values(COMMERCIAL_METADATA).map((item) => item.keyword)).size).toBe(4);
  });
});

describe('sitemap freshness', () => {
  it('리뉴얼 페이지 수정일은 동기화가 관리하는 page-dates.json에서 오고, 모든 공개 페이지에 있다', () => {
    const synced = Object.keys(pageDates).filter((p) => !p.startsWith('/portfolio/'));
    for (const path of synced) expect(STATIC_PAGE_DATES[path], path).toBe((pageDates as Record<string, { modified: string }>)[path].modified);
    for (const path of ['/', '/about', '/service', '/program', '/portfolio', '/column', '/contact', '/faq', '/notice', '/maintenance', '/maintenance/pricing', '/careers', '/privacy-policy', '/terms']) {
      expect(STATIC_PAGE_DATES[path], path).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    // 사례 상세는 sitemap-cases가 따로 다룬다
    expect(Object.keys(STATIC_PAGE_DATES).some((p) => p.startsWith('/portfolio/'))).toBe(false);
    expect(Object.keys(CASE_PAGE_DATES).length).toBeGreaterThanOrEqual(8);
  });

  it('수정일은 미래가 아니고, 공개일보다 앞서지 않는다', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    for (const [path, date] of Object.entries(STATIC_PAGE_DATES)) {
      expect(date <= tomorrow, path).toBe(true);
      if (STATIC_PAGE_PUBLISHED[path]) expect(date >= STATIC_PAGE_PUBLISHED[path], path).toBe(true);
    }
  });

  it('uses each case modified date', () => {
    const entries = buildCaseSitemapEntries([{ slug: 'sample', modifiedAt: '2026-05-30' }]);

    expect(entries).toEqual([{ path: '/portfolio/sample', lastmod: '2026-05-30' }]);
  });
});
