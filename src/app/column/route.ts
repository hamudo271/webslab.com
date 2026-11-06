// 전문 칼럼 목록 — 리뉴얼 목록 마크업에 정적 18편 + 관리자 발행글을 채운다
import { getColumnFeed } from '@/lib/column-feed';
import { htmlResponse } from '@/site/render';
import { columnListHtml } from '@/site/column-pages';

// 관리자에서 새 글을 발행하면 10분 안에 목록에 반영 (DB 장애 시 정적 글만)
export const revalidate = 600;

export async function GET() {
  return htmlResponse(columnListHtml(await getColumnFeed()), 200, 60); // 새 글 반영 지연 ≤ 1분
}
