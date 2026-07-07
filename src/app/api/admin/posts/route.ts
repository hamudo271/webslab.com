import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { computePublishedAt, uniqueSlug } from '@/lib/posts';
import { postInputSchema } from '@/lib/validators/post';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 목록 (관리자: 전체 상태, 최신 수정순)
export async function GET() {
  try {
    const items = await prisma.post.findMany({
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        category: true,
        publishedAt: true,
        updatedAt: true,
        viewCount: true,
      },
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error('[admin:posts:list]', err);
    return NextResponse.json({ error: '목록 조회에 실패했습니다.' }, { status: 500 });
  }
}

// 생성
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const parsed = postInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? '입력값을 확인해 주세요.' },
        { status: 400 },
      );
    }
    const d = parsed.data;

    const slug = await uniqueSlug(d.slug || d.title);
    const post = await prisma.post.create({
      data: {
        title: d.title,
        slug,
        content: d.content,
        excerpt: d.excerpt || null,
        thumbnailUrl: d.thumbnailUrl || null,
        category: d.category,
        status: d.status,
        publishedAt: computePublishedAt(null, d.status),
      },
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error('[admin:posts:create]', err);
    return NextResponse.json({ error: '글 저장에 실패했습니다.' }, { status: 500 });
  }
}
