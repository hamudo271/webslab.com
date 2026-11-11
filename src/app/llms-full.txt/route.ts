import { siteConfig } from '@/config/site';
import { brand } from '@/config/brand';
import { llmsFullTxt } from '@/lib/llms';
import { extractFaqs } from '@/lib/site-html';
import { getSitePage } from '@/site/registry';
import { columnPosts } from '@/data/columnPosts';
import { portfolios } from '@/data/portfolios';

// AI 검색용 칼럼 전문 — 본문은 lib/llms.ts
export function GET() {
  const text = llmsFullTxt({
    base: siteConfig.baseUrl.replace(/\/$/, ''),
    brand,
    faqs: extractFaqs(getSitePage('/faq').html),
    posts: columnPosts,
    cases: portfolios,
  });
  return new Response(text, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=600, s-maxage=600' },
  });
}
