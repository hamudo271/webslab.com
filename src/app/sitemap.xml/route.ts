import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { sitemapIndexXml } from '@/lib/xml';

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const xml = sitemapIndexXml([
    `${base}/sitemap-pages.xml`,
    `${base}/sitemap-articles.xml`,
    `${base}/sitemap-cases.xml`,
  ]);
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
