'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { analytics } from '@/config/analytics';

declare global {
  interface Window {
    kakaoPixel?: (id: string) => { pageView: (tag?: string) => void };
  }
}

export function KakaoPixel() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  // SPA 라우트 전환 시 pageView 재발행(초기 1회는 로더 onLoad에서 전송)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (analytics.kakaoPixel.enabled && typeof window.kakaoPixel === 'function') {
      window.kakaoPixel(analytics.kakaoPixel.id).pageView();
    }
  }, [pathname]);

  if (!analytics.kakaoPixel.enabled) return null;
  const id = analytics.kakaoPixel.id;

  return (
    <Script
      id="kakao-pixel"
      src="https://t1.daumcdn.net/kas/static/kp.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window.kakaoPixel === 'function') {
          window.kakaoPixel(id).pageView();
        }
      }}
    />
  );
}
