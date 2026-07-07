import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';

import { buildMetadata } from '@/lib/metadata';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingBar } from '@/components/layout/FloatingBar';
import { HideOnAdmin } from '@/components/layout/HideOnAdmin';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import { WebSiteJsonLd } from '@/components/seo/WebSiteJsonLd';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
  preload: true,
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: '#1D74FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
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
