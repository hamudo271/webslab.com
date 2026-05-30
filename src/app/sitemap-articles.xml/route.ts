import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { columnPosts } from '@/data/columnPosts';
import { urlsetXml } from '@/lib/xml';

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const xml = urlsetXml(
    columnPosts.map((p) => ({
      loc: `${base}/column/${p.slug}`,
      lastmod: p.publishedAt,
      changefreq: 'monthly',
      priority: 0.7,
    })),
  );
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
