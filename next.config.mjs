import { LEGACY_REDIRECTS } from './src/config/legacy-redirects.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // 최적화 이미지 Cache-Control 수명(31일). 소스 교체 시 파일 해시가 바뀌므로 길게 잡아도 안전.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' }, // 칼럼 썸네일/본문 이미지
    ],
  },
  // 정적 파일 캐시 — 기본값(max-age=0)이면 Cloudflare가 요청마다 원서버에 다시 확인(REVALIDATED)해 느렸다.
  // CSS·JS는 ?v=로 버전이 바뀌고, 이미지·폰트는 거의 바뀌지 않는다. 30일 + 만료 뒤 1주는 옛 사본을 쓰며 갱신.
  async headers() {
    const value = 'public, max-age=2592000, stale-while-revalidate=604800';
    const cache = ['/assets/:path*', '/wp-content/:path*', '/wp-includes/:path*', '/images/:path*', '/fonts/:path*', '/og/:path*', '/site/:path*'].map(
      (source) => ({ source, headers: [{ key: 'Cache-Control', value }] }),
    );
    // 기본 보안 헤더(전 경로) — 화면 동작은 그대로. HSTS는 하위 도메인을 묶지 않는다(includeSubDomains 없음).
    // X-Frame-Options: 다른 사이트가 우리 페이지를 iframe으로 덮어씌우는 클릭재킹 차단(사례 뷰어가 남의 사이트를 띄우는 건 무관).
    const security = {
      source: '/:path*',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
      ],
    };
    return [security, ...cache];
  },
  // 예전 사이트 주소 301 (Search Console 404 정리) — 목록은 src/config/legacy-redirects.mjs
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, statusCode: 301 }));
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // 리뉴얼 정적 페이지(src/site/pages/*.html)를 문자열로 번들 — 라우트 핸들러가 변환해 응답한다.
  // 런타임 파일 읽기가 없어 standalone 출력에서도 경로 추적 걱정이 없다.
  webpack(config) {
    config.module.rules.push({ test: /\.html$/, type: 'asset/source' });
    return config;
  },
};

export default nextConfig;
