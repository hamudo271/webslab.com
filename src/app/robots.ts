import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { crawlerRules } from '@/lib/seo-policy';

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  return {
    rules: [
      ...crawlerRules,
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
