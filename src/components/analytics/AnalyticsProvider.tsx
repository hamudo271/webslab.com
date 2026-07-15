'use client';

import { usePathname } from 'next/navigation';

import { GoogleTagManager } from './GoogleTagManager';
import { GoogleAnalytics } from './GoogleAnalytics';
import { NaverAnalytics } from './NaverAnalytics';
import { MicrosoftClarity } from './MicrosoftClarity';
import { MetaPixel } from './MetaPixel';
import { KakaoPixel } from './KakaoPixel';
import { Hotjar } from './Hotjar';
import { ChannelIO } from './ChannelIO';
import { Mixpanel } from './Mixpanel';

export function AnalyticsProvider() {
  // 관리자 영역(/admin)은 추적 제외 — 내부 사용이 방문자·인기 페이지 통계를 오염시킴
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <GoogleTagManager />
      <GoogleAnalytics />
      <NaverAnalytics />
      <MicrosoftClarity />
      <MetaPixel />
      <KakaoPixel />
      <Hotjar />
      <Mixpanel />
      <ChannelIO />
    </>
  );
}
