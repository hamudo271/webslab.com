import type { Post, PostStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { baseSlug } from '@/lib/slug';
import { columnPosts } from '@/data/columnPosts';

// ── 본문 HTML 유틸 ──

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// excerpt 미입력 시 본문에서 자동 추출 (목록·메타 설명용)
export function makeExcerpt(excerpt: string | null | undefined, content: string, max = 155): string {
  const source = excerpt?.trim() || stripHtml(content);
  return source.length > max ? `${source.slice(0, max - 1).trimEnd()}…` : source;
}

// ── 슬러그/발행일 ──

// 정적 12편의 슬러그 — DB 글이 같은 URL을 차지하지 못하게 예약
const RESERVED_SLUGS = new Set(columnPosts.map((p) => p.slug));

// DB·정적 통틀어 유일한 슬러그 보장 (충돌 시 -2, -3 …). excludeId: 수정 시 자기 자신 제외
export async function uniqueSlug(desired: string, excludeId: number | null = null): Promise<string> {
  const base = baseSlug(desired);
  let candidate = base;
  let n = 1;
  for (;;) {
    const reserved = RESERVED_SLUGS.has(candidate);
    const found = reserved
      ? null
      : await prisma.post.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!reserved && (!found || found.id === excludeId)) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

// 발행일: 최초 발행 시각을 고정하고, 임시저장으로 되돌려도 유지(재발행 시 원래 날짜)
export function computePublishedAt(
  existing: Pick<Post, 'publishedAt'> | null,
  status: PostStatus,
): Date | null {
  if (status === 'PUBLISHED') return existing?.publishedAt ?? new Date();
  return existing?.publishedAt ?? null;
}

/** 글 저장·삭제 직후 칼럼 목록(ISR 10분)을 바로 다시 만든다. 글 페이지·사이트맵·RSS는 매 요청 DB를 읽는다. */
export function revalidateColumnPages(): void {
  try {
    revalidatePath('/column');
  } catch (err) {
    console.error('[posts:revalidate]', err);
  }
}

// ── 공개 조회 ──

export function findPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({ where: { slug, status: 'PUBLISHED' } });
}
