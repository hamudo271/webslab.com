import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

import { buildMetadata } from '@/lib/metadata';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingBar } from '@/components/layout/FloatingBar';
import { HideOnAdmin } from '@/components/layout/HideOnAdmin';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import { WebSiteJsonLd } from '@/components/seo/WebSiteJsonLd';

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
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        <main>{children}</main>
        <HideOnAdmin>
          <Footer />
          <FloatingBar />
        </HideOnAdmin>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
