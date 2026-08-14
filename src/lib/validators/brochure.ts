import { z } from 'zod';

/**
 * 회사소개서 다운로드용 리드 폼.
 * 문의 폼(contactSchema)보다 훨씬 가볍게 — 아직 문의할 준비가 안 된 방문자를 잡는 게 목적이라
 * 필드가 많으면 오히려 놓친다. 이름·이메일·동의 세 개만 받는다.
 */
export const brochureSchema = z.object({
  name: z
    .string({ message: '성함을 입력해 주세요' })
    .min(1, '성함을 입력해 주세요')
    .max(50, '성함은 50자 이내로 입력해 주세요'),
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  company: z.string().max(100, '회사명은 100자 이내로 입력해 주세요').optional().or(z.literal('')),
  privacyConsent: z.literal(true, { message: '개인정보 수집·이용에 동의해 주세요' }),
  // 허니팟 — 봇이 채우면 값이 들어온다
  website: z.string().optional().or(z.literal('')),
});

export type BrochureInput = z.infer<typeof brochureSchema>;

/** 다운로드 파일 경로. 폼 통과 후에만 전달한다. */
export const BROCHURE_FILE = '/files/websLAB-brochure.pdf';
export const BROCHURE_FILENAME = 'websLAB-회사소개서.pdf';
