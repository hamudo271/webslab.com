import { z } from 'zod';

// 관리자 글 작성/수정 입력 — API와 에디터 폼이 공유
export const postInputSchema = z.object({
  title: z.string().trim().min(1, '제목을 입력해 주세요.').max(200, '제목이 너무 깁니다.'),
  slug: z.string().trim().max(120).default(''),
  content: z.string().default(''),
  excerpt: z.string().trim().max(300, '요약은 300자 이내로 입력해 주세요.').default(''),
  thumbnailUrl: z.union([z.literal(''), z.string().url()]).default(''),
  category: z.string().trim().min(1, '카테고리를 선택해 주세요.').max(40),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export type PostInput = z.infer<typeof postInputSchema>;
