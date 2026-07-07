import { describe, expect, it } from 'vitest';
import { baseSlug, romanizeHangul } from './slug';

describe('romanizeHangul', () => {
  it('완성형 한글을 로마자로 변환한다', () => {
    expect(romanizeHangul('홈페이지').trim()).toBe('hom pe i ji');
  });

  it('한글 외 문자는 그대로 둔다', () => {
    expect(romanizeHangul('SEO 가이드')).toContain('SEO');
  });
});

describe('baseSlug', () => {
  it('한글 제목에서 URL-safe 슬러그를 만든다', () => {
    const slug = baseSlug('기업 홈페이지 제작 비용');
    expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slug.length).toBeGreaterThan(0);
  });

  it('영문·숫자 제목을 정규화한다', () => {
    expect(baseSlug('2026 SEO Guide!')).toBe('2026-seo-guide');
  });

  it('빈 제목은 post로 폴백한다', () => {
    expect(baseSlug('')).toBe('post');
    expect(baseSlug('!!!')).toBe('post');
  });

  it('80자로 자른다', () => {
    expect(baseSlug('가'.repeat(200)).length).toBeLessThanOrEqual(80);
  });
});
