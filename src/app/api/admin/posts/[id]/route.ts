import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { computePublishedAt, uniqueSlug } from '@/lib/posts';
import { postInputSchema } from '@/lib/validators/post';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: { id: string } };

function parseId(raw: string): number | null {
  const id = Number.parseInt(raw, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// 단건 (수정 폼용 전체 필드)
export async function GET(_req: Request, { params }: Params) {
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    console.error('[admin:posts:get]', err);
    return NextResponse.json({ error: '조회에 실패했습니다.' }, { status: 500 });
  }
}

// 수정 (발행/임시저장 토글 포함)
export async function PUT(req: Request, { params }: Params) {
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });

    const body = (await req.json()) as unknown;
    const parsed = postInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? '입력값을 확인해 주세요.' },
        { status: 400 },
      );
    }
    const d = parsed.data;

    const slug = await uniqueSlug(d.slug || d.title, id);
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: d.title,
        slug,
        content: d.content,
        excerpt: d.excerpt || null,
        thumbnailUrl: d.thumbnailUrl || null,
        category: d.category,
        status: d.status,
        publishedAt: computePublishedAt(existing, d.status),
      },
    });
    return NextResponse.json({ post });
  } catch (err) {
    console.error('[admin:posts:update]', err);
    return NextResponse.json({ error: '글 수정에 실패했습니다.' }, { status: 500 });
  }
}

// 삭제
export async function DELETE(_req: Request, { params }: Params) {
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin:posts:delete]', err);
    return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
  }
}
