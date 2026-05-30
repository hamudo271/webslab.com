import { describe, it, expect, beforeEach } from 'vitest';
import {
  trackContactFormSubmit,
  trackWhitepaperDownload,
  trackPillarToContact,
} from './analytics-events';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

beforeEach(() => {
  window.dataLayer = [];
});

describe('trackContactFormSubmit', () => {
  it('pushes a contact_form_submit event with category', () => {
    trackContactFormSubmit({ category: '신규 홈페이지 제작' });
    expect(window.dataLayer).toContainEqual({
      event: 'contact_form_submit',
      category: '신규 홈페이지 제작',
    });
  });

  it('is a no-op when dataLayer is undefined', () => {
    // @ts-expect-error - intentionally clearing
    delete window.dataLayer;
    expect(() => trackContactFormSubmit({ category: 'x' })).not.toThrow();
  });
});

describe('trackWhitepaperDownload', () => {
  it('pushes a whitepaper_download event with slug', () => {
    trackWhitepaperDownload({ slug: 'modern-stack-for-corporate-site' });
    expect(window.dataLayer).toContainEqual({
      event: 'whitepaper_download',
      whitepaper_slug: 'modern-stack-for-corporate-site',
    });
  });
});

describe('trackPillarToContact', () => {
  it('pushes pillar_to_contact with referrer path', () => {
    trackPillarToContact({ fromPath: '/column/renewal-vs-rebuild' });
    expect(window.dataLayer).toContainEqual({
      event: 'pillar_to_contact',
      from_path: '/column/renewal-vs-rebuild',
    });
  });
});
