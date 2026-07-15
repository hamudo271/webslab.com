'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { analytics } from '@/config/analytics';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function MetaPixel() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  // SPA 라우트 전환 시 PageView 재발행(초기 1회는 init 스크립트가 전송)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (analytics.metaPixel.enabled && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  if (!analytics.metaPixel.enabled) return null;
  const id = analytics.metaPixel.id;

  return (
    <Script id="meta-pixel-init" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');`}
    </Script>
  );
}
