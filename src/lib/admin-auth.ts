import { SignJWT, jwtVerify } from 'jose';

// 관리자 세션 JWT — jose 사용(미들웨어 Edge 런타임 호환)
export const ADMIN_COOKIE = 'webslab_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 28; // 4주

const AUDIENCE = 'webslab-admin';

/** 글 올리기 전용 키의 최소 길이 — 짧은 키는 설정돼 있어도 무시한다(추측 공격 방지). */
export const API_KEY_MIN_LENGTH = 32;

/** 길이가 같을 때 끝까지 비교(시간 차로 키를 알아내지 못하게). Edge 런타임이라 node:crypto 대신 직접. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * 외부 자동 발행용 `Authorization: Bearer <ADMIN_API_KEY>` 검사.
 * /api/admin/* 에만 쓴다(관리자 화면은 로그인 쿠키). 키가 없거나 짧으면 항상 거부.
 */
export function verifyApiKey(authorization: string | null, expected = process.env.ADMIN_API_KEY): boolean {
  if (!expected || expected.length < API_KEY_MIN_LENGTH || !authorization) return false;
  const m = /^Bearer\s+(\S+)$/i.exec(authorization.trim());
  return m ? constantTimeEqual(m[1], expected) : false;
}

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
