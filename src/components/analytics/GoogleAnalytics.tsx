'use client';

import Script from 'next/script';
import { analytics } from '@/config/analytics';

export function GoogleAnalytics() {
  if (!analytics.ga4.enabled) return null;
  const id = analytics.ga4.id;
  return (
    <>
      <Script async strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
