import type { NavItem } from './navItems';
import { brand } from '@/config/brand';

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
      { label: '프로그램 개발', href: '/program' },
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

// 외부 채널 — brand.social에 값이 채워진 것만 푸터에 노출된다.
// 검색엔진이 사업자 실재성을 확인하는 연결 신호이므로 실제 운영 채널만 등록할 것.
export const channelLinks: NavItem[] = (
  [
    { label: '네이버 블로그', href: brand.social.naverBlog },
    { label: '네이버 플레이스', href: brand.naverPlaceUrl },
    { label: '인스타그램', href: brand.social.instagram },
    { label: '유튜브', href: brand.social.youtube },
    { label: '카카오톡 채널', href: brand.social.kakaoChannel },
    { label: 'LinkedIn', href: brand.social.linkedin },
  ] as NavItem[]
).filter((item) => Boolean(item.href));
