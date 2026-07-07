import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin-auth';

// /admin·/api/admin 전체 보호. 로그인 화면/로그인 API만 공개.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/api/admin/login') return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const authed = token ? await verifyAdminToken(token) : false;

  if (pathname === '/admin/login') {
    if (authed) return NextResponse.redirect(new URL('/admin/posts', req.url));
    return NextResponse.next();
  }

  if (authed) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/admin/login', req.url));
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
