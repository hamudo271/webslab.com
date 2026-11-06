import { describe, expect, it } from 'vitest';
import { absolutizeHtml, latestDate, rssXml, sitemapIndexXml, urlsetXml } from './xml';

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

  it('본문 전체를 content:encoded(CDATA)로 싣고, 항목을 최신순으로 정렬해 lastBuildDate를 최신 항목에 맞춘다', () => {
    const feed = rssXml({
      title: 't', link: 'https://x.kr/', description: 'd', selfUrl: 'https://x.kr/rss.xml',
      items: [
        { title: '옛 글', link: 'https://x.kr/a', description: 'a', pubDate: new Date('2026-01-01T00:00:00Z') },
        { title: '새 글', link: 'https://x.kr/b', description: 'b', pubDate: new Date('2026-09-01T00:00:00Z'), content: '<p>본문 ]]> 끝</p>' },
      ],
    });
    expect(feed).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
    expect(feed.indexOf('새 글')).toBeLessThan(feed.indexOf('옛 글'));
    expect(feed).toContain(`<lastBuildDate>${new Date('2026-09-01T00:00:00Z').toUTCString()}</lastBuildDate>`);
    expect(feed).toContain('<content:encoded><![CDATA[<p>본문 ]]]]><![CDATA[> 끝</p>]]></content:encoded>');
  });

  it('본문의 루트 상대 경로를 절대 URL로 바꾼다(외부·프로토콜 상대 주소는 그대로)', () => {
    expect(absolutizeHtml('<a href="/column/a">a</a><img src="/images/x.png"><a href="https://o.kr/">o</a><img src="//cdn/x">', 'https://x.kr/'))
      .toBe('<a href="https://x.kr/column/a">a</a><img src="https://x.kr/images/x.png"><a href="https://o.kr/">o</a><img src="//cdn/x">');
  });

  it('emits author, item thumbnail with mime type, and channel image', () => {
    expect(xml).toContain('<dc:creator>조현도</dc:creator>');
    expect(xml).toContain('<media:content url="https://x.kr/a.webp" medium="image" type="image/webp"/>');
    expect(xml).toContain('<image><url>https://x.kr/logo.png</url>');
    expect(xml).toContain('<ttl>60</ttl>');
    expect(xml).toContain('<title>A &amp; B</title>');
  });
});
