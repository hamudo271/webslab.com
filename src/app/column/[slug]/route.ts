// 칼럼 상세 — 정적 글 우선, 없으면 관리자(DB) 발행글. DB 글은 조회수를 센다.
import { prisma } from '@/lib/db';
import { findPublishedPostBySlug } from '@/lib/posts';
import { columnPosts } from '@/data/columnPosts';
import { htmlResponse } from '@/site/render';
import { articleNotFoundHtml, dbArticleHtml, staticArticleHtml } from '@/site/column-pages';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const post = columnPosts.find((p) => p.slug === slug);
  if (post) return htmlResponse(staticArticleHtml(post));

  const dbPost = await findPublishedPostBySlug(slug).catch((err) => {
    console.error('[column:detail]', err);
    return null;
  });
  if (!dbPost) return htmlResponse(articleNotFoundHtml(), 404);

  // 조회수 카운트 (실패해도 렌더는 계속)
  await prisma.post
    .update({ where: { id: dbPost.id }, data: { viewCount: { increment: 1 } } })
    .catch((err) => console.error('[column:view]', err));

  return htmlResponse(dbArticleHtml(dbPost), 200, 60); // DB 글 수정 반영 지연 ≤ 1분
}
