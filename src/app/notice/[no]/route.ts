// 공지사항 본문 — data/notices.ts에 있는 번호만
import { htmlResponse } from '@/site/render';
import { notFoundHtml } from '@/site/doc-pages';
import { findNotice, noticePostHtml } from '@/site/notice-pages';
import { notices } from '@/data/notices';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return notices.map((n) => ({ no: String(n.no) }));
}

export function GET(_req: Request, { params }: { params: { no: string } }) {
  const notice = findNotice(params.no);
  if (!notice) return htmlResponse(notFoundHtml(), 404);
  return htmlResponse(noticePostHtml(notice));
}
