import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { latestDate, sitemapIndexXml } from '@/lib/xml';
import { getArticleEntries, getCaseEntries, getPageEntries } from '@/lib/sitemap-data';

// 하위 사이트맵별 lastmod를 실제 엔트리 최신일로 계산 — DB 발행글 반영을 위해 동적
export const dynamic = 'force-dynamic';

export async function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const articles = await getArticleEntries();
  const pages = await getPageEntries(articles);
  const cases = getCaseEntries();
  const newest = (entries: { lastmod?: string }[]) => latestDate(entries.map((e) => e.lastmod));

  const xml = sitemapIndexXml([
    { loc: `${base}/sitemap-pages.xml`, lastmod: newest(pages) },
    { loc: `${base}/sitemap-articles.xml`, lastmod: newest(articles) },
    { loc: `${base}/sitemap-cases.xml`, lastmod: newest(cases) },
  ]);
  return new NextResponse(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
