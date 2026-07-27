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
  /** 글 발행일(ISO). 지정하면 og:type=article + article:published_time 출력 */
  publishedTime?: string;
  /** 글 수정일(ISO). 미지정 시 발행일과 동일하게 본다 */
  modifiedTime?: string;
};

export function buildMetadata(opts: BuildMetadataOptions = {}): Metadata {
  const path = opts.path ?? '/';
  const url = absoluteUrl(path);
  const title = opts.title ? `${opts.title} | ${brand.name}` : `${brand.name} — ${brand.tagline}`;
  const description = opts.description ?? brand.description;
  const ogImage = opts.ogImage ?? absoluteUrl(siteConfig.defaultOgImage);

  // 발행일이 있으면 article로 승격 — 검색엔진이 문서 신선도를 읽는 표준 신호
  const openGraphType: Metadata['openGraph'] = opts.publishedTime
    ? {
        type: 'article',
        publishedTime: opts.publishedTime,
        modifiedTime: opts.modifiedTime ?? opts.publishedTime,
        authors: [brand.name],
      }
    : { type: 'website' };

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title,
    description,
    alternates: {
      canonical: url,
      // 피드 리더·네이버 수집 채널이 찾는 표준 자동 발견 경로
      types: { 'application/rss+xml': [{ url: absoluteUrl('/rss.xml'), title: `${brand.name} 전문 칼럼` }] },
    },
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
      ...openGraphType,
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
