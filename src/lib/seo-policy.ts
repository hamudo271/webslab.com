export type CrawlerRule = {
  userAgent: string;
  allow: string;
  disallow: string[];
};

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Claude-Web',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
];

export const crawlerRules: CrawlerRule[] = [
  { userAgent: '*', allow: '/', disallow: ['/api/'] },
  ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow: ['/api/'] })),
];

export const COMMERCIAL_METADATA = {
  '/': {
    path: '/',
    keyword: '기업 홈페이지 제작 업체',
    title: '기업 홈페이지 제작 업체 | 기획·디자인·개발·운영',
    description:
      '기업 홈페이지 신규 제작과 리뉴얼을 기획·UI/UX·개발·CMS·운영까지 한 팀에서 책임지는 websLAB의 서비스와 B2B 구축 사례를 확인하세요.',
  },
  '/service': {
    path: '/service',
    keyword: '기업 홈페이지 제작',
    title: '기업 홈페이지 제작·리뉴얼 서비스',
    description:
      '기업 홈페이지 신규 제작과 리뉴얼, SEO 보존 마이그레이션, CMS 구축과 유지보수까지 기획·디자인·개발을 한 팀에서 책임집니다. 무료 상담으로 필요한 범위와 견적을 먼저 확인하세요.',
  },
  '/portfolio': {
    path: '/portfolio',
    keyword: 'B2B 홈페이지 제작 사례',
    title: 'B2B 홈페이지 제작 사례 | 제조·물류·IT·바이오',
    description:
      '제조·물류·IT·바이오 기업의 홈페이지 신규 제작과 리뉴얼 사례를 작업 범위, 기술 구성, 성과 지표와 함께 확인하세요. websLAB이 진행한 B2B 사이트 구축 레퍼런스입니다.',
  },
  '/about': {
    path: '/about',
    keyword: '기업 홈페이지 전문 에이전시',
    title: '기업 홈페이지 전문 에이전시 소개',
    description:
      '기획부터 디자인, 개발, 데이터 이전, CMS 운영까지 직접 수행하는 기업 홈페이지 전문 에이전시 websLAB을 소개합니다. 신규 제작과 리뉴얼 프로젝트를 한 팀에서 책임지고 마무리합니다.',
  },
} as const;

export type GuideLink = { href: string; label: string };

export const CORE_GUIDE_LINKS: Record<string, GuideLink[]> = {
  '/': [
    { href: '/column/corporate-website-cost', label: '기업 홈페이지 제작 비용' },
    { href: '/column/website-agency-selection', label: '홈페이지 제작 업체 선정 기준' },
  ],
  '/service': [
    { href: '/column/corporate-website-cost', label: '기업 홈페이지 제작 비용' },
    { href: '/column/website-renewal-cost', label: '홈페이지 리뉴얼 비용' },
    { href: '/column/website-renewal-seo', label: '리뉴얼 SEO 유지 방법' },
    { href: '/column/corporate-website-cms', label: '기업 홈페이지 CMS 선택 기준' },
  ],
  '/portfolio': [
    { href: '/column/b2b-website-structure', label: 'B2B 홈페이지 필수 구성' },
    { href: '/column/manufacturing-website-pages', label: '제조업 홈페이지 제작 가이드' },
    { href: '/column/logistics-multilingual-website', label: '물류·무역 홈페이지 제작 가이드' },
  ],
  '/about': [
    { href: '/column/website-agency-selection', label: '기업 홈페이지 제작 업체 선정 기준' },
    { href: '/column/website-production-timeline', label: '홈페이지 제작 단계별 일정' },
  ],
};

export const STATIC_PAGE_DATES: Record<string, string> = {
  '/': '2026-06-22',
  '/about': '2026-06-22',
  '/service': '2026-06-22',
  '/portfolio': '2026-06-22',
  '/column': '2026-06-22',
  '/whitepaper': '2026-05-30',
  '/contact': '2026-05-30',
  '/privacy-policy': '2026-05-30',
  '/terms': '2026-05-30',
};

export function buildCaseSitemapEntries(cases: Array<{ slug: string; modifiedAt: string }>) {
  return cases.map((item) => ({
    path: `/portfolio/${item.slug}`,
    lastmod: item.modifiedAt,
  }));
}
