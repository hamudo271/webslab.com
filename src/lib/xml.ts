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
};

export function urlsetXml(entries: UrlEntry[]): string {
  const items = entries
    .map((e) => {
      const parts = [
        `<loc>${escapeXml(e.loc)}</loc>`,
        e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : '',
        e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : '',
        typeof e.priority === 'number' ? `<priority>${e.priority.toFixed(1)}</priority>` : '',
      ]
        .filter(Boolean)
        .join('');
      return `<url>${parts}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}

type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  category?: string;
};

type RssChannel = {
  title: string;
  link: string;
  description: string;
  selfUrl: string;
  items: RssItem[];
};

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
        `<pubDate>${i.pubDate.toUTCString()}</pubDate>`,
        '</item>',
      ]
        .filter(Boolean)
        .join(''),
    )
    .join('');

  const lastBuild = (ch.items[0]?.pubDate ?? new Date()).toUTCString();

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">` +
    `<channel>` +
    `<title>${escapeXml(ch.title)}</title>` +
    `<link>${escapeXml(ch.link)}</link>` +
    `<description>${escapeXml(ch.description)}</description>` +
    `<language>ko</language>` +
    `<lastBuildDate>${lastBuild}</lastBuildDate>` +
    `<atom:link href="${escapeXml(ch.selfUrl)}" rel="self" type="application/rss+xml"/>` +
    items +
    `</channel></rss>`
  );
}

export function sitemapIndexXml(locs: string[]): string {
  const items = locs.map((l) => `<sitemap><loc>${escapeXml(l)}</loc></sitemap>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}
