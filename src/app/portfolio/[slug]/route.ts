// 리뉴얼 제작사례 상세 — src/site/registry CASE_SLUGS에 등록된 사례만
import { htmlResponse, sitePageHtml } from '@/site/render';
import { notFoundHtml } from '@/site/doc-pages';
import { CASE_SLUGS } from '@/site/registry';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  if (!CASE_SLUGS.includes(params.slug)) return htmlResponse(notFoundHtml(), 404);
  return htmlResponse(sitePageHtml(`/portfolio/${params.slug}`));
}
