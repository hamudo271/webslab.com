import { NextResponse } from 'next/server';
import { POST_CATEGORIES } from '@/data/postCategories';

export const runtime = 'nodejs';

// 글 저장 API의 category에 쓸 수 있는 이름 목록 (외부 자동 발행용)
export function GET() {
  return NextResponse.json({ categories: POST_CATEGORIES });
}
