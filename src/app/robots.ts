import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Claude-Web',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
];

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: '/',
        disallow: ['/api/'],
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
