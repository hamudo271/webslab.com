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
    slug: 'impex-gls',
    title: 'IMPEX GLS, INC. 홈페이지 리뉴얼',
    client: 'IMPEX GLS',
    category: '리뉴얼',
    industry: 'LOGISTICS',
    duration: '1~3개월',
    services: ['UI/UX', '그래픽 디자인', '반응형 퍼블리싱'],
    year: 2025,
    summary: 'UI/UX 리뉴얼 및 그래픽 디자인',
    description:
      '글로벌 물류 기업 IMPEX GLS의 홈페이지를 비즈니스 신뢰감을 강화하는 방향으로 리뉴얼했습니다. 전 세계 12개국 네트워크를 시각화하고, 서비스별 케이스 스터디를 강조하는 구조로 재편했습니다.',
    cover: cover('impex'),
    gallery: gallery('impex'),
    results: [
      { label: '평균 체류시간', value: '+62%' },
      { label: '문의 전환율', value: '+38%' },
    ],
  },
  {
    slug: 'virex',
    title: '주식회사 바이렉스 홈페이지 리뉴얼',
    client: '바이렉스',
    category: '리뉴얼',
    industry: 'MANUFACTURING',
    duration: '6~12개월',
    services: ['UI/UX', 'SEO 최적화', 'CMS 구축'],
    year: 2024,
    summary: 'UI/UX 리뉴얼 및 1,700개 상품군 SEO 최적화',
    description:
      '1,700개에 달하는 산업용 상품 카탈로그를 검색 친화적으로 재구성하고, 카테고리 네비게이션과 상세 페이지 템플릿을 새롭게 설계했습니다.',
    cover: cover('virex'),
    gallery: gallery('virex'),
    results: [
      { label: '검색 유입', value: '+214%' },
      { label: '상품 페이지 인덱싱', value: '1,712건' },
    ],
  },
  {
    slug: 'roland-korea',
    title: '코스모스악기 · Roland Korea 브랜드 사이트',
    client: '코스모스악기',
    category: '신규 제작',
    industry: 'BRAND',
    duration: '6~12개월',
    services: ['UI/UX', '브랜드 사이트', 'CMS 구축', '미디어 큐레이션'],
    year: 2024,
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
  {
    slug: 'smc-korea',
    title: 'SMC 코리아 제품 카탈로그 사이트',
    client: 'SMC',
    category: '신규 제작',
    industry: 'MANUFACTURING',
    duration: '6~12개월',
    services: ['기획', 'UI/UX', '제품 DB', 'SEO'],
    year: 2024,
    summary: '공압 부품 제조사의 카탈로그 사이트 구축',
    description: 'B2B 제조사 SMC의 한국법인 카탈로그 사이트. 3,000여 개 제품을 카테고리별로 검색·비교·문의할 수 있는 구조로 설계했습니다.',
    cover: cover('smc'),
    gallery: gallery('smc'),
  },
  {
    slug: 'galux',
    title: 'Galux AI 단백질 플랫폼 사이트',
    client: 'Galux',
    category: '신규 제작',
    industry: 'IT_SOLUTION',
    duration: '3~6개월',
    services: ['기획', 'UI/UX', '인터랙션', '영문 카피'],
    year: 2024,
    summary: 'AI 단백질 디자인 플랫폼의 영문 사이트',
    description:
      'AI 기반 신약 개발 플랫폼 Galux의 글로벌 투자자·연구자 대상 영문 사이트. 기술 데모와 논문 인용을 통해 신뢰를 빠르게 전달합니다.',
    cover: cover('galux'),
    gallery: gallery('galux'),
  },
  {
    slug: 'fastfive-cnd',
    title: 'FASTFIVE C&D 비즈니스 사이트',
    client: 'FASTFIVE C&D',
    category: '신규 제작',
    industry: 'IT_SOLUTION',
    duration: '3~6개월',
    services: ['브랜딩', '기획', 'UI/UX', '개발'],
    year: 2024,
    summary: '공유오피스 사업의 컨설팅 브랜치 런칭 사이트',
    description: 'FASTFIVE의 컨설팅·디벨로퍼 라인업 C&D의 브랜드 런칭 사이트. 서비스 포트폴리오와 케이스 스터디를 중심으로 구성했습니다.',
    cover: cover('fastfive'),
    gallery: gallery('fastfive'),
  },
  {
    slug: 'nks-bio',
    title: 'NKS 바이오 기업 사이트',
    client: 'NKS',
    category: '신규 제작',
    industry: 'HEALTHCARE',
    duration: '3~6개월',
    services: ['기획', 'UI/UX', 'CMS'],
    year: 2024,
    summary: '바이오 R&D 기업의 IR/투자자 대응 사이트',
    description: '연구개발 파이프라인을 단계별로 가시화하고, IR 자료실을 관리자 화면에서 직접 운영할 수 있는 CMS를 함께 구축했습니다.',
    cover: cover('nks'),
    gallery: gallery('nks'),
  },
  {
    slug: 'medical-korea',
    title: 'Medical Korea 정부 캠페인 사이트',
    client: '한국보건산업진흥원',
    category: '신규 제작',
    industry: 'PUBLIC',
    duration: '3~6개월',
    services: ['기획', 'UI/UX', '다국어 (5개)'],
    year: 2023,
    summary: '의료관광 진흥 다국어 캠페인 사이트',
    description: '한국 의료관광을 홍보하는 정부 캠페인 사이트. 영어·중국어·일본어·러시아어·아랍어 5개 언어 동시 운영을 위한 콘텐츠 구조를 설계했습니다.',
    cover: cover('medical'),
    gallery: gallery('medical'),
  },
  {
    slug: 'x-log',
    title: 'X-LOG 풀필먼트 솔루션 사이트',
    client: 'X-LOG',
    category: '신규 제작',
    industry: 'LOGISTICS',
    duration: '3~6개월',
    services: ['기획', 'UI/UX', '인터랙션'],
    year: 2024,
    summary: '풀필먼트·물류 SaaS의 세일즈 사이트',
    description: '복잡한 풀필먼트 운영 프로세스를 인포그래픽으로 단순화하고, 견적 문의로 자연스럽게 연결되는 퍼널을 설계했습니다.',
    cover: cover('xlog'),
    gallery: gallery('xlog'),
  },
  {
    slug: 'radisen',
    title: 'RadiSen 의료기기 글로벌 사이트',
    client: 'RadiSen',
    category: '신규 제작',
    industry: 'HEALTHCARE',
    duration: '6~12개월',
    services: ['브랜딩', 'UI/UX', '영문 카피', 'CMS'],
    year: 2024,
    summary: '디지털 X-ray 시스템 제조사의 영문 사이트',
    description: '글로벌 의료기기 시장 진출을 위한 영문 기업 사이트. 제품 라인업과 임상 케이스, 인증 정보를 체계적으로 정리했습니다.',
    cover: cover('radisen'),
    gallery: gallery('radisen'),
  },
  {
    slug: 'novado',
    title: 'NovaDO 친환경 제품 브랜드 사이트',
    client: 'NovaDO',
    category: '신규 제작',
    industry: 'MANUFACTURING',
    duration: '1~3개월',
    services: ['브랜딩', 'UI/UX'],
    year: 2024,
    summary: '친환경 생활용품 브랜드의 D2C 런칭 사이트',
    description: '친환경 가치를 직관적으로 전달하는 비주얼과, 첫 구매 전환을 위한 쇼피파이 연동 D2C 사이트를 동시 구축했습니다.',
    cover: cover('novado'),
    gallery: gallery('novado'),
  },
  {
    slug: 'azgram',
    title: 'AZgram 글로벌 SNS 마케팅 사이트',
    client: 'AZgram',
    category: '신규 제작',
    industry: 'IT_SOLUTION',
    duration: '1~3개월',
    services: ['기획', 'UI/UX', '랜딩'],
    year: 2024,
    summary: 'SNS 마케팅 SaaS의 컨버전 랜딩',
    description: '광고 유입 트래픽을 무료 체험으로 전환시키기 위한 단일 랜딩 페이지. A/B 테스트 가능한 카피와 CTA 구조로 제작했습니다.',
    cover: cover('azgram'),
    gallery: gallery('azgram'),
    results: [
      { label: '체험 신청 전환율', value: '+47%' },
    ],
  },
];
