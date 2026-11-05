import { z } from 'zod';

// 리뉴얼 사이트 폼 4종 — public/site/ws-forms.js가 폼 값을 이 이름으로 맞춰 보낸다.
//  project     견적 문의 (메인 하단 · /contact)  — 첨부파일 가능
//  quick       간편 상담 (메인 우측 도크)
//  maintenance 유지보수 신청 (/maintenance 3단계 신청서)
//  career      채용 지원 (/careers 지원서)  — 첨부파일 가능

const phone = z
  .string({ message: '연락처를 입력해 주세요' })
  .trim()
  .regex(/^[0-9-+\s()]{7,20}$/, '연락처 형식이 올바르지 않습니다');
const consent = z.literal(true, { message: '개인정보 수집·이용에 동의해 주세요' });
const optional = (max: number) => z.string().trim().max(max).default('');
const required = (max: number, message: string) =>
  z.string({ message }).trim().min(1, message).max(max, `${max}자 이내로 입력해 주세요`);

export const projectInquirySchema = z.object({
  kind: z.literal('project'),
  projectType: z.string().trim().max(30).default('아직 모르겠어요'),
  company: required(100, '회사명을 입력해 주세요'),
  name: required(50, '담당자 성함을 입력해 주세요'),
  phone,
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  currentSite: optional(300),
  refUrls: z.array(z.string().trim().max(300)).max(5).default([]),
  budget: optional(100),
  deadline: optional(100),
  message: z
    .string({ message: '문의 내용을 입력해 주세요' })
    .trim()
    .min(2, '문의 내용을 입력해 주세요')
    .max(3000, '문의 내용은 3000자 이내로 입력해 주세요'),
  privacyConsent: consent,
});

export const quickInquirySchema = z.object({
  kind: z.literal('quick'),
  name: required(50, '이름을 입력해 주세요'),
  phone,
  inquiryType: optional(30),
  privacyConsent: consent,
});

export const maintenanceInquirySchema = z.object({
  kind: z.literal('maintenance'),
  url: required(300, '사이트 주소를 입력해 주세요'),
  mode: optional(30),
  work: z.array(z.string().trim().max(40)).max(10).default([]),
  message: optional(3000),
  name: required(100, '이름 또는 회사명을 입력해 주세요'),
  reach: z
    .string({ message: '회신받을 연락처를 입력해 주세요' })
    .trim()
    .min(5, '회신받을 전화번호나 메일을 입력해 주세요')
    .max(120),
  privacyConsent: consent,
});

export const careerInquirySchema = z.object({
  kind: z.literal('career'),
  position: required(40, '지원 분야를 골라 주세요'),
  name: required(50, '이름을 입력해 주세요'),
  phone,
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  portfolioUrl: optional(500),
  message: z.string().trim().max(3000, '자기소개는 3000자 이내로 입력해 주세요').default(''),
  privacyConsent: consent,
});

export const inquirySchema = z.discriminatedUnion('kind', [
  projectInquirySchema,
  quickInquirySchema,
  maintenanceInquirySchema,
  careerInquirySchema,
]);

/** 첨부파일을 받는 폼 */
export const KINDS_WITH_ATTACHMENTS: ReadonlySet<string> = new Set(['project', 'career']);

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryKind = InquiryInput['kind'];

/** FormData → 스키마 입력 객체 (여러 값 필드는 배열, 빈 값은 버림) */
export function inquiryFromFormData(form: FormData): Record<string, unknown> {
  const one = (k: string) => {
    const v = form.get(k);
    return typeof v === 'string' ? v : undefined;
  };
  const many = (k: string) =>
    form
      .getAll(k)
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.trim())
      .filter(Boolean);
  return {
    kind: one('kind'),
    projectType: one('projectType'),
    company: one('company'),
    name: one('name'),
    phone: one('phone'),
    email: one('email'),
    currentSite: one('currentSite'),
    refUrls: many('refUrls'),
    budget: one('budget'),
    deadline: one('deadline'),
    message: one('message'),
    inquiryType: one('inquiryType'),
    url: one('url'),
    mode: one('mode'),
    work: many('work'),
    reach: one('reach'),
    position: one('position'),
    portfolioUrl: one('portfolioUrl'),
    privacyConsent: one('privacyConsent') === 'true',
  };
}

// 첨부파일 — 폼 위젯(main.js multifile)과 같은 허용 확장자·용량
export const ATTACHMENT_LIMITS = {
  maxFiles: 3,
  maxFileBytes: 10 * 1024 * 1024,
  // Resend 한 통 최대 40MB(base64 인코딩 후) — 원본 기준 25MB면 안전
  maxTotalBytes: 25 * 1024 * 1024,
};

export const ATTACHMENT_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic', 'heif', 'tiff', 'tif',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'hwp', 'hwpx', 'txt', 'csv', 'rtf',
  'zip', 'rar', '7z', 'ai', 'psd',
];

/** 첨부 목록 검사 — 문제가 있으면 사용자에게 보여줄 문구, 없으면 null */
export function checkAttachments(files: { name: string; size: number }[]): string | null {
  if (files.length > ATTACHMENT_LIMITS.maxFiles) {
    return `첨부파일은 최대 ${ATTACHMENT_LIMITS.maxFiles}개까지 보낼 수 있어요.`;
  }
  for (const f of files) {
    const ext = f.name.includes('.') ? f.name.split('.').pop()!.toLowerCase() : '';
    if (!ATTACHMENT_EXTENSIONS.includes(ext)) return `지원하지 않는 파일 형식이에요: ${f.name}`;
    if (f.size > ATTACHMENT_LIMITS.maxFileBytes) return `파일당 10MB까지 보낼 수 있어요: ${f.name}`;
  }
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > ATTACHMENT_LIMITS.maxTotalBytes) return '첨부파일은 합계 25MB까지 보낼 수 있어요.';
  return null;
}
