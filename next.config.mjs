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
