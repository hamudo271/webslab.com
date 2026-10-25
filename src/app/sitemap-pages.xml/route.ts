import { NextResponse } from 'next/server';
import { urlsetXml } from '@/lib/xml';
import { getPageEntries } from '@/lib/sitemap-data';

// /column lastmod가 DB 최신 발행글을 따라가야 해서 동적
export const dynamic = 'force-dynamic';

export async function GET() {
  const xml = urlsetXml(await getPageEntries());
  return new NextResponse(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
