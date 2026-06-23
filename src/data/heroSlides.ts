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
    title: '코스모스악기 · Roland Korea 브랜드 사이트',
    description: '글로벌 브랜드 한국 공식 사이트 — 제품·영상·뉴스를 한 CMS에서.',
    image: bg('hero-1'),
    cta: { label: '케이스 보기', href: '/portfolio/roland-korea' },
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
