// 리뉴얼 정적 페이지용 분석 스니펫 — components/analytics/*와 같은 도구·같은 env 게이팅.
// React 페이지가 아니라 HTML 문자열로 내보내므로 스크립트 태그를 직접 만든다.

import { analytics } from '@/config/analytics';

const js = (s: string) => JSON.stringify(s);

/** <head> 앞쪽에 넣는다. gtag 스텁은 GA 미설정이어도 폼 스크립트가 안전하게 이벤트를 부르도록 항상 둔다.
 *
 * 분석 스크립트(GA 177KB 등)는 첫 화면과 경쟁하지 않도록 load 뒤 한가할 때 받는다. 스텁(gtag/fbq/clarity 큐)은
 * 즉시 두므로 그 사이에 쌓인 이벤트(폼 제출 등)는 스크립트가 오면 그대로 전송된다. 페이지뷰도 잃지 않는다. */
export function analyticsHead(): string {
  const parts: string[] = [
    '<script>window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};</script>',
  ];
  // load 뒤에 실행할 조각들 — 외부 스크립트 삽입만 미루고, 큐(스텁)는 위에서 바로 만든다
  const deferred: string[] = [];
  const loadScript = (src: string, onload?: string) =>
    `s(${js(src)}${onload ? `,function(){${onload}}` : ''});`;

  if (analytics.gtm.enabled) {
    parts.push(`<script>window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});</script>`);
    deferred.push(loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(analytics.gtm.id)}`));
  }

  if (analytics.ga4.enabled) {
    const id = analytics.ga4.id;
    parts.push(`<script>gtag('js',new Date());gtag('config',${js(id)});</script>`);
    deferred.push(loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`));
  }

  if (analytics.naver.enabled) {
    parts.push(`<script>window.wcs_add=window.wcs_add||{};wcs_add["wa"]=${js(analytics.naver.id)};</script>`);
    deferred.push(loadScript('https://wcs.naver.net/wcslog.js', 'window.wcs&&window.wcs_do&&wcs_do()'));
  }

  if (analytics.clarity.enabled) {
    parts.push(`<script>window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};</script>`);
    deferred.push(loadScript(`https://www.clarity.ms/tag/${encodeURIComponent(analytics.clarity.id)}`));
  }

  if (analytics.metaPixel.enabled) {
    parts.push(
      `<script>!function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);fbq('init',${js(analytics.metaPixel.id)});fbq('track','PageView');</script>`,
    );
    deferred.push(loadScript('https://connect.facebook.net/en_US/fbevents.js'));
  }

  if (analytics.kakaoPixel.enabled) {
    deferred.push(
      loadScript('https://t1.daumcdn.net/kas/static/kp.js', `window.kakaoPixel&&kakaoPixel(${js(analytics.kakaoPixel.id)}).pageView()`),
    );
  }

  if (deferred.length) {
    parts.push(
      `<script>(function(){function s(u,f){var t=document.createElement('script');t.async=true;t.src=u;if(f)t.onload=f;document.head.appendChild(t);}` +
        `function go(){${deferred.join('')}}` +
        `function idle(){if('requestIdleCallback'in window)requestIdleCallback(go,{timeout:3000});else setTimeout(go,1200);}` +
        `if(document.readyState==='complete')idle();else window.addEventListener('load',idle);})();</script>`,
    );
  }

  return parts.join('\n');
}

/** <body> 바로 뒤 (GTM noscript) */
export function analyticsBodyStart(): string {
  if (!analytics.gtm.enabled) return '';
  return `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(analytics.gtm.id)}" height="0" width="0" style="display:none;visibility:hidden" title="gtm"></iframe></noscript>`;
}
