export type Duration = '1~3개월' | '3~6개월' | '6~12개월' | '12개월 이상';
export type Industry = 'MANUFACTURING' | 'LOGISTICS' | 'IT_SOLUTION' | 'PUBLIC' | 'HEALTHCARE' | 'EDUCATION' | 'BRAND';

export type Portfolio = {
  slug: string;
  title: string;
  client: string;
  category: string;
  industry: Industry;
  duration: Duration;
  services: string[];
  year: number;
  modifiedAt: string;
  summary: string;
  description: string;
  cover: string;
  gallery: string[];
  url?: string;
  results?: { label: string; value: string }[];
};

const cover = (seed: string) => `https://picsum.photos/seed/${seed}/1200/900`;
const gallery = (seed: string, count = 4) =>
  Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${seed}-g${i}/1600/1000`);

export const portfolios: Portfolio[] = [
  {
    slug: 'roland-korea',
    title: '코스모스악기 · Roland Korea 브랜드 사이트',
    client: '코스모스악기',
    category: '신규 제작',
    industry: 'BRAND',
    duration: '6~12개월',
    services: ['UI/UX', '브랜드 사이트', 'CMS 구축', '미디어 큐레이션'],
    year: 2024,
    modifiedAt: '2026-05-30',
    summary: 'Roland 글로벌 브랜드의 한국 공식 사이트',
    description:
      'Roland 글로벌 브랜드의 한국 공식 사이트. 제품 카탈로그·영상·뉴스를 마케팅 팀이 직접 운영하도록 CMS 기반으로 신규 구축했습니다.',
    cover: cover('roland'),
    gallery: gallery('roland'),
    url: 'https://rolandkorea.com',
    results: [
      { label: '제품 카테고리', value: '9개' },
      { label: '콘텐츠 모듈', value: '3개' },
    ],
  },
];
