import { brand } from '@/config/brand';
import { absoluteUrl } from '@/config/site';
import type { Author } from '@/data/authors';

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

export function personJsonLd(author: Author) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    alternateName: author.nameKo,
    jobTitle: author.role,
    description: author.bio,
    url: author.profileUrl,
    sameAs: author.sameAs,
    worksFor: {
      '@type': 'Organization',
      name: 'websLAB',
    },
  };
}

type ArticleInput = {
  headline: string;
  description: string;
  slug: string;
  datePublished: string; // ISO date
  dateModified?: string;
  image: string; // absolute URL
  author: Author;
};

export function articleJsonLd(a: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.headline,
    description: a.description,
    image: a.image,
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    author: {
      '@type': 'Person',
      name: a.author.name,
      url: a.author.profileUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: brand.name,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/images/logo.png') },
    },
    mainEntityOfPage: absoluteUrl(`/column/${a.slug}`),
    inLanguage: 'ko',
  };
}

type Faq = { question: string; answer: string };

export function faqPageJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

type HowToStep = { name: string; text: string };
type HowToInput = { name: string; description: string; steps: HowToStep[] };

export function howToJsonLd(h: HowToInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: h.name,
    description: h.description,
    step: h.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

type ServiceInput = {
  name: string;
  description: string;
  serviceType: string;
  areaServed: string;
};

export function serviceJsonLd(s: ServiceInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    serviceType: s.serviceType,
    areaServed: s.areaServed,
    provider: {
      '@type': 'Organization',
      name: brand.name,
      url: brand.url,
    },
  };
}
