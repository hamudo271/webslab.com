import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

import { buildMetadata } from '@/lib/metadata';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';

// 공개 페이지는 리뉴얼 정적 HTML(라우트 핸들러, src/site)이 담당한다.
// 이 레이아웃은 React로 남은 화면 — 관리자(/admin)와 React not-found·error — 전용.
export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: '#1D74FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white font-pretendard text-text-primary antialiased">
        <main>{children}</main>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
