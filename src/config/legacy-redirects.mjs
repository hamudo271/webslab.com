// 예전 사이트(2026-07 이전) 주소 → 지금 페이지 301. next.config.mjs의 redirects()가 쓴다.
// Search Console '찾을 수 없음(404)'에 남은 주소 중 이어받을 페이지가 분명한 것만 옮긴다.
// 이어받을 곳이 없는 잘못된 주소(예: 본문 '4.9/5.0'이 링크로 잡힌 /5.0)는 404 그대로 둔다 — 홈으로 돌리면 soft 404가 된다.
// 대상 경로가 실제로 있는지는 src/config/legacy-redirects.test.ts가 검사한다.

/** @type {{ source: string; destination: string }[]} */
export const LEGACY_REDIRECTS = [
  // 정리된 칼럼 → 같은 주제의 지금 칼럼
  { source: '/column/cms-strategy-for-marketing-team', destination: '/column/corporate-website-cms' },
  { source: '/column/seo-checklist-for-b2b', destination: '/column/corporate-website-seo-checklist' },
  { source: '/column/why-business-website-matters', destination: '/column' },
  // 내린 사례 → 포트폴리오 목록 (실제 사례만 남긴 뒤 빠진 주소)
  { source: '/portfolio/oecd-tax', destination: '/portfolio' },
  { source: '/portfolio/novado', destination: '/portfolio' },
  // 예전 자료 받기 페이지·회사소개서 → 지금 회사소개서
  { source: '/whitepaper', destination: '/assets/webslab/files/webslab-company-profile.pdf' },
  { source: '/files/websLAB-brochure.pdf', destination: '/assets/webslab/files/webslab-company-profile.pdf' },
  { source: '/files/websLAB-brochure.pptx', destination: '/assets/webslab/files/webslab-company-profile.pdf' },
];
