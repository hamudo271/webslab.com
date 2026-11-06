import { brand, brandSameAs } from '@/config/brand';
import { absoluteUrl, siteConfig } from '@/config/site';
import type { Author } from '@/data/authors';

/** 검색 결과에 보일 대표 이름은 한국어 '웹스랩'. 영문 표기·도메인은 다른 이름으로 둔다(구글 사이트 이름 가이드). */
const SITE_NAME = brand.nameKo;
const SITE_ALT_NAMES = [brand.name, brand.domain];

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${brand.url}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAMES,
    url: brand.url,
    logo: absoluteUrl('/images/logo.png'),
    email: brand.email,
    telephone: brand.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.streetAddress,
      addressLocality: brand.address.addressLocality,
      addressRegion: brand.address.addressRegion,
      postalCode: brand.address.postalCode || undefined,
      addressCountry: brand.address.addressCountry,
    },
    sameAs: brandSameAs,
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${brand.url}/#localbusiness`,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAMES,
    description: brand.description,
    url: brand.url,
    image: absoluteUrl(siteConfig.defaultOgImage),
    logo: absoluteUrl('/images/logo.png'),
    email: brand.email,
    telephone: brand.phone,
    priceRange: '₩₩',
    areaServed: { '@type': 'Country', name: 'South Korea' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.streetAddress,
      addressLocality: brand.address.addressLocality,
      addressRegion: brand.address.addressRegion,
      postalCode: brand.address.postalCode || undefined,
      addressCountry: brand.address.addressCountry,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00',
      },
    ],
    // 네이버 지도/플레이스 업체 페이지 — 지역성(로컬) 신호
    ...(brand.naverPlaceUrl ? { hasMap: brand.naverPlaceUrl } : {}),
    sameAs: brandSameAs,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${brand.url}/#website`,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAMES,
    url: `${brand.url}/`,
    description: brand.description,
    inLanguage: 'ko',
    publisher: { '@id': `${brand.url}/#organization` },
  };
}

type WebPageInput = {
  path: string;
  name: string;
  description: string;
  /** 최초 공개일이 확인되지 않는 문서는 생략(추정값을 넣지 않는다) */
  datePublished?: string;
  dateModified: string;
};

// 칼럼이 아닌 일반 페이지의 발행일/수정일 신호 (Article은 articleJsonLd 사용)
export function webPageJsonLd(p: WebPageInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(p.path)}#webpage`,
    url: absoluteUrl(p.path),
    name: p.name,
    description: p.description,
    inLanguage: 'ko',
    ...(p.datePublished ? { datePublished: p.datePublished } : {}),
    dateModified: p.dateModified,
    isPartOf: { '@type': 'WebSite', '@id': `${brand.url}/#website`, name: SITE_NAME, url: `${brand.url}/` },
    publisher: { '@type': 'Organization', '@id': `${brand.url}/#organization`, name: SITE_NAME, url: brand.url },
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
      name: SITE_NAME,
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
      name: SITE_NAME,
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
      name: SITE_NAME,
      url: brand.url,
    },
  };
}

type CaseStudyInput = {
  path: string;
  name: string;
  description: string;
  image?: string;
  year: number;
  client: string;
  siteUrl?: string;
  keywords: string[];
};

/** 제작사례 상세 — 웹스랩이 만든 사이트(CreativeWork). 대상 고객사 사이트는 about으로 잇는다. */
export function caseStudyJsonLd(c: CaseStudyInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${absoluteUrl(c.path)}#case`,
    name: c.name,
    description: c.description,
    url: absoluteUrl(c.path),
    ...(c.image ? { image: absoluteUrl(c.image) } : {}),
    dateCreated: String(c.year),
    keywords: c.keywords.join(', '),
    creator: { '@type': 'Organization', name: SITE_NAME, url: brand.url },
    about: { '@type': 'Organization', name: c.client, ...(c.siteUrl ? { url: c.siteUrl } : {}) },
  };
}
