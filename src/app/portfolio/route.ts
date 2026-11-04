// 리뉴얼 정적 페이지 /portfolio — 원본은 src/site/pages, 운영 변환은 src/site/render.ts
import { htmlResponse, sitePageHtml } from '@/site/render';

export const dynamic = 'force-static';

export function GET() {
  return htmlResponse(sitePageHtml('/portfolio'));
}
