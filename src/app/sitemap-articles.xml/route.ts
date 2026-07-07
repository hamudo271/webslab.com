import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/db';
import { columnPosts } from '@/data/columnPosts';
import { urlsetXml } from '@/lib/xml';

// DB 발행글을 실시간 포함
export const dynamic = 'force-dynamic';

export async function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');

  const staticUrls = columnPosts.map((p) => ({
    loc: `${base}/column/${p.slug}`,
    lastmod: p.modifiedAt,
  }));

  let dbUrls: { loc: string; lastmod: string }[] = [];
  try {
    const rows = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
    dbUrls = rows.map((p) => ({
      loc: `${base}/column/${p.slug}`,
      lastmod: p.updatedAt.toISOString().slice(0, 10),
    }));
  } catch (err) {
    console.error('[sitemap-articles] DB 조회 실패 — 정적 글만 포함', err);
  }

  const xml = urlsetXml([...staticUrls, ...dbUrls]);
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
