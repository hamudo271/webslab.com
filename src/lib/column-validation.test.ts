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
  ]);

  it('publishes exactly the 12 approved keyword articles', () => {
    expect(columnPosts).toHaveLength(12);
    expect(new Map(columnPosts.map((post) => [post.slug, post.primaryKeyword]))).toEqual(
      approvedKeywords,
    );
  });

  it('passes the complete content contract', () => {
    expect(validateColumnPosts(columnPosts)).toEqual([]);
  });
});
