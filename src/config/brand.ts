export const brand = {
  name: 'websLAB',
  nameKo: '웹슬랩',
  tagline: '전문성으로 완성하는 비즈니스 웹사이트',
  description: '기업 홈페이지 신규 제작·리뉴얼 전문 에이전시. 기획부터 운영까지 한 팀에서.',
  domain: 'webslab.co.kr',
  url: 'https://webslab.co.kr',
  email: 'contact@webslab.co.kr',
  phone: '010-9891-2787',
  address: {
    streetAddress: '서울특별시 강남구 역삼로3길 19 10층 1007호', // TODO: 실제 주소
    addressLocality: '서울',
    addressRegion: 'KR-11',
    postalCode: '06236', // TODO: 실 우편번호
    addressCountry: 'KR',
  },
  social: {
    instagram: '', // TODO
    linkedin: '',
    youtube: '',
    blog: '',
  },
  legal: {
    businessNumber: '173-58-00764',
    representativeName: '조현도',
    onlineSalesNumber: '', // 통신판매업 신고번호 (선택)
  },
  hours: {
    weekdays: '평일 10:00 - 18:00',
    note: '주말·공휴일 휴무',
  },
} as const;

export type Brand = typeof brand;
