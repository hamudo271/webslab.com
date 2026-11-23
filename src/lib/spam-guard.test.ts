import { beforeEach, describe, expect, it } from 'vitest';
import { clientIp, isSameSiteOrigin, resetRateLimits, spamReason, takeToken } from './spam-guard';

describe('clientIp', () => {
  it('Cloudflare 실제 IP를 먼저 쓴다', () => {
    const h = new Headers({ 'cf-connecting-ip': '1.2.3.4', 'x-forwarded-for': '9.9.9.9, 10.0.0.1' });
    expect(clientIp(h)).toBe('1.2.3.4');
  });
  it('없으면 프록시 체인 첫 IP', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '9.9.9.9, 10.0.0.1' }))).toBe('9.9.9.9');
    expect(clientIp(new Headers())).toBe('unknown');
  });
});

describe('takeToken', () => {
  beforeEach(() => resetRateLimits());
  it('한도까지는 통과, 넘으면 막고, 창이 지나면 다시 연다', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) expect(takeToken('k', 5, 60_000, t0 + i)).toBe(true);
    expect(takeToken('k', 5, 60_000, t0 + 10)).toBe(false);
    expect(takeToken('other', 5, 60_000, t0 + 10)).toBe(true);
    expect(takeToken('k', 5, 60_000, t0 + 60_001)).toBe(true);
  });
});

describe('isSameSiteOrigin', () => {
  it('우리 도메인·www·요청 Host만 허용', () => {
    expect(isSameSiteOrigin('https://webslab.co.kr', 'webslab.co.kr')).toBe(true);
    expect(isSameSiteOrigin('https://www.webslab.co.kr', null)).toBe(true);
    expect(isSameSiteOrigin('http://localhost:3000', 'localhost:3000')).toBe(true);
  });
  it('다른 사이트·Origin 없음·깨진 값은 거절', () => {
    expect(isSameSiteOrigin('https://evil.example', 'webslab.co.kr')).toBe(false);
    expect(isSameSiteOrigin(null, 'webslab.co.kr')).toBe(false);
    expect(isSameSiteOrigin('null', 'webslab.co.kr')).toBe(false);
  });
});

describe('spamReason', () => {
  it('3초 안 제출은 스팸, 시간 정보가 없으면(옛 페이지) 건너뛴다', () => {
    expect(spamReason({ elapsedMs: 800, texts: ['안녕하세요'] })).toMatch(/^too-fast/);
    expect(spamReason({ elapsedMs: 15_000, texts: ['안녕하세요'] })).toBeNull();
    expect(spamReason({ elapsedMs: null, texts: ['안녕하세요'] })).toBeNull();
  });
  it('HTML·BBCode 링크는 스팸', () => {
    expect(spamReason({ texts: ['<a href="https://x.io">buy</a>'] })).toBe('html-link');
    expect(spamReason({ texts: ['[url=https://x.io]buy[/url]'] })).toBe('html-link');
  });
  it('한글 없이 링크만 늘어놓으면 스팸, 한글 문의의 여러 주소는 통과', () => {
    expect(spamReason({ texts: ['SEO service https://a.io https://b.io www.c.io'] })).toMatch(/^links-no-hangul/);
    expect(
      spamReason({ texts: ['아래 페이지 수정 부탁드립니다 https://a.kr/1 https://a.kr/2 https://a.kr/3 https://a.kr/4'] }),
    ).toBeNull();
    expect(spamReason({ texts: ['Hello, we need a website. https://ourcompany.com'] })).toBeNull();
  });
});
