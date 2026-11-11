// IndexNow — 글을 발행·수정하면 검색엔진(네이버·Bing 등 참여 엔진)에 바뀐 주소를 바로 알린다.
// 키는 비밀이 아니다: 사이트 주인임을 보이려고 public/<키>.txt 로 공개해 두는 값(파일 이름·내용이 키와 같아야 함).
// 구글은 IndexNow를 받지 않는다 — 구글은 사이트맵 lastmod로 알린다.

import { siteConfig } from '@/config/site';

export const INDEXNOW_KEY = '9a14c5a1d543402560cfe351c106ad96';

const ENDPOINTS = ['https://api.indexnow.org/indexnow', 'https://searchadvisor.naver.com/indexnow'];

export function indexNowPayload(paths: string[], base = siteConfig.baseUrl.replace(/\/$/, '')) {
  const host = new URL(base).host;
  return {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${base}/${INDEXNOW_KEY}.txt`,
    urlList: Array.from(new Set(paths)).map((p) => `${base}${p}`),
  };
}

/** 실패해도 저장 흐름을 막지 않는다(응답을 기다리지 않고, 오류는 로그만). 운영 서버에서만 보낸다. */
export function pingIndexNow(paths: string[]): void {
  if (process.env.NODE_ENV !== 'production' || !paths.length) return;
  const body = JSON.stringify(indexNowPayload(paths));
  for (const url of ENDPOINTS) {
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body,
      signal: AbortSignal.timeout(5000),
    })
      .then((res) => {
        if (!res.ok) console.error('[indexnow]', url, res.status);
      })
      .catch((err) => console.error('[indexnow]', url, err instanceof Error ? err.message : err));
  }
}
