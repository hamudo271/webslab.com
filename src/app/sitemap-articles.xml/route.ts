import { NextResponse } from 'next/server';
import { urlsetXml } from '@/lib/xml';
import { getArticleEntries } from '@/lib/sitemap-data';

// DB 발행글을 실시간 포함
export const dynamic = 'force-dynamic';

export async function GET() {
  const xml = urlsetXml(await getArticleEntries());
  return new NextResponse(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
