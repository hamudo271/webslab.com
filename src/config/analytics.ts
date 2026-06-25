const PLACEHOLDER_PATTERNS = [
  'XXXXXXX',
  'XXXXXXXXXX',
  'replace_me',
  '0000000',
  'xxxxxxxxxxxxxxxx',
  'xxxxxxxxxx',
];

function isReal(value: string | undefined): boolean {
  if (!value || value.trim() === '') return false;
  return !PLACEHOLDER_PATTERNS.some((p) => value.includes(p));
}

export const analytics = {
  gtm: {
    id: process.env.NEXT_PUBLIC_GTM_ID ?? '',
    enabled: isReal(process.env.NEXT_PUBLIC_GTM_ID),
  },
  ga4: {
    id: process.env.NEXT_PUBLIC_GA4_ID ?? '',
    enabled: isReal(process.env.NEXT_PUBLIC_GA4_ID),
  },
  naver: {
    id: process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID ?? '',
    enabled: isReal(process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID),
  },
  clarity: {
    id: process.env.NEXT_PUBLIC_CLARITY_ID ?? '',
    enabled: isReal(process.env.NEXT_PUBLIC_CLARITY_ID),
  },
  hotjar: {
    id: process.env.NEXT_PUBLIC_HOTJAR_ID ?? '',
    enabled: isReal(process.env.NEXT_PUBLIC_HOTJAR_ID),
  },
  channelIO: {
    key: process.env.NEXT_PUBLIC_CHANNEL_IO_KEY ?? '',
    enabled: isReal(process.env.NEXT_PUBLIC_CHANNEL_IO_KEY),
  },
  mixpanel: {
    token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '',
    enabled: isReal(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN),
  },
  verification: {
    naver:
      process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ??
      'f0d0c06df7f3c48789a39547b8fab344848e1de9',
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
      '_ugyViTZzexJlVfe73g-ZrkAepJBh0X_1QPIJiuH95c',
  },
} as const;
