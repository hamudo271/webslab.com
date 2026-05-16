import { brand } from './brand';

export const siteConfig = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? brand.url,
  defaultOgImage: '/og/default.png',
  locale: 'ko_KR' as const,
};

export function absoluteUrl(path: string): string {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
