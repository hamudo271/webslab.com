// 리뉴얼 정적 페이지용 분석 스니펫 — components/analytics/*와 같은 도구·같은 env 게이팅.
// React 페이지가 아니라 HTML 문자열로 내보내므로 스크립트 태그를 직접 만든다.

import { analytics } from '@/config/analytics';

const js = (s: string) => JSON.stringify(s);

/** <head> 앞쪽에 넣는다. gtag 스텁은 GA 미설정이어도 폼 스크립트가 안전하게 이벤트를 부르도록 항상 둔다. */
export function analyticsHead(): string {
  const parts: string[] = [
    '<script>window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};</script>',
  ];

  if (analytics.gtm.enabled) {
    parts.push(
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${js(analytics.gtm.id)});</script>`,
    );
  }

  if (analytics.ga4.enabled) {
    const id = analytics.ga4.id;
    parts.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}"></script>`,
      `<script>gtag('js',new Date());gtag('config',${js(id)});</script>`,
    );
  }

  if (analytics.naver.enabled) {
    parts.push(
      `<script>window.wcs_add=window.wcs_add||{};wcs_add["wa"]=${js(analytics.naver.id)};</script>`,
      '<script async src="https://wcs.naver.net/wcslog.js" onload="window.wcs&&window.wcs_do&&wcs_do()"></script>',
    );
  }

  if (analytics.clarity.enabled) {
    parts.push(
      `<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${js(analytics.clarity.id)});</script>`,
    );
  }

  if (analytics.metaPixel.enabled) {
    parts.push(
      `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${js(analytics.metaPixel.id)});fbq('track','PageView');</script>`,
    );
  }

  if (analytics.kakaoPixel.enabled) {
    parts.push(
      `<script async src="https://t1.daumcdn.net/kas/static/kp.js" onload="window.kakaoPixel&&kakaoPixel(${js(analytics.kakaoPixel.id).replace(/"/g, '&quot;')}).pageView()"></script>`,
    );
  }

  return parts.join('\n');
}

/** <body> 바로 뒤 (GTM noscript) */
export function analyticsBodyStart(): string {
  if (!analytics.gtm.enabled) return '';
  return `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(analytics.gtm.id)}" height="0" width="0" style="display:none;visibility:hidden" title="gtm"></iframe></noscript>`;
}
