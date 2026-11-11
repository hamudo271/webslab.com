import { describe, expect, it } from 'vitest';
import { brand } from '@/config/brand';
import { columnPosts } from '@/data/columnPosts';
import { portfolios } from '@/data/portfolios';
import { htmlToText, llmsFullTxt, llmsTxt } from './llms';

const input = {
  base: 'https://webslab.co.kr',
  brand,
  faqs: [{ question: '홈페이지 제작 기간은 얼마나 걸리나요?', answer: '일반적인 기업 사이트는 약 4~6주입니다.' }],
  posts: columnPosts,
  cases: portfolios,
};

describe('llms.txt', () => {
  const txt = llmsTxt(input);

  it('회사 정보는 brand.ts에서 그대로 나온다', () => {
    expect(txt.startsWith(`# ${brand.nameKo} (${brand.name})`)).toBe(true);
    for (const v of [brand.legal.representativeName, brand.legal.businessNumber, brand.address.streetAddress, brand.email, brand.phone]) {
      expect(txt, v).toContain(v);
    }
  });

  it('문답·칼럼·사례가 모두 실린다', () => {
    expect(txt).toContain('### 홈페이지 제작 기간은 얼마나 걸리나요?');
    for (const p of columnPosts) expect(txt, p.slug).toContain(`/column/${p.slug})`);
    for (const c of portfolios) expect(txt, c.slug).toContain(`/portfolio/${c.slug})`);
  });

  it('HTML 태그가 섞여 나오지 않는다', () => {
    expect(txt).not.toMatch(/<\/?[a-z][^>]*>/i);
  });
});

describe('llms-full.txt', () => {
  const full = llmsFullTxt(input);

  it('칼럼마다 요약·한 줄 답·본문이 실린다', () => {
    for (const p of columnPosts) {
      expect(full, p.slug).toContain(`## ${p.title}`);
      expect(full, p.slug).toContain(`한 줄 답: ${p.directAnswer}`);
    }
    expect(full).not.toMatch(/<\/?(p|h2|h3|ul|li|table|strong|a)\b/i);
  });
});

describe('htmlToText', () => {
  it('제목·목록·표를 글로 풀어 쓴다', () => {
    const t = htmlToText('<h2>비용</h2><p>범위에 따라 <strong>달라집니다</strong>.</p><ul><li>기획</li><li>개발 &amp; 검수</li></ul><table><tr><th>항목</th><th>기준</th></tr></table>');
    expect(t).toContain('### 비용');
    expect(t).toContain('범위에 따라 달라집니다.');
    expect(t).toContain('- 기획');
    expect(t).toContain('- 개발 & 검수');
    expect(t).toContain('항목 | 기준');
  });
});
