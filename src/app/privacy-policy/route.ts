// /privacy-policy — 리뉴얼 셸 + 문서 본문(src/site/legal.ts)
import { htmlResponse } from '@/site/render';
import { privacyPolicyHtml } from '@/site/doc-pages';

export const dynamic = 'force-static';

export function GET() {
  return htmlResponse(privacyPolicyHtml());
}
