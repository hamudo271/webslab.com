import { z } from 'zod';

export const ContactCategory = z.enum(['NEW_BUILD', 'RENEWAL', 'MAINTENANCE', 'OTHER']);
export type ContactCategoryType = z.infer<typeof ContactCategory>;

export const ContactBudget = z.enum([
  'UNDER_500',
  'B500_1000',
  'B1000_3000',
  'OVER_3000',
  'TBD',
]);
export type ContactBudgetType = z.infer<typeof ContactBudget>;

export const contactSchema = z.object({
  name: z
    .string({ message: '이름을 입력해 주세요' })
    .min(1, '이름을 입력해 주세요')
    .max(50, '이름은 50자 이내로 입력해 주세요'),
  company: z.string().max(100, '회사명은 100자 이내로 입력해 주세요').optional().or(z.literal('')),
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  phone: z
    .string()
    .regex(/^[0-9-+\s()]{7,20}$/, '연락처 형식이 올바르지 않습니다')
    .optional()
    .or(z.literal('')),
  category: ContactCategory,
  budget: ContactBudget.optional(),
  message: z
    .string({ message: '문의 내용을 10자 이상 입력해 주세요' })
    .min(10, '문의 내용을 10자 이상 입력해 주세요')
    .max(2000, '문의 내용은 2000자 이내로 입력해 주세요'),
  privacyConsent: z.literal(true, { message: '개인정보 처리방침에 동의해 주세요' }),
  // Honeypot — must be empty
  website: z.string().optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const CATEGORY_LABELS: Record<ContactCategoryType, string> = {
  NEW_BUILD: '신규 홈페이지 제작',
  RENEWAL: '홈페이지 리뉴얼',
  MAINTENANCE: '유지보수',
  OTHER: '기타 문의',
};

export const BUDGET_LABELS: Record<ContactBudgetType, string> = {
  UNDER_500: '500만원 미만',
  B500_1000: '500만원 ~ 1,000만원',
  B1000_3000: '1,000만원 ~ 3,000만원',
  OVER_3000: '3,000만원 이상',
  TBD: '미정 / 상담 후 결정',
};
