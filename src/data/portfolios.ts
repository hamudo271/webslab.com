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

const cover = (slug: string) => `/images/portfolio/${slug}.png`;

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
    cover: cover('roland-korea'),
    gallery: [],
    url: 'https://rolandkorea.com',
    results: [
      { label: '제품 카테고리', value: '9개' },
      { label: '콘텐츠 모듈', value: '3개' },
    ],
  },
  {
    slug: 'byeolha-studycafe',
    title: '별하 스터디카페 브랜드 사이트',
    client: '별하 스터디카페',
    category: '브랜드 사이트',
    industry: 'BRAND',
    duration: '1~3개월',
    services: ['UI/UX', '브랜드 사이트', '반응형 웹'],
    year: 2024,
    modifiedAt: '2026-06-24',
    summary: '프리미엄 스터디카페 브랜드 사이트',
    description:
      '학습 공간의 분위기와 이용 정보를 직관적으로 전달하는 브랜드 사이트. 지점·요금·예약 안내를 깔끔하게 정리해 방문 전 궁금증을 바로 해결하도록 구성했습니다.',
    cover: cover('byeolha-studycafe'),
    gallery: [],
  },
  {
    slug: 'univerlab-media',
    title: '유니버랩 미디어 브랜드 사이트',
    client: '유니버랩 미디어',
    category: '브랜드 사이트',
    industry: 'BRAND',
    duration: '1~3개월',
    services: ['UI/UX', '브랜드 사이트', '반응형 웹', '콘텐츠 큐레이션'],
    year: 2025,
    modifiedAt: '2026-06-26',
    summary: '유튜브·숏폼 영상 마케팅 전문 브랜드 사이트',
    description:
      '유튜브·숏폼 영상의 기획·촬영·편집부터 채널 운영까지 올인원으로 제공하는 영상 마케팅 회사의 공식 브랜드 사이트. 실제 제작 사례를 전면에 배치해 전문성과 성과를 한눈에 전달하도록 구성했습니다.',
    cover: cover('univerlab-media'),
    gallery: [],
    url: 'https://univerlabmedia.co.kr',
    results: [
      { label: '서비스 범위', value: '기획·촬영·편집·운영' },
      { label: '콘텐츠 포맷', value: '유튜브·숏폼' },
    ],
  },
];
