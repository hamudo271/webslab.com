import { z } from 'zod';
import { POST_CATEGORIES } from '@/data/postCategories';

const CATEGORY_SET = new Set<string>(POST_CATEGORIES);

// 관리자 글 작성/수정 입력 — API와 에디터 폼이 공유
export const postInputSchema = z.object({
  title: z.string().trim().min(1, '제목을 입력해 주세요.').max(200, '제목이 너무 깁니다.'),
  slug: z.string().trim().max(120).default(''),
  content: z.string().default(''),
  excerpt: z.string().trim().max(300, '요약은 300자 이내로 입력해 주세요.').default(''),
  thumbnailUrl: z.union([z.literal(''), z.string().url()]).default(''),
  // 목록 필터·분류가 이 이름으로 묶이므로 정해진 이름만 받는다(GET /api/admin/categories).
  category: z
    .string()
    .trim()
    .min(1, '카테고리를 선택해 주세요.')
    .refine((c) => CATEGORY_SET.has(c), {
      message: `카테고리는 다음 중 하나여야 합니다: ${POST_CATEGORIES.join(', ')}`,
    }),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export type PostInput = z.infer<typeof postInputSchema>;
