import type { Metadata } from 'next';
import { brand } from '@/config/brand';
import { analytics } from '@/config/analytics';
import { siteConfig, absoluteUrl } from '@/config/site';

type BuildMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
};

export function buildMetadata(opts: BuildMetadataOptions = {}): Metadata {
  const path = opts.path ?? '/';
  const url = absoluteUrl(path);
  const title = opts.title ? `${opts.title} | ${brand.name}` : `${brand.name} — ${brand.tagline}`;
  const description = opts.description ?? brand.description;
  const ogImage = opts.ogImage ?? absoluteUrl(siteConfig.defaultOgImage);

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title,
    description,
    alternates: { canonical: url },
    robots: opts.noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: brand.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 675 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    verification: {
      google: analytics.verification.google || undefined,
      other: analytics.verification.naver
        ? { 'naver-site-verification': analytics.verification.naver }
        : undefined,
    },
    authors: [{ name: brand.name }],
    publisher: brand.name,
  };
}
