import { SignJWT, jwtVerify } from 'jose';

// 관리자 세션 JWT — jose 사용(미들웨어 Edge 런타임 호환)
export const ADMIN_COOKIE = 'webslab_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7일

const AUDIENCE = 'webslab-admin';

function secretKey(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error('ADMIN_JWT_SECRET 환경변수가 없습니다.');
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secretKey(), { audience: AUDIENCE });
    return true;
  } catch {
    return false;
  }
}
