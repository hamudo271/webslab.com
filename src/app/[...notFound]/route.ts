// 어디에도 맞지 않는 주소 — 리뉴얼 셸 404 (React not-found는 관리자 화면용으로 남는다)
import { htmlResponse } from '@/site/render';
import { notFoundHtml } from '@/site/doc-pages';

// 임의 주소마다 캐시가 쌓이지 않도록 매번 렌더(가벼운 문자열 조립)
export const dynamic = 'force-dynamic';

export function GET() {
  return htmlResponse(notFoundHtml(), 404);
}
