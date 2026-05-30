import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { urlsetXml } from '@/lib/xml';

const STATIC_PATHS: { path: string; priority: number; changefreq: string }[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/service', priority: 0.9, changefreq: 'monthly' },
  { path: '/column', priority: 0.7, changefreq: 'weekly' },
  { path: '/whitepaper', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
];

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const xml = urlsetXml(
    STATIC_PATHS.map((r) => ({
      loc: `${base}${r.path}`,
      lastmod: today,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
  );
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
