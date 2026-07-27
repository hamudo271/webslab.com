export const brand = {
  name: 'websLAB',
  nameKo: '웹스랩',
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
  // 외부 채널 — 값을 채우면 푸터 채널 링크와 JSON-LD sameAs에 자동 반영된다.
  // 검색엔진(특히 네이버)이 사업자 실재성을 판단하는 연결 신호라 실제 운영 채널만 기입할 것.
  social: {
    naverBlog: '', // TODO: https://blog.naver.com/{아이디}
    instagram: '', // TODO
    youtube: '',
    kakaoChannel: '', // TODO: https://pf.kakao.com/{채널ID}
    linkedin: '',
  },
  /** 네이버 지도/플레이스 업체 페이지 — 지역성(로컬) 신호. 예: https://map.naver.com/p/entry/place/{ID} */
  naverPlaceUrl: '', // TODO
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

/** JSON-LD sameAs용 외부 채널 URL 목록 — 값이 채워진 것만. */
export const brandSameAs: string[] = [
  ...Object.values(brand.social),
  brand.naverPlaceUrl,
].filter(Boolean);
