function push(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!Array.isArray((window as { dataLayer?: unknown[] }).dataLayer)) return;
  (window as { dataLayer: unknown[] }).dataLayer.push(event);
}

export function trackContactFormSubmit(args: { category: string }): void {
  push({ event: 'contact_form_submit', category: args.category });
}

export function trackWhitepaperDownload(args: { slug: string }): void {
  push({ event: 'whitepaper_download', whitepaper_slug: args.slug });
}

export function trackPillarToContact(args: { fromPath: string }): void {
  push({ event: 'pillar_to_contact', from_path: args.fromPath });
}
