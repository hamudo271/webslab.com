import { portfolios } from './portfolios';

export type HeroSlide = {
  id: string;
  kind: 'project' | 'industry';
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  /** portfolios.ts의 slug. 히어로 메타(업종·범위·기간)를 실데이터에서 끌어오는 키. */
  portfolioSlug?: string;
  cta?: { label: string; href: string };
};

export type HeroMetaRow = { label: string; value: string };

/**
 * 히어로 케이스의 메타 3줄. 값을 따로 적지 않고 portfolios.ts에서 끌어와,
 * 포트폴리오 데이터를 고치면 히어로도 같이 따라가게 한다(수치 이중 관리 방지).
 *
 * industry·services는 현재 4건이 전부 BRAND / 'UI/UX·브랜드 사이트'로 같아서
 * 슬라이드마다 같은 값이 찍힌다. 실제로 변별되는 category·duration·year를 쓴다.
 */
export function heroMeta(slug?: string): HeroMetaRow[] {
  const p = portfolios.find((item) => item.slug === slug);
  if (!p) return [];
  return [
    { label: '프로젝트', value: p.category },
    { label: '제작 기간', value: p.duration },
    { label: '오픈', value: `${p.year}년` },
  ];
}

const cover = (slug: string) => `/images/portfolio/${slug}.webp`;

export const heroSlides: HeroSlide[] = [
  {
    id: 'h1',
    kind: 'project',
    eyebrow: 'PROJECT 01',
    title: '코스모스악기 · Roland Korea 브랜드 사이트',
    description: '글로벌 브랜드 한국 공식 사이트 — 제품·영상·뉴스를 한 CMS에서 운영합니다.',
    image: cover('roland-korea'),
    portfolioSlug: 'roland-korea',
    cta: { label: '케이스 보기', href: '/portfolio/roland-korea' },
  },
  {
    id: 'h2',
    kind: 'project',
    eyebrow: 'PROJECT 02',
    title: '별하 스터디카페 브랜드 사이트',
    description: '학습 공간의 분위기와 이용 정보를 직관적으로 전달하는 브랜드 사이트.',
    image: cover('byeolha-studycafe'),
    portfolioSlug: 'byeolha-studycafe',
    cta: { label: '케이스 보기', href: '/portfolio/byeolha-studycafe' },
  },
  {
    id: 'h3',
    kind: 'project',
    eyebrow: 'PROJECT 03',
    title: '유니버랩 미디어 브랜드 사이트',
    description: '유튜브·숏폼 기획부터 촬영·편집·채널 운영까지 — 올인원 영상 마케팅 브랜드 사이트.',
    image: cover('univerlab-media'),
    portfolioSlug: 'univerlab-media',
    cta: { label: '케이스 보기', href: '/portfolio/univerlab-media' },
  },
  {
    id: 'h4',
    kind: 'project',
    eyebrow: 'PROJECT 04',
    title: '대한잠수협회 공식 사이트',
    description: '바다를 지키는 다이버들 — 수중 몰입감을 살린 협회 공식 브랜드 사이트.',
    image: cover('blue-ocean-guardians'),
    portfolioSlug: 'blue-ocean-guardians',
    cta: { label: '케이스 보기', href: '/portfolio/blue-ocean-guardians' },
  },
];
