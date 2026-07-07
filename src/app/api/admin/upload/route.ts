import { NextResponse } from 'next/server';
import { cloudinaryConfigured, uploadImageBuffer } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

// 에디터 본문 이미지 + 썸네일 공용 업로드 (Cloudinary)
export async function POST(req: Request) {
  try {
    if (!cloudinaryConfigured()) {
      console.error('[admin:upload] CLOUDINARY_URL missing');
      return NextResponse.json({ error: '이미지 업로드가 설정되지 않았습니다.' }, { status: 500 });
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드할 수 있습니다.' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '이미지는 8MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageBuffer(buffer);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('[admin:upload]', err);
    return NextResponse.json({ error: '이미지 업로드에 실패했습니다.' }, { status: 500 });
  }
}
