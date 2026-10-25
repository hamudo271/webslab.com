import { NextResponse } from 'next/server';
import { brand } from '@/config/brand';
import { siteConfig } from '@/config/site';
import { getColumnFeed } from '@/lib/column-feed';
import { rssXml } from '@/lib/xml';
import { columnPosts } from '@/data/columnPosts';
import { getAuthor, representative } from '@/data/authors';

// 칼럼 RSS 2.0 — 네이버 수집 채널 및 피드 리더용.
// DB 발행글을 실시간 반영(getColumnFeed가 DB 장애 시 정적 글로 폴백).
export const dynamic = 'force-dynamic';

const MAX_ITEMS = 30;

// DB 글에는 작성자 필드가 없어 사이트 대표 작성자로 통일한다
const authorBySlug = new Map(columnPosts.map((p) => [p.slug, getAuthor(p.authorId).name]));

export async function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');

  try {
    const posts = (await getColumnFeed()).slice(0, MAX_ITEMS);

    const xml = rssXml({
      title: `${brand.name} 전문 칼럼`,
      link: `${base}/column`,
      description: '기업 홈페이지 제작·리뉴얼 실무에서 정리한 가이드 칼럼.',
      selfUrl: `${base}/rss.xml`,
      image: { url: `${base}/images/rss-logo.png`, width: 144, height: 30 },
      copyright: `© ${brand.name}`,
      ttl: 60,
      items: posts.map((p) => ({
        title: p.title,
        link: `${base}/column/${p.slug}`,
        description: p.excerpt,
        category: p.category,
        pubDate: new Date(p.publishedAt),
        author: authorBySlug.get(p.slug) ?? representative.name,
        image: p.cover ? (/^https?:\/\//.test(p.cover) ? p.cover : `${base}${p.cover}`) : undefined,
      })),
    });

    return new NextResponse(xml, {
      headers: {
        'content-type': 'application/rss+xml; charset=utf-8',
        'cache-control': 'public, max-age=600, s-maxage=600',
      },
    });
  } catch (err) {
    console.error('[rss]', err);
    return new NextResponse('피드를 생성하지 못했습니다.', { status: 500 });
  }
}
