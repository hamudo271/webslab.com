import pageDates from '@/site/page-dates.json';

export type CrawlerRule = {
  userAgent: string;
  allow?: string;
  disallow: string[];
};

// AI search / answer engines — ALLOWED so our content can surface and be cited
// in AI search results (ChatGPT search, Perplexity, Claude, etc.).
// (Claude-Web은 Cloudflare 관리 규칙이 막는 옛 이름이라 허용 목록에서 뺐다 — 2026-11-06 두 robots가 서로 모순됐다.
//  Anthropic 검색·사용자 요청 크롤러는 Claude-SearchBot·Claude-User)
const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-SearchBot', 'Claude-User'];

// AI 학습용 크롤러 — 차단(콘텐츠를 모델 학습에 쓰지 않게).
// Cloudflare의 Training 정책은 묶음 전체를 한 번에 켜고 끄는 설정뿐이라, 그쪽을 Allow로 바꿔도
// 학습봇 차단이 유지되도록 Cloudflare 관리 목록의 학습봇을 여기에도 직접 적는다.
// Google-Extended는 일부러 뺐다(2026-11-11): 이 토큰을 막으면 Gemini가 답변에 사이트 내용을 쓰는 것도 막힌다.
// 구글 검색·AI 개요는 Googlebot이 맡아 이 토큰과 무관하다. Cloudflare Training이 Disallow인 동안은
// Cloudflare 쪽 robots가 여전히 Google-Extended를 막는다(서로 모순은 아님 — 여기서는 언급하지 않을 뿐).
const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'meta-externalagent',
  'cohere-ai',
  'Diffbot',
  'omgili',
  'MistralAI-Training',
  'PetalBot',
  'Google-CloudVertexBot',
];

export const crawlerRules: CrawlerRule[] = [
  { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
  ...AI_SEARCH_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow: ['/api/', '/admin/'] })),
  ...AI_TRAINING_BOTS.map((userAgent) => ({ userAgent, disallow: ['/'] })),
];

export const COMMERCIAL_METADATA = {
  '/': {
    path: '/',
    keyword: '기업 홈페이지 제작 업체',
    title: '기업 홈페이지 제작 업체 | 기획·디자인·개발·운영',
    description:
      '5년 넘은 디자인, 모바일에서 깨지는 화면, 직접 고칠 수 없는 구조. 기업 홈페이지 신규 제작과 리뉴얼을 기획·UI/UX·개발·CMS·운영까지 한 팀이 맡습니다. 계약 전 메인 시안을 먼저 확인하세요.',
  },
  '/service': {
    path: '/service',
    keyword: '기업 홈페이지 제작',
    title: '기업 홈페이지 제작·리뉴얼 서비스',
    description:
      '신규 제작과 리뉴얼 중 무엇이 맞는지부터 정리해 드립니다. 기업 홈페이지 제작, SEO 보존 마이그레이션, CMS 구축과 유지보수까지 한 팀이 맡습니다. 예산 구간만 알려주시면 가능한 범위를 1영업일 안에 회신드립니다.',
  },
  '/portfolio': {
    path: '/portfolio',
    keyword: '홈페이지 제작 사례',
    title: '홈페이지 제작 사례 포트폴리오',
    // 실제 사례의 업종만 적는다(악기 브랜드·의원·협회·마케팅·영상·디자인) — 없는 업종·성과 지표를 쓰지 않는다.
    description:
      '악기 브랜드, 피부과 의원, 협회, 마케팅·영상·디자인 회사까지 웹스랩이 만든 홈페이지 제작 사례를 모았습니다. 사례마다 작업 범위와 화면 구성, 지금 운영 중인 실제 사이트를 확인할 수 있습니다.',
  },
  '/about': {
    path: '/about',
    keyword: '기업 홈페이지 전문 에이전시',
    title: '기업 홈페이지 전문 에이전시 소개',
    description:
      '기획부터 디자인, 개발, 데이터 이전, CMS 운영까지 직접 수행하는 기업 홈페이지 전문 에이전시 웹스랩(websLAB)을 소개합니다. 대구에 사무실을 두고 전국 기업의 신규 제작과 리뉴얼을 한 팀에서 책임지고 마무리합니다.',
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

// 페이지 수정일(사이트맵 lastmod · WebPage dateModified).
// 리뉴얼 페이지는 pnpm sync:renewal이 본문 글자·이미지 지문으로 자동 관리한다(src/site/page-dates.json —
// 본문이 바뀐 동기화 날만 올라가고 스타일만 바꾼 날은 그대로). 손으로 적는 건 리뉴얼 밖 문서 페이지뿐.
// /column·/portfolio는 sitemap-data에서 하위 글·케이스 최신일과 비교해 늦은 쪽을 쓴다.
const MANUAL_PAGE_DATES: Record<string, string> = {
  '/privacy-policy': '2026-11-05', // 채용 지원 수집 항목·보유 기간 추가
  '/terms': '2026-06-25',
};
const SYNCED_PAGE_DATES: Record<string, string> = Object.fromEntries(
  Object.entries(pageDates as Record<string, { modified: string }>).map(([path, v]) => [path, v.modified]),
);
/** 사이트맵 pages에 올리는 경로(사례 상세는 sitemap-cases가 따로 다룬다) */
export const STATIC_PAGE_DATES: Record<string, string> = {
  ...Object.fromEntries(Object.entries(SYNCED_PAGE_DATES).filter(([path]) => !path.startsWith('/portfolio/'))),
  ...MANUAL_PAGE_DATES,
};
/** 사례 상세 페이지 본문 수정일 — sitemap-cases가 데이터(modifiedAt)와 비교해 늦은 쪽을 쓴다 */
export const CASE_PAGE_DATES: Record<string, string> = Object.fromEntries(
  Object.entries(SYNCED_PAGE_DATES).filter(([path]) => path.startsWith('/portfolio/')),
);

// 각 페이지가 처음 공개된 날(git 최초 커밋 기준). WebPage JSON-LD의 datePublished 소스로,
// 위 STATIC_PAGE_DATES(의미 있는 갱신일 = dateModified)와 짝을 이룬다.
export const STATIC_PAGE_PUBLISHED: Record<string, string> = {
  '/': '2026-05-16',
  '/about': '2026-05-16',
  '/service': '2026-05-16',
  '/portfolio': '2026-05-16',
  '/column': '2026-05-16',
  '/program': '2026-06-24',
  '/contact': '2026-05-16',
  '/privacy-policy': '2026-05-16',
  '/terms': '2026-05-16',
  '/faq': '2026-11-04',
  '/notice': '2026-11-04',
  '/maintenance': '2026-11-04',
  '/maintenance/pricing': '2026-11-04',
  '/careers': '2026-11-05',
};

export function buildCaseSitemapEntries(cases: Array<{ slug: string; modifiedAt: string }>) {
  return cases.map((item) => ({
    path: `/portfolio/${item.slug}`,
    lastmod: item.modifiedAt,
  }));
}
