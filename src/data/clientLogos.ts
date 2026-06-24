// Real clients only — rendered as bordered logo cards in ClientLogos.tsx.
export type ClientLogo = {
  name: string;
  tag: string;
  href: string;
};

export const clientLogos: ClientLogo[] = [
  {
    name: '코스모스악기 · Roland Korea',
    tag: '브랜드 사이트 · 신규 제작',
    href: '/portfolio/roland-korea',
  },
  {
    name: '별하 스터디카페',
    tag: '브랜드 사이트',
    href: '/portfolio/byeolha-studycafe',
  },
];
