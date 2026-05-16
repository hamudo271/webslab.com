export type ColumnPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO date
  readMinutes: number;
  cover: string;
};

const cover = (seed: string) => `https://picsum.photos/seed/col-${seed}/1200/700`;

export const columnPosts: ColumnPost[] = [
  {
    slug: 'why-business-website-matters',
    title: '왜 기업 홈페이지가 다시 중요해졌을까?',
    excerpt: 'SaaS·SNS 시대에도 기업 홈페이지는 첫 인상의 80%를 결정합니다. 그 이유를 데이터로 분석합니다.',
    category: '인사이트',
    publishedAt: '2025-09-12',
    readMinutes: 7,
    cover: cover('1'),
  },
  {
    slug: 'renewal-vs-rebuild',
    title: '리뉴얼인가, 신규 제작인가 — 기준 5가지',
    excerpt: '기존 사이트를 살릴 것인지, 새로 만들지 결정하기 전 반드시 점검해야 할 5가지 기준.',
    category: '가이드',
    publishedAt: '2025-08-28',
    readMinutes: 9,
    cover: cover('2'),
  },
  {
    slug: 'seo-checklist-for-b2b',
    title: 'B2B 기업 홈페이지 SEO 체크리스트 20가지',
    excerpt: 'B2B 사이트가 흔히 놓치는 검색엔진 최적화 항목 20가지를 우선순위와 함께 정리했습니다.',
    category: 'SEO',
    publishedAt: '2025-08-10',
    readMinutes: 12,
    cover: cover('3'),
  },
  {
    slug: 'cms-strategy-for-marketing-team',
    title: '마케팅 팀이 직접 운영 가능한 CMS 설계법',
    excerpt: '개발자 없이도 콘텐츠를 운영할 수 있도록 CMS를 설계하는 핵심 원칙 3가지.',
    category: '운영',
    publishedAt: '2025-07-22',
    readMinutes: 8,
    cover: cover('4'),
  },
];
