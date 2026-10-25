import { NextResponse } from 'next/server';
import { urlsetXml } from '@/lib/xml';
import { getCaseEntries } from '@/lib/sitemap-data';

export function GET() {
  const xml = urlsetXml(getCaseEntries());
  return new NextResponse(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
