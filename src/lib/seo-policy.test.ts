import { describe, expect, it } from 'vitest';
import {
  buildCaseSitemapEntries,
  COMMERCIAL_METADATA,
  CORE_GUIDE_LINKS,
  crawlerRules,
  STATIC_PAGE_DATES,
} from './seo-policy';

describe('crawlerRules', () => {
  it('allows Next.js rendering assets and blocks only API routes for general crawlers', () => {
    const general = crawlerRules.find((rule) => rule.userAgent === '*');

    expect(general).toEqual({ userAgent: '*', allow: '/', disallow: ['/api/'] });
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
    expect(COMMERCIAL_METADATA['/portfolio'].keyword).toBe('B2B 홈페이지 제작 사례');
    expect(COMMERCIAL_METADATA['/about'].keyword).toBe('기업 홈페이지 전문 에이전시');
    expect(new Set(Object.values(COMMERCIAL_METADATA).map((item) => item.keyword)).size).toBe(4);
  });
});

describe('sitemap freshness', () => {
  it('uses maintained significant-update dates for static pages', () => {
    expect(STATIC_PAGE_DATES).toMatchObject({
      '/': '2026-06-22',
      '/about': '2026-06-22',
      '/service': '2026-06-22',
      '/portfolio': '2026-06-22',
    });
  });

  it('uses each case modified date', () => {
    const entries = buildCaseSitemapEntries([{ slug: 'sample', modifiedAt: '2026-05-30' }]);

    expect(entries).toEqual([{ path: '/portfolio/sample', lastmod: '2026-05-30' }]);
  });
});
