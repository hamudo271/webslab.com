import { siteConfig } from '@/config/site';
import { prisma } from '@/lib/db';
import { latestDate } from '@/lib/xml';
import { buildCaseSitemapEntries, CASE_PAGE_DATES, STATIC_PAGE_DATES } from '@/lib/seo-policy';
import { pageImages } from '@/lib/site-html';
import { SITE_PAGES } from '@/site/registry';
import { columnPosts } from '@/data/columnPosts';
import { portfolios } from '@/data/portfolios';
import { notices } from '@/data/notices';

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
    return { loc: `${base()}${item.path}`, lastmod: latestDate([item.lastmod, CASE_PAGE_DATES[item.path]]), images };
  });
}

/**
 * 정적 페이지 + 공지사항 글. 목록 페이지(/column, /portfolio, /notice)는 하위 글이 갱신되면 목록도 바뀌므로
 * 수동 날짜와 하위 항목 최신일 중 늦은 쪽을 쓴다.
 */
export async function getPageEntries(articles?: SitemapEntry[]): Promise<SitemapEntry[]> {
  const articleLatest = latestDate((articles ?? (await getArticleEntries())).map((e) => e.lastmod));
  const caseLatest = latestDate(portfolios.map((p) => p.modifiedAt));
  const derived: Record<string, string | undefined> = {
    '/column': articleLatest,
    '/portfolio': caseLatest,
    '/notice': latestDate(notices.map((n) => n.date)),
  };
  const pages = Object.entries(STATIC_PAGE_DATES).map(([path, date]) => {
    const images = imagesOf(path);
    return {
      loc: `${base()}${path}`,
      lastmod: latestDate([date, derived[path]]),
      ...(images.length ? { images } : {}),
    };
  });
  return [...pages, ...getNoticeEntries()];
}

/** 공지사항 글(/notice/<번호>) — 새 글부터 */
export function getNoticeEntries(): SitemapEntry[] {
  return [...notices]
    .sort((a, b) => b.no - a.no)
    .map((n) => ({ loc: `${base()}/notice/${n.no}`, lastmod: n.date }));
}

/** 리뉴얼 페이지 본문의 사진(절대 URL). 약관 등 리뉴얼 밖 문서 페이지는 없다. */
function imagesOf(path: string): string[] {
  const page = SITE_PAGES.find((p) => p.path === path);
  return page ? pageImages(page.html).map(abs) : [];
}
