import { JsonLd } from './JsonLd';
import { webPageJsonLd } from '@/lib/jsonld';
import { STATIC_PAGE_DATES, STATIC_PAGE_PUBLISHED } from '@/lib/seo-policy';

type Props = {
  path: string;
  name: string;
  description: string;
  /** 자체 날짜를 가진 페이지(포트폴리오 사례 등)는 직접 전달 — 없으면 seo-policy 맵을 조회 */
  dateModified?: string;
  datePublished?: string;
};

// 칼럼이 아닌 일반 페이지의 발행일/수정일 신호.
// 날짜가 관리되지 않는 경로는 지어내지 않고 렌더를 건너뛴다.
export function WebPageJsonLd({ path, name, description, dateModified, datePublished }: Props) {
  const modified = dateModified ?? STATIC_PAGE_DATES[path];
  const published = datePublished ?? STATIC_PAGE_PUBLISHED[path];
  if (!modified) return null;

  return (
    <JsonLd
      id="ld-webpage"
      data={webPageJsonLd({
        path,
        name,
        description,
        datePublished: published,
        dateModified: modified,
      })}
    />
  );
}
