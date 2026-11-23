import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { ADMIN_COOKIE, SESSION_MAX_AGE, signAdminToken } from '@/lib/admin-auth';
import { clientIp, LIMITS, takeToken } from '@/lib/spam-guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  try {
    // 비밀번호 대입 공격 차단 — IP당 15분에 10번까지만 시도
    const ip = clientIp(req.headers);
    if (!takeToken(`admin-login:${ip}`, LIMITS.adminLogin.limit, LIMITS.adminLogin.windowMs)) {
      console.warn('[admin:login] rate-limit', ip);
      return NextResponse.json(
        { error: '로그인 시도가 너무 많습니다. 15분 뒤에 다시 시도해 주세요.' },
        { status: 429 },
      );
    }
    const body = (await req.json()) as Record<string, unknown>;
    const password = typeof body.password === 'string' ? body.password : '';

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      console.error('[admin:login] ADMIN_PASSWORD missing');
      return NextResponse.json({ error: '관리자 인증이 설정되지 않았습니다.' }, { status: 500 });
    }

    if (!password || !safeEqual(password, expected)) {
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
