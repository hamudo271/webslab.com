// 문의 폼·관리자 로그인 기본 스팸 방어 (순수 함수 + 메모리 카운터).
//  - 같은 IP 연속 요청 제한(rate limit) — 운영은 Railway 인스턴스 1대라 메모리 카운터로 충분하다.
//    인스턴스를 늘리면 IP마다 한도가 인스턴스 수만큼 늘어나니 그때는 DB·Redis로 옮길 것.
//  - 다른 사이트에서 보낸 요청(Origin 불일치) 거절
//  - 페이지를 열자마자 제출(사람은 3초 안에 폼을 못 채운다)·링크 도배 본문은 조용히 버린다

import { siteConfig } from '@/config/site';

/** Cloudflare가 넘겨주는 실제 방문자 IP → 프록시 체인 첫 IP → 'unknown' */
export function clientIp(headers: Headers): string {
  const cf = headers.get('cf-connecting-ip')?.trim();
  if (cf) return cf;
  const xff = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return xff || 'unknown';
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * 고정 창(window) 방식 요청 제한. 한도 안이면 true, 넘으면 false.
 * now는 테스트용 주입.
 */
export function takeToken(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  if (buckets.size > 5000) {
    buckets.forEach((b, k) => {
      if (b.resetAt <= now) buckets.delete(k);
    });
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

/** 테스트용 — 카운터 비우기 */
export function resetRateLimits(): void {
  buckets.clear();
}

export const LIMITS = {
  /** 문의 폼: IP당 10분에 5건 */
  contact: { limit: 5, windowMs: 10 * 60 * 1000 },
  /** 관리자 로그인: IP당 15분에 10번 */
  adminLogin: { limit: 10, windowMs: 15 * 60 * 1000 },
} as const;

/**
 * 브라우저가 보낸 POST의 Origin이 우리 사이트인지.
 * Origin이 없으면(curl 같은 스크립트) 거절 — 요즘 브라우저는 같은 사이트 POST에도 Origin을 붙인다.
 * 요청 Host와 같으면 허용(로컬 개발·Railway 기본 주소).
 */
export function isSameSiteOrigin(origin: string | null, requestHost: string | null): boolean {
  if (!origin) return false;
  let host: string;
  try {
    host = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }
  const site = new URL(siteConfig.baseUrl).host.toLowerCase();
  const allowed = new Set([site, `www.${site}`]);
  if (requestHost) allowed.add(requestHost.toLowerCase());
  return allowed.has(host);
}

/** 사람이 폼을 채우는 데 걸리는 최소 시간 */
export const MIN_FILL_MS = 3000;

const URL_RE = /https?:\/\/|www\./gi;

/**
 * 조용히 버릴 스팸인지 — 이유 문자열(로그용) 또는 null.
 * elapsed: 페이지를 연 뒤 제출까지 ms(ws-forms.js가 보냄). 없으면(캐시된 옛 페이지) 시간 검사는 건너뛴다.
 */
export function spamReason(input: { elapsedMs?: number | null; texts: string[] }): string | null {
  const { elapsedMs, texts } = input;
  if (typeof elapsedMs === 'number' && Number.isFinite(elapsedMs) && elapsedMs < MIN_FILL_MS) {
    return `too-fast:${Math.round(elapsedMs)}ms`;
  }
  const body = texts.join('\n');
  if (/<a\s+href|\[url[=\]]/i.test(body)) return 'html-link';
  // 링크가 많아도 한글 문의면 통과 — 유지보수 신청은 고칠 페이지 주소를 여러 개 적기도 한다.
  // 한글 한 글자 없이 링크만 늘어놓은 글이 전형적인 광고 스팸이다.
  const links = body.match(URL_RE)?.length ?? 0;
  if (links >= 3 && !/[가-힣]/.test(body)) return `links-no-hangul:${links}`;
  return null;
}
