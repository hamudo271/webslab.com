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

export function sitemapIndexXml(locs: string[]): string {
  const items = locs.map((l) => `<sitemap><loc>${escapeXml(l)}</loc></sitemap>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}
