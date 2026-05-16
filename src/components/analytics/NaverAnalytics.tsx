'use client';

import Script from 'next/script';
import { analytics } from '@/config/analytics';

export function NaverAnalytics() {
  if (!analytics.naver.enabled) return null;
  const id = analytics.naver.id;
  return (
    <>
      <Script
        id="naver-wcs-loader"
        strategy="afterInteractive"
        src="//wcs.naver.net/wcslog.js"
      />
      <Script id="naver-wcs-init" strategy="afterInteractive">
        {`if(!wcs_add) var wcs_add = {};
wcs_add["wa"] = "${id}";
if(window.wcs){
  wcs_do();
}`}
      </Script>
    </>
  );
}
