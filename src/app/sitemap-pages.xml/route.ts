import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { urlsetXml } from '@/lib/xml';
import { STATIC_PAGE_DATES } from '@/lib/seo-policy';

const STATIC_PATHS = Object.keys(STATIC_PAGE_DATES);

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const xml = urlsetXml(
    STATIC_PATHS.map((path) => ({
      loc: `${base}${path}`,
      lastmod: STATIC_PAGE_DATES[path],
    })),
  );
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
