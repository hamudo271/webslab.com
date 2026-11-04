// /terms — 리뉴얼 셸 + 문서 본문(src/site/legal.ts)
import { htmlResponse } from '@/site/render';
import { termsHtml } from '@/site/doc-pages';

export const dynamic = 'force-static';

export function GET() {
  return htmlResponse(termsHtml());
}
