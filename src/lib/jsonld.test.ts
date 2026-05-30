import { describe, it, expect } from 'vitest';
import { personJsonLd, articleJsonLd, faqPageJsonLd, howToJsonLd, serviceJsonLd } from './jsonld';
import type { Author } from '@/data/authors';
import { representative } from '@/data/authors';

const sample: Author = {
  id: 'representative',
  name: '홍길동',
  nameKo: '홍길동',
  role: '대표',
  bio: '15년차 웹 에이전시 대표',
  profileUrl: 'https://webslab.co.kr/about',
  sameAs: ['https://linkedin.com/in/example'],
};

describe('personJsonLd', () => {
  it('returns a valid Person schema', () => {
    const ld = personJsonLd(sample);
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('Person');
    expect(ld.name).toBe('홍길동');
    expect(ld.jobTitle).toBe('대표');
    expect(ld.url).toBe('https://webslab.co.kr/about');
    expect(ld.sameAs).toEqual(['https://linkedin.com/in/example']);
  });
});

describe('articleJsonLd', () => {
  it('returns Article schema with author + datePublished', () => {
    const ld = articleJsonLd({
      headline: '리뉴얼 시기 판단 7가지 신호',
      description: '...',
      slug: 'renewal-timing-signals',
      datePublished: '2026-06-01',
      dateModified: '2026-06-01',
      image: 'https://webslab.co.kr/og/article.png',
      author: representative,
    });
    expect(ld['@type']).toBe('Article');
    expect(ld.headline).toBe('리뉴얼 시기 판단 7가지 신호');
    expect(ld.author).toMatchObject({ '@type': 'Person', name: '대표자' });
    expect(ld.publisher).toMatchObject({ '@type': 'Organization', name: 'websLAB' });
    expect(ld.mainEntityOfPage).toBe('https://webslab.co.kr/column/renewal-timing-signals');
  });
});

describe('faqPageJsonLd', () => {
  it('returns FAQPage schema from Q-A list', () => {
    const ld = faqPageJsonLd([
      { question: '리뉴얼 시기는 언제가 좋을까요?', answer: '평균 3~5년 주기를 권장합니다.' },
      { question: '비용은 얼마인가요?', answer: '규모별 3,000만~1억원 범위입니다.' },
    ]);
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: '리뉴얼 시기는 언제가 좋을까요?',
      acceptedAnswer: { '@type': 'Answer', text: '평균 3~5년 주기를 권장합니다.' },
    });
  });
});

describe('howToJsonLd', () => {
  it('returns HowTo schema with steps', () => {
    const ld = howToJsonLd({
      name: 'URL 마이그레이션 5단계',
      description: '...',
      steps: [
        { name: '기존 URL 목록 추출', text: 'sitemap.xml에서 모든 URL을 추출' },
        { name: '301 매핑', text: '구 URL을 신 URL로 매핑' },
      ],
    });
    expect(ld['@type']).toBe('HowTo');
    expect(ld.step).toHaveLength(2);
    expect(ld.step[0]).toMatchObject({ '@type': 'HowToStep', name: '기존 URL 목록 추출' });
  });
});

describe('serviceJsonLd', () => {
  it('returns Service schema for 홈페이지 리뉴얼', () => {
    const ld = serviceJsonLd({
      name: '기업 홈페이지 리뉴얼',
      description: '5년 이상 노후 사이트의 리뉴얼을 전담합니다.',
      serviceType: '웹사이트 리뉴얼',
      areaServed: 'KR',
    });
    expect(ld['@type']).toBe('Service');
    expect(ld.provider).toMatchObject({ '@type': 'Organization', name: 'websLAB' });
    expect(ld.areaServed).toBe('KR');
  });
});
