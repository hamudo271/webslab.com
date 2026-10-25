import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/db';
import { latestDate } from '@/lib/xml';
import { buildCaseSitemapEntries, STATIC_PAGE_DATES } from '@/lib/seo-policy';
import { columnPosts } from '@/data/columnPosts';
import { portfolios } from '@/data/portfolios';

// 사이트맵 엔트리 단일 소스 — 하위 사이트맵 3종과 인덱스(lastmod 계산)가 함께 쓴다.

export type SitemapEntry = { loc: string; lastmod?: string; images?: string[] };

const base = () => siteConfig.baseUrl.replace(/\/$/, '');
const abs = (src: string) => (/^https?:\/\//.test(src) ? src : `${base()}${src}`);

const staticSlugs = new Set(columnPosts.map((p) => p.slug));

/** DB 발행글. 정적 슬러그와 겹치는 글은 상세 페이지가 정적 우선이라 제외(column-feed와 동일 규칙). */
async function publishedDbPosts() {
  try {
    const rows = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true, thumbnailUrl: true },
      orderBy: { publishedAt: 'desc' },
    });
    return rows.filter((r) => !staticSlugs.has(r.slug));
  } catch (err) {
    console.error('[sitemap] DB 조회 실패 — 정적 글만 포함', err);
    return [];
  }
}

export async function getArticleEntries(): Promise<SitemapEntry[]> {
  const staticEntries = columnPosts.map((p) => ({
    loc: `${base()}/column/${p.slug}`,
    lastmod: p.modifiedAt,
    images: p.cover ? [abs(p.cover)] : undefined,
  }));
  const dbEntries = (await publishedDbPosts()).map((p) => ({
    loc: `${base()}/column/${p.slug}`,
    lastmod: p.updatedAt.toISOString().slice(0, 10),
    images: p.thumbnailUrl ? [abs(p.thumbnailUrl)] : undefined,
  }));
  return [...dbEntries, ...staticEntries];
}

export function getCaseEntries(): SitemapEntry[] {
  const bySlug = new Map(portfolios.map((p) => [p.slug, p]));
  return buildCaseSitemapEntries(portfolios).map((item) => {
    const p = bySlug.get(item.path.replace('/portfolio/', ''));
    const images = [p?.cover, p?.fullShot].filter((s): s is string => Boolean(s)).map(abs);
    return { loc: `${base()}${item.path}`, lastmod: item.lastmod, images };
  });
}

/**
 * 정적 페이지. 목록 페이지(/column, /portfolio)는 하위 글이 갱신되면 목록도 바뀌므로
 * 수동 날짜와 하위 항목 최신일 중 늦은 쪽을 쓴다.
 */
export async function getPageEntries(articles?: SitemapEntry[]): Promise<SitemapEntry[]> {
  const articleLatest = latestDate((articles ?? (await getArticleEntries())).map((e) => e.lastmod));
  const caseLatest = latestDate(portfolios.map((p) => p.modifiedAt));
  const derived: Record<string, string | undefined> = {
    '/column': articleLatest,
    '/portfolio': caseLatest,
  };
  return Object.entries(STATIC_PAGE_DATES).map(([path, date]) => ({
    loc: `${base()}${path}`,
    lastmod: latestDate([date, derived[path]]),
  }));
}
