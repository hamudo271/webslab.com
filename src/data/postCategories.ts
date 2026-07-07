// 칼럼 카테고리 단일 소스 — 기존 정적 12편의 카테고리와 동일한 어휘를 사용한다.
// 관리자 글쓰기 select + 공개 목록 필터 공용.
export const POST_CATEGORIES = [
  '비용·견적',
  '업체 선정',
  '일정·프로세스',
  '리뉴얼',
  'SEO',
  'SEO·마이그레이션',
  'CMS·운영',
  '운영·유지보수',
  '디자인·UX',
  '기술·플랫폼',
  'B2B 전략',
  '제조업',
  '물류·무역',
  '의료·병원',
  '공공·접근성',
] as const;

export const DEFAULT_POST_CATEGORY: (typeof POST_CATEGORIES)[number] = 'SEO';
