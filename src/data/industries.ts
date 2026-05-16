import type { Industry } from './portfolios';

export const INDUSTRY_LABELS: Record<Industry, string> = {
  MANUFACTURING: '제조',
  LOGISTICS: '물류',
  IT_SOLUTION: 'IT 솔루션',
  PUBLIC: '공공·정부',
  HEALTHCARE: '바이오·의료',
  EDUCATION: '교육·연구',
};

export const industryFilters: { key: Industry | 'ALL'; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'MANUFACTURING', label: '제조' },
  { key: 'LOGISTICS', label: '물류' },
  { key: 'IT_SOLUTION', label: 'IT 솔루션' },
  { key: 'HEALTHCARE', label: '바이오·의료' },
  { key: 'PUBLIC', label: '공공' },
];
