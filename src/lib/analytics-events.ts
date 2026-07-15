// 전환 이벤트 발행 유틸.
// dataLayer(GTM)와 gtag(GA4 직접 설치)에 항상 전달하고,
// 문의 제출(리드)은 Meta 픽셀 표준 이벤트(Lead)로도 전달한다.
// 각 도구가 미설치(전역 함수 없음)면 조용히 건너뜀 — env 게이팅과 동일한 철학.

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

function push(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as { dataLayer?: unknown[]; gtag?: Gtag };
  if (Array.isArray(w.dataLayer)) w.dataLayer.push(event);
  if (typeof w.gtag === 'function') {
    const { event: name, ...params } = event;
    w.gtag('event', name as string, params);
  }
}

function fbqTrack(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as { fbq?: Fbq };
  if (typeof w.fbq === 'function') w.fbq('track', name, params);
}

export function trackContactFormSubmit(args: { category: string }): void {
  push({ event: 'contact_form_submit', category: args.category });
  // Meta 표준 리드 이벤트 — 광고 전환 최적화의 기준 신호
  fbqTrack('Lead', { content_category: args.category });
}

export function trackWhitepaperDownload(args: { slug: string }): void {
  push({ event: 'whitepaper_download', whitepaper_slug: args.slug });
}

export function trackPillarToContact(args: { fromPath: string }): void {
  push({ event: 'pillar_to_contact', from_path: args.fromPath });
}
