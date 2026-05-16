import { brand } from '@/config/brand';
import { absoluteUrl } from '@/config/site';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    alternateName: brand.nameKo,
    url: brand.url,
    logo: absoluteUrl('/images/logo.png'),
    email: brand.email,
    telephone: brand.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.streetAddress,
      addressLocality: brand.address.addressLocality,
      addressRegion: brand.address.addressRegion,
      postalCode: brand.address.postalCode,
      addressCountry: brand.address.addressCountry,
    },
    sameAs: Object.values(brand.social).filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand.name,
    alternateName: brand.nameKo,
    url: brand.url,
    description: brand.description,
    inLanguage: 'ko',
    publisher: {
      '@type': 'Organization',
      name: brand.name,
    },
  };
}

type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
