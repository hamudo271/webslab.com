// 공지사항 목록 — 리뉴얼 원본의 빈 목록 자리에 data/notices.ts 글을 채운다(서버 렌더)
import { htmlResponse } from '@/site/render';
import { noticeListHtml } from '@/site/notice-pages';

export const dynamic = 'force-static';

export function GET() {
  return htmlResponse(noticeListHtml());
}
