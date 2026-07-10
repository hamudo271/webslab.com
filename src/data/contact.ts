import type { ContactBudgetType, ContactCategoryType } from '@/lib/validators/contact';

/** 견적 문의 페이지 상단 지표 — 실제 실적만 사용(브로슈어와 동일 소스) */
export const contactStats = [
  { label: '누적 프로젝트', value: '110+' },
  { label: '3년 연속 재계약률', value: '85%' },
  { label: '고객 만족도', value: '4.9', suffix: '/ 5.0' },
  { label: '견적 회신까지', value: '1', suffix: '영업일' },
];

/** 사이드바 — 문의 진행 안내 3단계 */
export const contactSteps = [
  '문의를 남겨주시면, 담당자가 확인합니다.',
  '맞춤 제안·견적서를 1영업일 내에 송부합니다.',
  '진행 여부를 결정하시면 바로 킥오프합니다.',
];

/** 폼 버튼 선택용 표시 순서·짧은 라벨 (이메일 본문은 validators의 풀 라벨 사용) */
export const CATEGORY_OPTIONS: { value: ContactCategoryType; label: string }[] = [
  { value: 'NEW_BUILD', label: '신규 제작' },
  { value: 'RENEWAL', label: '리뉴얼' },
  { value: 'MAINTENANCE', label: '운영·유지보수' },
  { value: 'OTHER', label: '기타' },
];

export const BUDGET_OPTIONS: { value: ContactBudgetType; label: string }[] = [
  { value: 'TBD', label: '미정' },
  { value: 'UNDER_500', label: '500만원 미만' },
  { value: 'B500_1000', label: '500–1,000만원' },
  { value: 'B1000_3000', label: '1,000–3,000만원' },
  { value: 'OVER_3000', label: '3,000만원 이상' },
];
