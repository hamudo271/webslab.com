import { describe, it, expect } from 'vitest';
import { personJsonLd } from './jsonld';
import type { Author } from '@/data/authors';

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
