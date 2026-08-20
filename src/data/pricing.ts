export type PricingRow = { label: string; value: string };

export type PricingTier = {
  key: string;
  badge: string;
  name: string;
  target: string;
  description: string;
  rows: PricingRow[];
  /**
   * 시작 금액(VAT 별도). 실제 단가가 확정되기 전까지는 null로 두면 '견적 문의'로 렌더된다.
   * 확인되지 않은 금액을 임의로 채우지 않는다 — 공개 페이지의 가격은 곧 약속이다.
   * 예: startingPrice: '150만원'
   */
  startingPrice: string | null;
  /** 금액 아래 보조 설명(무엇이 포함/제외인지). */
  priceNote: string;
  featured?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    key: 'landing',
    badge: 'LANDING',
    name: '랜딩페이지',
    target: '행사 · 캠페인 · 프로모션',
    description:
      '서브 페이지 없이 스크롤 하나로 완결되는 원페이지. 짧은 기간에 전환 하나만 노리는 구조입니다.',
    rows: [
      { label: '구성', value: '메인 1페이지' },
      { label: '반응형', value: 'PC · 모바일' },
      { label: 'SEO', value: '기본 메타 · 구조화 데이터' },
      { label: 'CMS', value: '미포함' },
      { label: '제작 기간', value: '2~4주' },
    ],
    startingPrice: null, // TODO: 실제 시작 단가 입력
    priceNote: 'VAT 별도 · 호스팅/도메인 별도',
  },
  {
    key: 'standard',
    badge: 'STANDARD',
    name: '기업 홈페이지',
    target: '기업 · 브랜드 · 기관',
    description:
      '회사 소개부터 서비스·문의까지 갖춘 기본 구성. 운영자가 직접 콘텐츠를 올릴 수 있는 CMS를 함께 만듭니다.',
    rows: [
      { label: '구성', value: '메인 + 서브 5페이지~' },
      { label: '반응형', value: 'PC · 태블릿 · 모바일' },
      // '네이버 최적화'를 판매 항목으로 쓰면 포털 검색결과에 영향을 주는 서비스(상위노출
      // 대행류)로 분류될 수 있어 광고 심사에서 반려 사유가 된다. 기술 작업 그대로 서술.
      { label: 'SEO', value: '구조 · 속도 · 메타 최적화' },
      { label: 'CMS', value: '관리자 페이지 구축' },
      { label: '제작 기간', value: '1~3개월' },
    ],
    startingPrice: null, // TODO: 실제 시작 단가 입력
    priceNote: 'VAT 별도 · 1년 무상 유지보수 포함',
    featured: true,
  },
  {
    key: 'custom',
    badge: 'CUSTOM',
    name: '대형 · 리뉴얼',
    target: '다국어 · 데이터 이전 · 연동',
    description:
      '기존 사이트의 데이터와 검색 자산을 지키면서 옮기거나, 외부 시스템 연동이 필요한 프로젝트입니다.',
    rows: [
      { label: '구성', value: '요건에 따라 설계' },
      { label: '반응형', value: 'PC · 태블릿 · 모바일' },
      { label: 'SEO', value: '301 설계 · 인덱싱 이전' },
      { label: 'CMS', value: '맞춤 구축 · 권한 분리' },
      { label: '제작 기간', value: '3개월~' },
    ],
    startingPrice: null, // TODO: 실제 시작 단가 입력
    priceNote: '범위 확정 후 개별 산정',
  },
];
