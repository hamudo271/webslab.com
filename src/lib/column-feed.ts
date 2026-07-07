import type { Post } from '@prisma/client';
import { prisma } from '@/lib/db';
import { makeExcerpt, stripHtml } from '@/lib/posts';
import { columnPosts, type ColumnPost } from '@/data/columnPosts';

// 공개 칼럼 통합 피드 — 정적 12편(리치 AEO 데이터) + DB 발행글을 최신순으로 병합.
// DB 장애 시에도 정적 글은 항상 서빙된다.

export type ColumnListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO(YYYY-MM-DD…)
  readMinutes: number;
  cover: string | null; // DB 글은 썸네일 미설정일 수 있음
  source: 'static' | 'db';
};

function fromStatic(p: ColumnPost): ColumnListItem {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    publishedAt: p.publishedAt,
    readMinutes: p.readMinutes,
    cover: p.cover,
    source: 'static',
  };
}

// 한국어 본문 기준 대략 분당 600자
export function estimateReadMinutes(contentHtml: string): number {
  return Math.max(2, Math.round(stripHtml(contentHtml).length / 600));
}

function fromDb(p: Post): ColumnListItem {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: makeExcerpt(p.excerpt, p.content),
    category: p.category,
    publishedAt: (p.publishedAt ?? p.createdAt).toISOString(),
    readMinutes: estimateReadMinutes(p.content),
    cover: p.thumbnailUrl,
    source: 'db',
  };
}

const staticSlugs = new Set(columnPosts.map((p) => p.slug));

export async function getColumnFeed(): Promise<ColumnListItem[]> {
  let dbItems: ColumnListItem[] = [];
  try {
    const rows = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    });
    // 정적 슬러그와 충돌하는 DB 글은 제외 (상세 페이지는 정적 우선)
    dbItems = rows.filter((p) => !staticSlugs.has(p.slug)).map(fromDb);
  } catch (err) {
    console.error('[column-feed] DB 조회 실패 — 정적 글만 노출', err);
  }
  return [...dbItems, ...columnPosts.map(fromStatic)].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );
}
