export type FaqEntry = { question: string; answer: string };
export type HowToStep = { name: string; text: string };
export type HowToBlock = { name: string; description: string; steps: HowToStep[] };

export type ColumnPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO date
  readMinutes: number;
  cover: string;
  authorId: string;
  tldr: string; // short summary (1-3 sentences)
  directAnswer: string; // 1-sentence "answer"
  body: string; // HTML string (Markdown to come later via separate plan)
  faqs?: FaqEntry[];
  howTo?: HowToBlock;
  relatedSlugs?: string[];
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
    authorId: 'representative',
    tldr: '본문 작성 예정.',
    directAnswer: '본문 작성 예정.',
    body: '<p>본문 작성 예정 — 빠른 시일 내 업데이트됩니다.</p>',
  },
  {
    slug: 'renewal-vs-rebuild',
    title: '리뉴얼인가, 신규 제작인가 — 기준 5가지',
    excerpt: '기존 사이트를 살릴 것인지, 새로 만들지 결정하기 전 반드시 점검해야 할 5가지 기준.',
    category: '가이드',
    publishedAt: '2026-06-01',
    readMinutes: 9,
    cover: cover('2'),
    authorId: 'representative',
    tldr:
      '기술 부채, 디자인 노후, 컨버전 데이터, 운영 비용, 비즈니스 목표 변화 — 이 다섯 가지 기준 중 셋 이상이 해당되면 신규 제작이, 그 이하면 리뉴얼이 적합합니다.',
    directAnswer:
      '리뉴얼은 정보 구조와 기술 스택의 70% 이상을 보존할 수 있을 때, 신규 제작은 그 이하일 때 선택합니다.',
    body:
      '<h2>왜 이 결정이 중요한가</h2><p>잘못된 선택은 두 배의 비용과 SEO 손실을 초래합니다.</p><h2>5가지 기준</h2><ol><li>기술 부채 수준</li><li>디자인/UX 노후도</li><li>현재 컨버전 데이터</li><li>운영 비용 효율</li><li>비즈니스 목표 변화 폭</li></ol><p>각 기준을 0~3점으로 평가해 합산하세요. 8점 이상이면 신규 제작, 그 이하면 리뉴얼.</p>',
    faqs: [
      {
        question: '리뉴얼이 신규 제작보다 항상 저렴한가요?',
        answer:
          '아니요. 깊은 마이그레이션과 인프라 교체가 동반되면 신규 제작과 비슷한 비용이 듭니다.',
      },
      {
        question: 'SEO 손실을 어떻게 방지하나요?',
        answer:
          '리뉴얼 직전 URL 인벤토리 추출 → 301 매핑 → 발행 후 30일 모니터링이 표준 절차입니다.',
      },
    ],
    relatedSlugs: ['seo-checklist-for-b2b', 'cms-strategy-for-marketing-team'],
  },
  {
    slug: 'seo-checklist-for-b2b',
    title: 'B2B 기업 홈페이지 SEO 체크리스트 20가지',
    excerpt: 'B2B 사이트가 흔히 놓치는 검색엔진 최적화 항목 20가지를 우선순위와 함께 정리했습니다.',
    category: 'SEO',
    publishedAt: '2025-08-10',
    readMinutes: 12,
    cover: cover('3'),
    authorId: 'representative',
    tldr: '본문 작성 예정.',
    directAnswer: '본문 작성 예정.',
    body: '<p>본문 작성 예정 — 빠른 시일 내 업데이트됩니다.</p>',
  },
  {
    slug: 'cms-strategy-for-marketing-team',
    title: '마케팅 팀이 직접 운영 가능한 CMS 설계법',
    excerpt: '개발자 없이도 콘텐츠를 운영할 수 있도록 CMS를 설계하는 핵심 원칙 3가지.',
    category: '운영',
    publishedAt: '2025-07-22',
    readMinutes: 8,
    cover: cover('4'),
    authorId: 'representative',
    tldr: '본문 작성 예정.',
    directAnswer: '본문 작성 예정.',
    body: '<p>본문 작성 예정 — 빠른 시일 내 업데이트됩니다.</p>',
  },
];
