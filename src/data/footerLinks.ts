import type { NavItem } from './navItems';

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Services',
    items: [
      { label: '신규 홈페이지 제작', href: '/service' },
      { label: '홈페이지 리뉴얼', href: '/service' },
      { label: '유지보수', href: '/service' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: '회사소개', href: '/about' },
      { label: '포트폴리오', href: '/portfolio' },
      { label: '전문 칼럼', href: '/column' },
      { label: '개발 백서', href: '/whitepaper' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: '개인정보취급방침', href: '/privacy-policy' },
      { label: '이용약관', href: '/terms' },
    ],
  },
];
