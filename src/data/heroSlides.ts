export type HeroSlide = {
  id: string;
  kind: 'project' | 'industry';
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  cta?: { label: string; href: string };
};

const bg = (seed: string) => `https://picsum.photos/seed/${seed}/1920/1080`;

export const heroSlides: HeroSlide[] = [
  {
    id: 'h1',
    kind: 'project',
    eyebrow: 'PROJECT 01',
    title: 'OECD 조세정책본부 홈페이지 리뉴얼',
    description: 'UI/UX 리뉴얼 및 DB 마이그레이션 — 10년치 정책 자료를 무중단으로.',
    image: bg('hero-1'),
    cta: { label: '케이스 보기', href: '/portfolio/oecd-tax' },
  },
  {
    id: 'h2',
    kind: 'project',
    eyebrow: 'PROJECT 02',
    title: '바이렉스 1,700개 상품군 SEO 리뉴얼',
    description: '검색 유입 +214%, 카테고리 인덱싱 1,712건. 카탈로그형 B2B 사이트의 정석.',
    image: bg('hero-2'),
    cta: { label: '케이스 보기', href: '/portfolio/virex' },
  },
  {
    id: 'h3',
    kind: 'project',
    eyebrow: 'PROJECT 03',
    title: 'FASTFIVE C&D 웹사이트 신규 개발',
    description: '계열사 UI/UX 신규 개발 — 브랜드 톤과 컨설팅 사례를 함께 보여주는 구성.',
    image: bg('hero-3'),
    cta: { label: '케이스 보기', href: '/portfolio/fastfive-cnd' },
  },
  {
    id: 'h4',
    kind: 'industry',
    eyebrow: 'INDUSTRY · MANUFACTURING',
    title: '제조업 홈페이지, 제품이 돋보이게 제작합니다',
    description: '설비 사진 나열이 아닌, 기술력과 신뢰를 전달하는 B2B 사이트를 만듭니다.',
    image: bg('hero-mfg'),
    cta: { label: '제조업 사례 보기', href: '/portfolio?industry=MANUFACTURING' },
  },
  {
    id: 'h5',
    kind: 'industry',
    eyebrow: 'INDUSTRY · GLOBAL LOGISTICS',
    title: '물류·무역 홈페이지, 글로벌 기준으로 제작합니다',
    description: '해외 바이어가 처음 보는 곳이 홈페이지입니다. 한·영 다국어 대응까지 한 번에.',
    image: bg('hero-logi'),
    cta: { label: '물류 사례 보기', href: '/portfolio?industry=LOGISTICS' },
  },
  {
    id: 'h6',
    kind: 'industry',
    eyebrow: 'INDUSTRY · IT SOLUTION',
    title: 'IT 솔루션 홈페이지, 한눈에 이해되게 제작합니다',
    description: '복잡한 기능도 한눈에 전달되는 구조. 문의 전환까지 설계한 사이트를 만듭니다.',
    image: bg('hero-it'),
    cta: { label: 'IT 사례 보기', href: '/portfolio?industry=IT_SOLUTION' },
  },
];
