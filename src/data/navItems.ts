export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: '회사소개', href: '/about' },
  { label: '서비스', href: '/service' },
  { label: '포트폴리오', href: '/portfolio' },
  { label: '전문 칼럼', href: '/column' },
  { label: '개발 백서', href: '/whitepaper' },
];
