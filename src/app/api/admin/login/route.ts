import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ADMIN_COOKIE, SESSION_MAX_AGE, signAdminToken } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const password = typeof body.password === 'string' ? body.password : '';

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      console.error('[admin:login] ADMIN_PASSWORD_HASH missing');
      return NextResponse.json({ error: '관리자 인증이 설정되지 않았습니다.' }, { status: 500 });
    }

    if (!password || !(await bcrypt.compare(password, hash))) {
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, await signAdminToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch (err) {
    console.error('[admin:login]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
