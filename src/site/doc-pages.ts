// 약관·404 — 리뉴얼 셸을 빌려 쓰는 문서형 페이지

import { brand } from '@/config/brand';
import { STATIC_PAGE_DATES, STATIC_PAGE_PUBLISHED } from '@/lib/seo-policy';
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/jsonld';
import { privacyPolicyMain, termsMain } from './legal';
import { shellHtml } from './render';

function legalPage(path: string, name: string, description: string, main: string): string {
  return shellHtml({
    path,
    title: `${name} | ${brand.nameKo}`,
    description,
    mainClass: 'ws-legal',
    main,
    jsonLd: [
      webPageJsonLd({
        path,
        name,
        description,
        datePublished: STATIC_PAGE_PUBLISHED[path],
        dateModified: STATIC_PAGE_DATES[path],
      }),
      breadcrumbJsonLd([
        { name: '홈', path: '/' },
        { name, path },
      ]),
    ],
  });
}

export const privacyPolicyHtml = () =>
  legalPage('/privacy-policy', '개인정보 처리방침', '웹스랩의 개인정보 수집·이용·보관 정책.', privacyPolicyMain());

export const termsHtml = () =>
  legalPage('/terms', '이용약관', '웹스랩 웹사이트 및 서비스 이용약관.', termsMain());

export function notFoundHtml(): string {
  return shellHtml({
    path: '/',
    title: `페이지를 찾을 수 없어요 | ${brand.nameKo}`,
    description: '요청하신 페이지를 찾을 수 없습니다.',
    mainClass: 'ws-not-found',
    noindex: true,
    jsonLd: [],
    main: `<section class="ws-doc ws-doc--center">
<div class="ws-doc__inner">
<p class="ws-doc__label">404</p>
<h1 class="ws-doc__title">페이지를 찾을 수 없어요</h1>
<p class="ws-doc__lead">주소가 바뀌었거나 더 이상 없는 페이지예요.</p>
<p class="ws-doc__actions"><a class="ws-btn ws-btn--primary" href="/">홈으로</a><a class="ws-btn" href="/contact">문의하기</a></p>
</div>
</section>`,
  });
}
