import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { portfolios } from '@/data/portfolios';
import { urlsetXml } from '@/lib/xml';

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const xml = urlsetXml(
    portfolios.map((p) => ({
      loc: `${base}/portfolio/${p.slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
    })),
  );
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
