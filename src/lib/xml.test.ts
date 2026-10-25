import { describe, expect, it } from 'vitest';
import { latestDate, rssXml, sitemapIndexXml, urlsetXml } from './xml';

describe('urlsetXml', () => {
  it('declares the image namespace and emits image:loc per image', () => {
    const xml = urlsetXml([
      { loc: 'https://x.kr/a', lastmod: '2026-09-10', images: ['https://x.kr/a.webp', 'https://x.kr/a-full.webp'] },
    ]);
    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    expect(xml.match(/<image:loc>/g)).toHaveLength(2);
    expect(xml).toContain('<lastmod>2026-09-10</lastmod>');
  });

  it('escapes special characters in URLs', () => {
    expect(urlsetXml([{ loc: 'https://x.kr/?a=1&b=2' }])).toContain('a=1&amp;b=2');
  });
});

describe('sitemapIndexXml', () => {
  it('adds lastmod only when known', () => {
    const xml = sitemapIndexXml([
      { loc: 'https://x.kr/s1.xml', lastmod: '2026-09-10' },
      { loc: 'https://x.kr/s2.xml' },
    ]);
    expect(xml).toContain('<sitemap><loc>https://x.kr/s1.xml</loc><lastmod>2026-09-10</lastmod></sitemap>');
    expect(xml).toContain('<sitemap><loc>https://x.kr/s2.xml</loc></sitemap>');
  });
});

describe('latestDate', () => {
  it('normalizes ISO strings to dates and picks the newest', () => {
    expect(latestDate(['2026-06-22', '2026-09-10T08:00:00.000Z', undefined])).toBe('2026-09-10');
    expect(latestDate([undefined])).toBeUndefined();
  });
});

describe('rssXml', () => {
  const xml = rssXml({
    title: '칼럼',
    link: 'https://x.kr/column',
    description: '설명',
    selfUrl: 'https://x.kr/rss.xml',
    image: { url: 'https://x.kr/logo.png', width: 144, height: 30 },
    ttl: 60,
    items: [
      {
        title: 'A & B',
        link: 'https://x.kr/column/a',
        description: '요약',
        pubDate: new Date('2026-09-10T00:00:00Z'),
        author: '조현도',
        image: 'https://x.kr/a.webp',
      },
    ],
  });

  it('declares dc and media namespaces', () => {
    expect(xml).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    expect(xml).toContain('xmlns:media="http://search.yahoo.com/mrss/"');
  });

  it('emits author, item thumbnail with mime type, and channel image', () => {
    expect(xml).toContain('<dc:creator>조현도</dc:creator>');
    expect(xml).toContain('<media:content url="https://x.kr/a.webp" medium="image" type="image/webp"/>');
    expect(xml).toContain('<image><url>https://x.kr/logo.png</url>');
    expect(xml).toContain('<ttl>60</ttl>');
    expect(xml).toContain('<title>A &amp; B</title>');
  });
});
