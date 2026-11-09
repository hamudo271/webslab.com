import { describe, expect, it } from 'vitest';
import { API_KEY_MIN_LENGTH, verifyApiKey } from './admin-auth';
import { postInputSchema } from './validators/post';

const KEY = 'k'.repeat(API_KEY_MIN_LENGTH);

describe('verifyApiKey (글 올리기 전용 키)', () => {
  it('맞는 Bearer 키만 통과', () => {
    expect(verifyApiKey(`Bearer ${KEY}`, KEY)).toBe(true);
    expect(verifyApiKey(`bearer ${KEY}`, KEY)).toBe(true);
    expect(verifyApiKey(`Bearer ${KEY}x`, KEY)).toBe(false);
    expect(verifyApiKey(`Bearer ${'j'.repeat(API_KEY_MIN_LENGTH)}`, KEY)).toBe(false);
    expect(verifyApiKey(KEY, KEY)).toBe(false); // Bearer 없음
    expect(verifyApiKey(null, KEY)).toBe(false);
  });

  it('키가 설정 안 됐거나 짧으면 항상 거부', () => {
    expect(verifyApiKey('Bearer ', '')).toBe(false);
    expect(verifyApiKey('Bearer abc', undefined)).toBe(false);
    expect(verifyApiKey('Bearer short', 'short')).toBe(false);
  });
});

describe('postInputSchema 카테고리', () => {
  const base = { title: '제목', content: '<p>본문</p>', status: 'PUBLISHED' as const };

  it('정해진 이름은 받는다', () => {
    for (const category of ['리뉴얼', '비용·견적', 'B2B 전략']) {
      expect(postInputSchema.safeParse({ ...base, category }).success).toBe(true);
    }
  });

  it('없는 이름은 허용 목록을 담아 거부', () => {
    const r = postInputSchema.safeParse({ ...base, category: '비용/견적' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toContain('비용·견적');
  });
});
