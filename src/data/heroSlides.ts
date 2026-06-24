export type HeroSlide = {
  id: string;
  kind: 'project' | 'industry';
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  cta?: { label: string; href: string };
};

const cover = (slug: string) => `/images/portfolio/${slug}.png`;

export const heroSlides: HeroSlide[] = [
  {
    id: 'h1',
    kind: 'project',
    eyebrow: 'PROJECT 01',
    title: '코스모스악기 · Roland Korea 브랜드 사이트',
    description: '글로벌 브랜드 한국 공식 사이트 — 제품·영상·뉴스를 한 CMS에서 운영합니다.',
    image: cover('roland-korea'),
    cta: { label: '케이스 보기', href: '/portfolio/roland-korea' },
  },
  {
    id: 'h2',
    kind: 'project',
    eyebrow: 'PROJECT 02',
    title: '별하 스터디카페 브랜드 사이트',
    description: '학습 공간의 분위기와 이용 정보를 직관적으로 전달하는 브랜드 사이트.',
    image: cover('byeolha-studycafe'),
    cta: { label: '케이스 보기', href: '/portfolio/byeolha-studycafe' },
  },
];
