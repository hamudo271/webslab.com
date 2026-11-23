// 공지사항 목록·본문 페이지 HTML(head 포함) — 라우트 핸들러가 부른다.

import { brand } from '@/config/brand';
import { breadcrumbJsonLd, itemListJsonLd, webPageJsonLd } from '@/lib/jsonld';
import { notices, type Notice } from '@/data/notices';
import { applyNoticeList, applyNoticePost, noticePath, noticeText, orderNotices } from './notice';
import { getSitePage } from './registry';
import { renderHtml, sitePageHtml } from './render';

export function noticeListHtml(): string {
  return sitePageHtml('/notice', (raw) => applyNoticeList(raw, notices), [
    itemListJsonLd(orderNotices(notices).map((n) => ({ name: n.title, path: noticePath(n) }))),
  ]);
}

export function findNotice(no: string): Notice | undefined {
  return /^\d+$/.test(no) ? notices.find((n) => n.no === Number(no)) : undefined;
}

export function noticePostHtml(n: Notice): string {
  const path = noticePath(n);
  const description = noticeText(n);
  return renderHtml({
    raw: applyNoticePost(getSitePage('/notice').html, n, notices),
    path,
    title: `${n.title} | 공지사항 | ${brand.nameKo}`,
    description,
    publishedTime: n.date,
    modifiedTime: n.date,
    jsonLd: [
      webPageJsonLd({ path, name: n.title, description, datePublished: n.date, dateModified: n.date }),
      breadcrumbJsonLd([
        { name: '홈', path: '/' },
        { name: '공지사항', path: '/notice' },
        { name: n.title, path },
      ]),
    ],
  });
}
