import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { portfolios } from '@/data/portfolios';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/service', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/portfolio', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/column', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/whitepaper', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const dynamicRoutes = portfolios.map((p) => ({
    path: `/portfolio/${p.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticRoutes, ...dynamicRoutes].map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
