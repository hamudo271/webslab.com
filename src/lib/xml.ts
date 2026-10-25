export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  /** 페이지 대표 이미지(절대 URL). Google은 image:loc만 사용한다(title·caption은 2022년 폐기). */
  images?: string[];
};

export function urlsetXml(entries: UrlEntry[]): string {
  const items = entries
    .map((e) => {
      const parts = [
        `<loc>${escapeXml(e.loc)}</loc>`,
        e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : '',
        e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : '',
        typeof e.priority === 'number' ? `<priority>${e.priority.toFixed(1)}</priority>` : '',
        ...(e.images ?? []).map(
          (src) => `<image:image><image:loc>${escapeXml(src)}</image:loc></image:image>`,
        ),
      ]
        .filter(Boolean)
        .join('');
      return `<url>${parts}</url>`;
    })
    .join('');
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
    items +
    `</urlset>`
  );
}

/** YYYY-MM-DD 또는 ISO 문자열 중 가장 최근 값. 비어 있으면 undefined. */
export function latestDate(dates: Array<string | undefined>): string | undefined {
  return dates
    .filter((d): d is string => Boolean(d))
    .map((d) => d.slice(0, 10))
    .sort()
    .at(-1);
}

type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  category?: string;
  /** 작성자 표시명. RSS 2.0의 <author>는 이메일 필수라 dc:creator로 낸다. */
  author?: string;
  /** 대표 이미지 절대 URL — 네이버·피드 리더 썸네일 */
  image?: string;
};

type RssChannel = {
  title: string;
  link: string;
  description: string;
  selfUrl: string;
  items: RssItem[];
  /** 채널 로고(규격상 가로 최대 144px) */
  image?: { url: string; width: number; height: number };
  copyright?: string;
  /** 리더가 다시 가져오기까지 기다릴 분 */
  ttl?: number;
};

function imageMime(url: string): string {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    webp: 'image/webp',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    avif: 'image/avif',
  };
  return (ext && map[ext]) || 'image/jpeg';
}

/** RSS 2.0 — 네이버 수집 채널·피드 리더 대응 */
export function rssXml(ch: RssChannel): string {
  const items = ch.items
    .map((i) =>
      [
        '<item>',
        `<title>${escapeXml(i.title)}</title>`,
        `<link>${escapeXml(i.link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(i.link)}</guid>`,
        `<description>${escapeXml(i.description)}</description>`,
        i.category ? `<category>${escapeXml(i.category)}</category>` : '',
        i.author ? `<dc:creator>${escapeXml(i.author)}</dc:creator>` : '',
        `<pubDate>${i.pubDate.toUTCString()}</pubDate>`,
        i.image
          ? `<media:content url="${escapeXml(i.image)}" medium="image" type="${imageMime(i.image)}"/>` +
            `<media:thumbnail url="${escapeXml(i.image)}"/>`
          : '',
        '</item>',
      ]
        .filter(Boolean)
        .join(''),
    )
    .join('');

  const lastBuild = (ch.items[0]?.pubDate ?? new Date()).toUTCString();

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">` +
    `<channel>` +
    `<title>${escapeXml(ch.title)}</title>` +
    `<link>${escapeXml(ch.link)}</link>` +
    `<description>${escapeXml(ch.description)}</description>` +
    `<language>ko</language>` +
    (ch.copyright ? `<copyright>${escapeXml(ch.copyright)}</copyright>` : '') +
    `<lastBuildDate>${lastBuild}</lastBuildDate>` +
    (ch.ttl ? `<ttl>${ch.ttl}</ttl>` : '') +
    (ch.image
      ? `<image><url>${escapeXml(ch.image.url)}</url><title>${escapeXml(ch.title)}</title>` +
        `<link>${escapeXml(ch.link)}</link><width>${ch.image.width}</width><height>${ch.image.height}</height></image>`
      : '') +
    `<atom:link href="${escapeXml(ch.selfUrl)}" rel="self" type="application/rss+xml"/>` +
    items +
    `</channel></rss>`
  );
}

type SitemapRef = { loc: string; lastmod?: string };

/** 하위 사이트맵마다 lastmod를 달아, 바뀐 사이트맵만 다시 읽게 한다. */
export function sitemapIndexXml(refs: SitemapRef[]): string {
  const items = refs
    .map(
      (r) =>
        `<sitemap><loc>${escapeXml(r.loc)}</loc>${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ''}</sitemap>`,
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}
