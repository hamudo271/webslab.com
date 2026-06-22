import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { portfolios } from '@/data/portfolios';
import { urlsetXml } from '@/lib/xml';
import { buildCaseSitemapEntries } from '@/lib/seo-policy';

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const xml = urlsetXml(
    buildCaseSitemapEntries(portfolios).map((item) => ({
      loc: `${base}${item.path}`,
      lastmod: item.lastmod,
    })),
  );
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
