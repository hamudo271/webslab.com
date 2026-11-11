import { describe, expect, it } from 'vitest';
import { columnPosts } from '@/data/columnPosts';
import { validateColumnPosts } from './column-validation';

const completePost = {
  slug: 'sample-a',
  primaryKeyword: '샘플 키워드 A',
  body: `<p>${'검증 가능한 본문입니다. '.repeat(100)}</p>`,
  relatedSlugs: ['sample-b', 'sample-c'],
  serviceHref: '/service',
};

describe('validateColumnPosts', () => {
  it('accepts complete posts with unique slugs, keywords, and valid links', () => {
    const posts = [
      completePost,
      {
        ...completePost,
        slug: 'sample-b',
        primaryKeyword: '샘플 키워드 B',
        relatedSlugs: ['sample-a', 'sample-c'],
      },
      {
        ...completePost,
        slug: 'sample-c',
        primaryKeyword: '샘플 키워드 C',
        relatedSlugs: ['sample-a', 'sample-b'],
      },
    ];

    expect(validateColumnPosts(posts)).toEqual([]);
  });

  it('rejects duplicate keywords, placeholder copy, thin bodies, and broken links', () => {
    const posts = [
      completePost,
      {
        ...completePost,
        slug: 'sample-b',
        body: '<p>TODO</p>',
        relatedSlugs: ['missing', 'sample-a'],
      },
    ];

    expect(validateColumnPosts(posts)).toEqual(
      expect.arrayContaining([
        'duplicate keyword: 샘플 키워드 A',
        'thin body: sample-b',
        'placeholder: sample-b',
        'invalid related slug: sample-b:missing',
      ]),
    );
  });
});

describe('published SEO column registry', () => {
  const approvedKeywords = new Map([
    ['corporate-website-cost', '기업 홈페이지 제작 비용'],
    ['website-agency-selection', '기업 홈페이지 제작 업체 선정 기준'],
    ['website-production-timeline', '홈페이지 제작 기간'],
    ['website-quote-comparison', '홈페이지 제작 견적서'],
    ['renewal-vs-rebuild', '신규 제작 리뉴얼 차이'],
    ['website-renewal-cost', '홈페이지 리뉴얼 비용'],
    ['website-renewal-seo', '홈페이지 리뉴얼 SEO'],
    ['b2b-website-structure', 'B2B 홈페이지 구성'],
    ['manufacturing-website-pages', '제조업 홈페이지 제작'],
    ['logistics-multilingual-website', '물류 회사 홈페이지 제작'],
    ['corporate-website-cms', '기업 홈페이지 CMS'],
    ['corporate-website-seo-checklist', '기업 홈페이지 SEO'],
    ['responsive-website', '반응형 홈페이지 제작'],
    ['website-maintenance', '홈페이지 유지보수'],
    ['hospital-website', '병원 홈페이지 제작'],
    ['wordpress-vs-custom', '워드프레스 홈페이지 제작'],
    ['website-renewal-timing', '홈페이지 리뉴얼 시기'],
    ['government-website-accessibility', '공공기관 홈페이지 제작'],
    // 2026-11-11 추가 14편 (columnPosts-2026-11.ts)
    ['website-preparation-checklist', '홈페이지 제작 준비물'],
    ['domain-hosting-ssl-basics', '홈페이지 도메인 호스팅'],
    ['website-contract-checklist', '홈페이지 제작 계약서'],
    ['naver-google-search-registration', '홈페이지 네이버 검색 등록'],
    ['ai-search-aeo-geo-website', 'AI 검색 최적화'],
    ['website-speed-core-web-vitals', '홈페이지 속도 개선'],
    ['inquiry-form-conversion', '홈페이지 문의 전환율'],
    ['website-builder-vs-custom', '홈페이지 빌더 맞춤 제작 비교'],
    ['website-security-basics', '홈페이지 보안'],
    ['website-privacy-policy-form', '홈페이지 개인정보 처리방침'],
    ['landing-page-vs-website', '랜딩페이지 홈페이지 차이'],
    ['business-automation-program', '업무 자동화 프로그램 개발'],
    ['website-agency-handover', '홈페이지 업체 변경'],
    ['ga4-inquiry-tracking', '홈페이지 GA4 설정'],
  ]);

  it('publishes exactly the approved keyword articles', () => {
    expect(columnPosts).toHaveLength(approvedKeywords.size);
    expect(new Map(columnPosts.map((post) => [post.slug, post.primaryKeyword]))).toEqual(
      approvedKeywords,
    );
  });

  it('passes the complete content contract', () => {
    expect(validateColumnPosts(columnPosts)).toEqual([]);
  });
});
