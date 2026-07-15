// GA4 Data API 연동 (서버 전용) — 관리자 통계 탭 방문 현황.
//
// 무료 한도(속성당 25,000요청/일) 안전 설계:
//  - 방문 통계 번들은 1시간 캐시 → 하루 최대 ~96회 호출
//  - 실시간 활성 사용자는 60초 캐시 → 관리자 화면을 하루 종일 열어둬도 ~1,440회
//  - 합계 여유율 90%+ — 사실상 영구 무료
//
// 인증: 서비스 계정 JWT(RS256, jose) → 액세스 토큰 교환. googleapis 패키지 불필요.
// 필요 env: GA4_SERVICE_ACCOUNT_KEY_B64 (키 JSON의 base64), GA4_PROPERTY_ID(선택 —
// 없으면 Admin API로 접근 가능한 첫 속성을 자동 탐색).

import { SignJWT, importPKCS8 } from 'jose';

type ServiceKey = {
  client_email: string;
  private_key: string;
  token_uri: string;
};

type ReportRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };

export type Ga4Stats = {
  propertyId: string;
  fetchedAt: string;
  summary: { label: string; users: number; pageViews: number }[];
  topPages: { path: string; title: string; views: number }[];
  channels: { channel: string; sessions: number }[];
  leads30d: number;
};

const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const STATS_TTL_MS = 60 * 60 * 1000; // 1시간
const REALTIME_TTL_MS = 60 * 1000; // 60초

function loadKey(): ServiceKey | null {
  const b64 = process.env.GA4_SERVICE_ACCOUNT_KEY_B64;
  if (!b64) return null;
  try {
    return JSON.parse(Buffer.from(b64, 'base64').toString('utf8')) as ServiceKey;
  } catch {
    console.error('[ga4] GA4_SERVICE_ACCOUNT_KEY_B64 파싱 실패');
    return null;
  }
}

export function ga4Configured(): boolean {
  return !!process.env.GA4_SERVICE_ACCOUNT_KEY_B64;
}

// ---- 액세스 토큰 (55분 캐시) ----
let tokenCache: { token: string; expires: number } | null = null;

async function getToken(key: ServiceKey): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expires) return tokenCache.token;
  const pk = await importPKCS8(key.private_key, 'RS256');
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(key.client_email)
    .setAudience(key.token_uri)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(pk);
  const res = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${jwt}`,
  });
  const data = (await res.json()) as { access_token?: string; error_description?: string };
  if (!res.ok || !data.access_token) throw new Error(`토큰 발급 실패: ${data.error_description ?? res.status}`);
  tokenCache = { token: data.access_token, expires: Date.now() + 55 * 60 * 1000 };
  return data.access_token;
}

// ---- 속성 ID (env 우선, 없으면 Admin API 자동 탐색 후 고정) ----
let discoveredProperty: string | null = null;

async function getPropertyId(token: string): Promise<string> {
  const envId = process.env.GA4_PROPERTY_ID;
  if (envId) return envId.replace(/^properties\//, '');
  if (discoveredProperty) return discoveredProperty;
  const res = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = (await res.json()) as {
    error?: { message: string };
    accountSummaries?: { propertySummaries?: { property: string }[] }[];
  };
  if (data.error) throw new Error(`속성 탐색 실패: ${data.error.message}`);
  const prop = data.accountSummaries?.flatMap((a) => a.propertySummaries ?? [])[0]?.property;
  if (!prop) throw new Error('서비스 계정에 연결된 GA4 속성이 없습니다. GA 속성 액세스 관리에서 뷰어 권한을 부여하세요.');
  discoveredProperty = prop.replace(/^properties\//, '');
  return discoveredProperty;
}

async function runReport(token: string, propertyId: string, body: Record<string, unknown>): Promise<ReportRow[]> {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { error?: { message: string }; rows?: ReportRow[] };
  if (data.error) throw new Error(data.error.message);
  return data.rows ?? [];
}

const num = (row: ReportRow | undefined, i: number) => Number(row?.metricValues?.[i]?.value ?? 0);

// ---- 방문 통계 번들 (1시간 캐시) ----
let statsCache: { data: Ga4Stats; expires: number } | null = null;

export async function getGa4Stats(): Promise<Ga4Stats | { error: string }> {
  if (statsCache && Date.now() < statsCache.expires) return statsCache.data;
  const key = loadKey();
  if (!key) return { error: 'GA4_SERVICE_ACCOUNT_KEY_B64 환경변수가 설정되지 않았습니다.' };
  try {
    const token = await getToken(key);
    const propertyId = await getPropertyId(token);

    const [summaryRows, pageRows, channelRows, leadRows] = await Promise.all([
      // 오늘/7일/30일 — 날짜범위 3개를 한 요청으로
      runReport(token, propertyId, {
        dateRanges: [
          { startDate: 'today', endDate: 'today', name: 'today' },
          { startDate: '7daysAgo', endDate: 'today', name: 'd7' },
          { startDate: '30daysAgo', endDate: 'today', name: 'd30' },
        ],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        dimensions: [{ name: 'dateRange' }],
      }),
      runReport(token, propertyId, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      runReport(token, propertyId, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8,
      }),
      runReport(token, propertyId, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: { fieldName: 'eventName', stringFilter: { value: 'contact_form_submit' } },
        },
      }),
    ]);

    const byRange = (name: string) =>
      summaryRows.find((r) => r.dimensionValues?.[0]?.value === name);
    const data: Ga4Stats = {
      propertyId,
      fetchedAt: new Date().toISOString(),
      summary: [
        { label: '오늘', users: num(byRange('today'), 0), pageViews: num(byRange('today'), 1) },
        { label: '최근 7일', users: num(byRange('d7'), 0), pageViews: num(byRange('d7'), 1) },
        { label: '최근 30일', users: num(byRange('d30'), 0), pageViews: num(byRange('d30'), 1) },
      ],
      topPages: pageRows.map((r) => ({
        path: r.dimensionValues?.[0]?.value ?? '',
        title: r.dimensionValues?.[1]?.value ?? '',
        views: num(r, 0),
      })),
      channels: channelRows.map((r) => ({
        channel: r.dimensionValues?.[0]?.value ?? '',
        sessions: num(r, 0),
      })),
      leads30d: num(leadRows[0], 0),
    };
    statsCache = { data, expires: Date.now() + STATS_TTL_MS };
    return data;
  } catch (err) {
    console.error('[ga4]', err);
    return { error: err instanceof Error ? err.message : 'GA4 데이터를 불러오지 못했습니다.' };
  }
}

// ---- 실시간 활성 사용자 (60초 캐시) ----
let realtimeCache: { users: number; expires: number } | null = null;

export async function getRealtimeUsers(): Promise<number | null> {
  if (realtimeCache && Date.now() < realtimeCache.expires) return realtimeCache.users;
  const key = loadKey();
  if (!key) return null;
  try {
    const token = await getToken(key);
    const propertyId = await getPropertyId(token);
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: [{ name: 'activeUsers' }] }),
      },
    );
    const data = (await res.json()) as { error?: { message: string }; rows?: ReportRow[] };
    if (data.error) throw new Error(data.error.message);
    const users = num(data.rows?.[0], 0);
    realtimeCache = { users, expires: Date.now() + REALTIME_TTL_MS };
    return users;
  } catch (err) {
    console.error('[ga4:realtime]', err);
    return null;
  }
}
