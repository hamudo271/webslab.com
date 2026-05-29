# SEO/AEO Technical Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the M1 (Foundation) deliverables from the SEO/AEO PRD — extended Schema.org coverage, dynamic column post route with metadata + JSON-LD injection, sitemap split, robots/llms.txt updates, and GA4 conversion event helpers — so that the M2~M6 content production effort lands on indexable, AI-citable, measurable pages.

**Architecture:** Add pure schema generators to `src/lib/jsonld.ts` and matching React wrappers in `src/components/seo/`. Build a single `/column/[slug]` dynamic route that composes Article + FAQPage + HowTo + Person JSON-LD per post, renders TL;DR / Direct Answer / Author byline / FAQ / RelatedPosts content components, and uses Next.js `generateStaticParams` + `generateMetadata` for SEO. Split the existing single sitemap into three (pages / articles / cases) plus an index. Extend robots.ts with explicit AI bot rules and add a fresh `/llms.txt` route. Introduce Vitest for the pure functions because the project currently has no test framework.

**Tech Stack:** Next.js 14.2.35 (App Router), TypeScript, Tailwind CSS, pnpm, Resend (existing), Vitest 2.x + `@vitejs/plugin-react` (new). Visual verification via the existing Claude Preview MCP tools.

**Scope (in / out):**
- **In scope (this plan):** Vitest setup, schema generators + wrappers, content components (Tldr, DirectAnswer, AuthorByline, FaqAccordion, RelatedPosts), `ColumnPost` type extension + first sample article body, `/column/[slug]` route, sitemap split, robots.ts AI bot rules, `/llms.txt`, GA4 conversion event helpers wired into the existing contact form.
- **Out of scope (separate planning):** Pillar/Cluster/Case content writing (operational), guest post outreach (operational), Ahrefs/Looker Studio setup (tool config), Pretendard subsetting (M2 perf optimization), `/whitepaper/[slug]` download gate (M4 deliverable), Headless CMS decision (M3 open question).

---

## File Structure

**New files:**
- `vitest.config.ts`
- `src/test/setup.ts`
- `src/data/authors.ts`
- `src/data/columnPosts.ts` (extend existing — adds body, faqs, howTo, related)
- `src/lib/jsonld.ts` (extend existing — adds Article/FAQ/HowTo/Service/Person generators)
- `src/lib/jsonld.test.ts`
- `src/lib/analytics-events.ts`
- `src/lib/analytics-events.test.ts`
- `src/components/seo/PersonJsonLd.tsx`
- `src/components/seo/ArticleJsonLd.tsx`
- `src/components/seo/FaqJsonLd.tsx`
- `src/components/seo/HowToJsonLd.tsx`
- `src/components/seo/ServiceJsonLd.tsx`
- `src/components/content/Tldr.tsx`
- `src/components/content/DirectAnswer.tsx`
- `src/components/content/AuthorByline.tsx`
- `src/components/content/FaqAccordion.tsx`
- `src/components/content/RelatedPosts.tsx`
- `src/app/column/[slug]/page.tsx`
- `src/app/sitemap-pages.xml/route.ts`
- `src/app/sitemap-articles.xml/route.ts`
- `src/app/sitemap-cases.xml/route.ts`
- `src/app/llms.txt/route.ts`

**Modified files:**
- `package.json` — add Vitest scripts + deps
- `src/app/sitemap.ts` — convert to sitemap-index
- `src/app/robots.ts` — add AI bot rules + point at sitemap-index
- `src/app/column/page.tsx` — link cards to `/column/[slug]`
- `src/components/contact/ContactForm.tsx` (or equivalent) — call `trackContactFormSubmit()` on success

---

## Task 1: Set up Vitest test framework

The project currently has `lint`, `typecheck`, and `format` but no test runner. Tasks below assume Vitest is available. This task establishes it with a sanity test.

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json` (scripts + devDependencies)

- [ ] **Step 1: Install Vitest deps**

```bash
pnpm add -D vitest@^2 @vitejs/plugin-react@^4 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^25
```

- [ ] **Step 2: Add test scripts to package.json**

In `package.json` `scripts`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
```

- [ ] **Step 4: Create `src/test/setup.ts`**

```typescript
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Write a sanity test at `src/test/sanity.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';

describe('vitest setup', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
pnpm test
```

Expected output: `1 passed`.

- [ ] **Step 7: Verify typecheck still passes**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts src/test/
git commit -m "chore: add Vitest test framework"
```

---

## Task 2: Author identity data + Person schema generator

E-E-A-T (Experience/Expertise/Authoritativeness/Trustworthiness) requires identifiable authors. This task adds a typed author registry and the Person JSON-LD generator + wrapper. Initial author is the representative; the type supports multiple authors for future use.

**Files:**
- Create: `src/data/authors.ts`
- Modify: `src/lib/jsonld.ts` (add `personJsonLd`)
- Create: `src/lib/jsonld.test.ts`
- Create: `src/components/seo/PersonJsonLd.tsx`

- [ ] **Step 1: Write failing test for `personJsonLd`**

Append to `src/lib/jsonld.test.ts` (or create):

```typescript
import { describe, it, expect } from 'vitest';
import { personJsonLd } from './jsonld';
import type { Author } from '@/data/authors';

const sample: Author = {
  id: 'representative',
  name: '홍길동',
  nameKo: '홍길동',
  role: '대표',
  bio: '15년차 웹 에이전시 대표',
  profileUrl: 'https://webslab.co.kr/about',
  sameAs: ['https://linkedin.com/in/example'],
};

describe('personJsonLd', () => {
  it('returns a valid Person schema', () => {
    const ld = personJsonLd(sample);
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('Person');
    expect(ld.name).toBe('홍길동');
    expect(ld.jobTitle).toBe('대표');
    expect(ld.url).toBe('https://webslab.co.kr/about');
    expect(ld.sameAs).toEqual(['https://linkedin.com/in/example']);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test
```

Expected: `Failed to resolve import` for `personJsonLd` and `Author`.

- [ ] **Step 3: Create `src/data/authors.ts`**

```typescript
export type Author = {
  id: string;
  name: string;
  nameKo: string;
  role: string;
  bio: string;
  profileUrl: string;
  sameAs: string[];
};

export const representative: Author = {
  id: 'representative',
  name: '대표자', // Replace with real name when finalized in brand.legal.representativeName
  nameKo: '대표자',
  role: '대표',
  bio: '기업 홈페이지 제작·리뉴얼 전문가.',
  profileUrl: 'https://webslab.co.kr/about',
  sameAs: [], // Add LinkedIn / blog URLs when ready
};

export const authors: Record<string, Author> = {
  representative,
};

export function getAuthor(id: string): Author {
  const a = authors[id];
  if (!a) throw new Error(`Author not found: ${id}`);
  return a;
}
```

- [ ] **Step 4: Add `personJsonLd` to `src/lib/jsonld.ts`**

Append:

```typescript
import type { Author } from '@/data/authors';

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
```

- [ ] **Step 5: Run test — expect PASS**

```bash
pnpm test
```

- [ ] **Step 6: Create wrapper `src/components/seo/PersonJsonLd.tsx`**

```typescript
import { JsonLd } from './JsonLd';
import { personJsonLd } from '@/lib/jsonld';
import type { Author } from '@/data/authors';

export function PersonJsonLd({ author }: { author: Author }) {
  return <JsonLd id={`ld-person-${author.id}`} data={personJsonLd(author)} />;
}
```

- [ ] **Step 7: Typecheck + commit**

```bash
pnpm typecheck
git add src/data/authors.ts src/lib/jsonld.ts src/lib/jsonld.test.ts src/components/seo/PersonJsonLd.tsx
git commit -m "feat(seo): add Author registry + Person JSON-LD generator"
```

---

## Task 3: Article + FAQPage + HowTo + Service schema generators

Adds the four remaining schema types needed for column posts (Article + FAQ + HowTo) and the service page (Service).

**Files:**
- Modify: `src/lib/jsonld.ts`
- Modify: `src/lib/jsonld.test.ts`
- Create: `src/components/seo/ArticleJsonLd.tsx`
- Create: `src/components/seo/FaqJsonLd.tsx`
- Create: `src/components/seo/HowToJsonLd.tsx`
- Create: `src/components/seo/ServiceJsonLd.tsx`

- [ ] **Step 1: Write failing tests for all four generators**

Append to `src/lib/jsonld.test.ts`:

```typescript
import { articleJsonLd, faqPageJsonLd, howToJsonLd, serviceJsonLd } from './jsonld';

describe('articleJsonLd', () => {
  it('returns Article schema with author + datePublished', () => {
    const ld = articleJsonLd({
      headline: '리뉴얼 시기 판단 7가지 신호',
      description: '...',
      slug: 'renewal-timing-signals',
      datePublished: '2026-06-01',
      dateModified: '2026-06-01',
      image: 'https://webslab.co.kr/og/article.png',
      author: representative,
    });
    expect(ld['@type']).toBe('Article');
    expect(ld.headline).toBe('리뉴얼 시기 판단 7가지 신호');
    expect(ld.author).toMatchObject({ '@type': 'Person', name: '대표자' });
    expect(ld.publisher).toMatchObject({ '@type': 'Organization', name: 'websLAB' });
    expect(ld.mainEntityOfPage).toBe('https://webslab.co.kr/column/renewal-timing-signals');
  });
});

describe('faqPageJsonLd', () => {
  it('returns FAQPage schema from Q-A list', () => {
    const ld = faqPageJsonLd([
      { question: '리뉴얼 시기는 언제가 좋을까요?', answer: '평균 3~5년 주기를 권장합니다.' },
      { question: '비용은 얼마인가요?', answer: '규모별 3,000만~1억원 범위입니다.' },
    ]);
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: '리뉴얼 시기는 언제가 좋을까요?',
      acceptedAnswer: { '@type': 'Answer', text: '평균 3~5년 주기를 권장합니다.' },
    });
  });
});

describe('howToJsonLd', () => {
  it('returns HowTo schema with steps', () => {
    const ld = howToJsonLd({
      name: 'URL 마이그레이션 5단계',
      description: '...',
      steps: [
        { name: '기존 URL 목록 추출', text: 'sitemap.xml에서 모든 URL을 추출' },
        { name: '301 매핑', text: '구 URL을 신 URL로 매핑' },
      ],
    });
    expect(ld['@type']).toBe('HowTo');
    expect(ld.step).toHaveLength(2);
    expect(ld.step[0]).toMatchObject({ '@type': 'HowToStep', name: '기존 URL 목록 추출' });
  });
});

describe('serviceJsonLd', () => {
  it('returns Service schema for 홈페이지 리뉴얼', () => {
    const ld = serviceJsonLd({
      name: '기업 홈페이지 리뉴얼',
      description: '5년 이상 노후 사이트의 리뉴얼을 전담합니다.',
      serviceType: '웹사이트 리뉴얼',
      areaServed: 'KR',
    });
    expect(ld['@type']).toBe('Service');
    expect(ld.provider).toMatchObject({ '@type': 'Organization', name: 'websLAB' });
    expect(ld.areaServed).toBe('KR');
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test
```

Expected: import errors for the four new generators.

- [ ] **Step 3: Add generators to `src/lib/jsonld.ts`**

Append:

```typescript
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test
```

- [ ] **Step 5: Create the four wrapper components**

`src/components/seo/ArticleJsonLd.tsx`:
```typescript
import { JsonLd } from './JsonLd';
import { articleJsonLd } from '@/lib/jsonld';
import type { Author } from '@/data/authors';

type Props = {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  author: Author;
};

export function ArticleJsonLd(props: Props) {
  return <JsonLd id="ld-article" data={articleJsonLd(props)} />;
}
```

`src/components/seo/FaqJsonLd.tsx`:
```typescript
import { JsonLd } from './JsonLd';
import { faqPageJsonLd } from '@/lib/jsonld';

type Faq = { question: string; answer: string };

export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  return <JsonLd id="ld-faq" data={faqPageJsonLd(faqs)} />;
}
```

`src/components/seo/HowToJsonLd.tsx`:
```typescript
import { JsonLd } from './JsonLd';
import { howToJsonLd } from '@/lib/jsonld';

type HowToStep = { name: string; text: string };
type Props = { name: string; description: string; steps: HowToStep[] };

export function HowToJsonLd(props: Props) {
  return <JsonLd id="ld-howto" data={howToJsonLd(props)} />;
}
```

`src/components/seo/ServiceJsonLd.tsx`:
```typescript
import { JsonLd } from './JsonLd';
import { serviceJsonLd } from '@/lib/jsonld';

type Props = { name: string; description: string; serviceType: string; areaServed: string };

export function ServiceJsonLd(props: Props) {
  return <JsonLd id="ld-service" data={serviceJsonLd(props)} />;
}
```

- [ ] **Step 6: Inject ServiceJsonLd on the `/service` page**

In `src/app/service/page.tsx`, import and render the wrapper inside the JSX (after any existing `<BreadcrumbJsonLd />`):

```typescript
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd';

// inside the returned JSX, at the top:
<ServiceJsonLd
  name="기업 홈페이지 리뉴얼"
  description="5년 이상 노후 사이트의 디자인·기술 리뉴얼을 전담합니다. Next.js + Headless CMS 기반."
  serviceType="웹사이트 리뉴얼"
  areaServed="KR"
/>
```

- [ ] **Step 7: Typecheck + commit**

```bash
pnpm typecheck
git add src/lib/jsonld.ts src/lib/jsonld.test.ts src/components/seo/ src/app/service/page.tsx
git commit -m "feat(seo): add Article, FAQPage, HowTo, Service schema generators + wrappers"
```

---

## Task 4: Static content components — Tldr, DirectAnswer, AuthorByline

Three small presentational components used in every column post. Tldr and DirectAnswer are pure markup. AuthorByline reads from the author registry and renders + injects the Person JSON-LD.

**Files:**
- Create: `src/components/content/Tldr.tsx`
- Create: `src/components/content/DirectAnswer.tsx`
- Create: `src/components/content/AuthorByline.tsx`
- Create: `src/components/content/AuthorByline.test.tsx`

- [ ] **Step 1: Write failing test for AuthorByline**

Create `src/components/content/AuthorByline.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthorByline } from './AuthorByline';
import { representative } from '@/data/authors';

describe('AuthorByline', () => {
  it('renders author name and role', () => {
    render(<AuthorByline author={representative} publishedAt="2026-06-01" />);
    expect(screen.getByText(representative.name)).toBeInTheDocument();
    expect(screen.getByText(/대표/)).toBeInTheDocument();
  });

  it('renders formatted Korean date', () => {
    render(<AuthorByline author={representative} publishedAt="2026-06-01" />);
    expect(screen.getByText(/2026\.06\.01/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm test
```

- [ ] **Step 3: Create `src/components/content/Tldr.tsx`**

```typescript
type Props = { children: React.ReactNode };

export function Tldr({ children }: Props) {
  return (
    <aside
      role="note"
      aria-label="요약"
      className="my-8 rounded-lg border-l-4 border-primary bg-surface-light p-6"
    >
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
        TL;DR
      </h2>
      <div className="text-sm leading-relaxed text-text-secondary">{children}</div>
    </aside>
  );
}
```

- [ ] **Step 4: Create `src/components/content/DirectAnswer.tsx`**

```typescript
type Props = { children: React.ReactNode };

export function DirectAnswer({ children }: Props) {
  return (
    <p className="mt-6 text-lg font-medium leading-relaxed text-text-primary">
      <strong>한 줄 답</strong> · {children}
    </p>
  );
}
```

- [ ] **Step 5: Create `src/components/content/AuthorByline.tsx`**

```typescript
import Link from 'next/link';
import type { Author } from '@/data/authors';

type Props = { author: Author; publishedAt: string };

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function AuthorByline({ author, publishedAt }: Props) {
  return (
    <div className="flex items-center gap-3 border-t border-line py-6 text-sm text-text-secondary">
      <div>
        <Link href={author.profileUrl} className="font-medium text-text-primary hover:text-primary">
          {author.name}
        </Link>
        <span className="ml-2 text-text-muted">{author.role}</span>
      </div>
      <span className="text-text-muted">·</span>
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
    </div>
  );
}
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
pnpm test
```

- [ ] **Step 7: Typecheck + commit**

```bash
pnpm typecheck
git add src/components/content/
git commit -m "feat(content): add Tldr, DirectAnswer, AuthorByline components"
```

---

## Task 5: FaqAccordion + RelatedPosts widget

`FaqAccordion` is interactive (client component) using `useState` for open/close. `RelatedPosts` is a server component that takes slugs and renders linked cards using existing column post data.

**Files:**
- Create: `src/components/content/FaqAccordion.tsx`
- Create: `src/components/content/FaqAccordion.test.tsx`
- Create: `src/components/content/RelatedPosts.tsx`
- Create: `src/components/content/RelatedPosts.test.tsx`

- [ ] **Step 1: Write failing test for FaqAccordion**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FaqAccordion } from './FaqAccordion';

const sample = [
  { question: '리뉴얼 시기는?', answer: '3~5년 주기를 권장합니다.' },
  { question: '비용은?', answer: '3천만 ~ 1억원.' },
];

describe('FaqAccordion', () => {
  it('renders all questions visible, answers hidden initially', () => {
    render(<FaqAccordion faqs={sample} />);
    expect(screen.getByText('리뉴얼 시기는?')).toBeInTheDocument();
    expect(screen.queryByText('3~5년 주기를 권장합니다.')).not.toBeVisible();
  });

  it('expands answer when question is clicked', () => {
    render(<FaqAccordion faqs={sample} />);
    fireEvent.click(screen.getByText('리뉴얼 시기는?'));
    expect(screen.getByText('3~5년 주기를 권장합니다.')).toBeVisible();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test
```

- [ ] **Step 3: Create `src/components/content/FaqAccordion.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

type Faq = { question: string; answer: string };

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="my-12 border-t border-line pt-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tightest">자주 묻는 질문</h2>
      <ul className="divide-y divide-line">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <li key={i}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-center justify-between py-5 text-left text-base font-medium hover:text-primary"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span>{f.question}</span>
                <ChevronDown
                  size={20}
                  className={cn('transition-transform', isOpen && 'rotate-180')}
                />
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                hidden={!isOpen}
                className="pb-5 text-sm leading-relaxed text-text-secondary"
              >
                {f.answer}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test
```

- [ ] **Step 5: Write failing test for RelatedPosts**

`src/components/content/RelatedPosts.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RelatedPosts } from './RelatedPosts';

describe('RelatedPosts', () => {
  it('renders a card per slug with title and link', () => {
    // columnPosts must contain at least these slugs for the test to pass.
    render(<RelatedPosts slugs={['renewal-vs-rebuild', 'seo-checklist-for-b2b']} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/column/renewal-vs-rebuild');
    expect(links[1]).toHaveAttribute('href', '/column/seo-checklist-for-b2b');
  });

  it('silently skips unknown slugs', () => {
    render(<RelatedPosts slugs={['nope-does-not-exist']} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
```

- [ ] **Step 6: Run — expect FAIL**

```bash
pnpm test
```

- [ ] **Step 7: Create `src/components/content/RelatedPosts.tsx`**

```typescript
import Link from 'next/link';
import { columnPosts } from '@/data/columnPosts';

export function RelatedPosts({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map((s) => columnPosts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) return null;

  return (
    <section className="my-12 border-t border-line pt-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tightest">관련 글</h2>
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/column/${p.slug}`}
              className="block rounded-lg border border-line p-5 transition hover:border-primary"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {p.category}
              </span>
              <h3 className="mt-2 text-base font-semibold text-text-primary">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{p.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 8: Run — expect PASS**

```bash
pnpm test
```

- [ ] **Step 9: Typecheck + commit**

```bash
pnpm typecheck
git add src/components/content/
git commit -m "feat(content): add FaqAccordion + RelatedPosts widgets"
```

---

## Task 6: Extend ColumnPost type + author the first sample post

The current `ColumnPost` type is summary-only (title/excerpt/cover/meta). Extend it for body, FAQs, HowTo, related slugs, and author reference. To make the dynamic route testable, fully author one post (`renewal-vs-rebuild`) with all fields.

**Files:**
- Modify: `src/data/columnPosts.ts`

- [ ] **Step 1: Extend the `ColumnPost` type**

Replace the `type ColumnPost` block in `src/data/columnPosts.ts` with:

```typescript
export type FaqEntry = { question: string; answer: string };
export type HowToStep = { name: string; text: string };
export type HowToBlock = { name: string; description: string; steps: HowToStep[] };

export type ColumnPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO date
  readMinutes: number;
  cover: string;
  authorId: string;
  tldr: string; // short summary (1-3 sentences)
  directAnswer: string; // 1-sentence "answer"
  body: string; // HTML string (Markdown to come later via separate plan)
  faqs?: FaqEntry[];
  howTo?: HowToBlock;
  relatedSlugs?: string[];
};
```

- [ ] **Step 2: Author the first post fully**

Replace the `renewal-vs-rebuild` entry with:

```typescript
{
  slug: 'renewal-vs-rebuild',
  title: '리뉴얼인가, 신규 제작인가 — 기준 5가지',
  excerpt: '기존 사이트를 살릴 것인지, 새로 만들지 결정하기 전 반드시 점검해야 할 5가지 기준.',
  category: '가이드',
  publishedAt: '2026-06-01',
  readMinutes: 9,
  cover: cover('2'),
  authorId: 'representative',
  tldr:
    '기술 부채, 디자인 노후, 컨버전 데이터, 운영 비용, 비즈니스 목표 변화 — 이 다섯 가지 기준 중 셋 이상이 해당되면 신규 제작이, 그 이하면 리뉴얼이 적합합니다.',
  directAnswer:
    '리뉴얼은 정보 구조와 기술 스택의 70% 이상을 보존할 수 있을 때, 신규 제작은 그 이하일 때 선택합니다.',
  body:
    '<h2>왜 이 결정이 중요한가</h2><p>잘못된 선택은 두 배의 비용과 SEO 손실을 초래합니다.</p><h2>5가지 기준</h2><ol><li>기술 부채 수준</li><li>디자인/UX 노후도</li><li>현재 컨버전 데이터</li><li>운영 비용 효율</li><li>비즈니스 목표 변화 폭</li></ol><p>각 기준을 0~3점으로 평가해 합산하세요. 8점 이상이면 신규 제작, 그 이하면 리뉴얼.</p>',
  faqs: [
    {
      question: '리뉴얼이 신규 제작보다 항상 저렴한가요?',
      answer:
        '아니요. 깊은 마이그레이션과 인프라 교체가 동반되면 신규 제작과 비슷한 비용이 듭니다.',
    },
    {
      question: 'SEO 손실을 어떻게 방지하나요?',
      answer:
        '리뉴얼 직전 URL 인벤토리 추출 → 301 매핑 → 발행 후 30일 모니터링이 표준 절차입니다.',
    },
  ],
  relatedSlugs: ['seo-checklist-for-b2b', 'cms-strategy-for-marketing-team'],
},
```

- [ ] **Step 3: For the remaining 3 stubs (why-business-website-matters, seo-checklist-for-b2b, cms-strategy-for-marketing-team), add minimal required fields**

For each, add:
```typescript
authorId: 'representative',
tldr: '본문 작성 예정.',
directAnswer: '본문 작성 예정.',
body: '<p>본문 작성 예정 — 빠른 시일 내 업데이트됩니다.</p>',
```

This keeps the type checker happy until each is authored.

- [ ] **Step 4: Verify typecheck passes**

```bash
pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add src/data/columnPosts.ts
git commit -m "feat(data): extend ColumnPost type with body, FAQ, HowTo, author"
```

---

## Task 7: Build `/column/[slug]` dynamic route

Create the dynamic route that renders a column post. Uses `generateStaticParams` for ISR, `generateMetadata` for per-post SEO, and composes the new content + SEO components.

**Files:**
- Create: `src/app/column/[slug]/page.tsx`
- Modify: `src/app/column/page.tsx` (fix link `href` from `/column` back to `/column/${slug}`)

- [ ] **Step 1: Create the dynamic route**

`src/app/column/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { buildMetadata } from '@/lib/metadata';
import { columnPosts } from '@/data/columnPosts';
import { getAuthor } from '@/data/authors';
import { absoluteUrl } from '@/config/site';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { Badge } from '@/components/common/Badge';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { HowToJsonLd } from '@/components/seo/HowToJsonLd';
import { PersonJsonLd } from '@/components/seo/PersonJsonLd';
import { Tldr } from '@/components/content/Tldr';
import { DirectAnswer } from '@/components/content/DirectAnswer';
import { AuthorByline } from '@/components/content/AuthorByline';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { RelatedPosts } from '@/components/content/RelatedPosts';

export function generateStaticParams() {
  return columnPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = columnPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/column/${post.slug}`,
    ogImage: post.cover,
  });
}

export default function ColumnDetailPage({ params }: { params: { slug: string } }) {
  const post = columnPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const author = getAuthor(post.authorId);
  const articleImage = post.cover.startsWith('http') ? post.cover : absoluteUrl(post.cover);

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: '홈', path: '/' },
          { name: '전문 칼럼', path: '/column' },
          { name: post.title, path: `/column/${post.slug}` },
        ]}
      />
      <ArticleJsonLd
        headline={post.title}
        description={post.excerpt}
        slug={post.slug}
        datePublished={post.publishedAt}
        image={articleImage}
        author={author}
      />
      <PersonJsonLd author={author} />
      {post.faqs && <FaqJsonLd faqs={post.faqs} />}
      {post.howTo && (
        <HowToJsonLd
          name={post.howTo.name}
          description={post.howTo.description}
          steps={post.howTo.steps}
        />
      )}

      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
      />

      <Section variant="light" spacing="default">
        <Container>
          <article className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
              <Badge variant="outline" size="sm">{post.category}</Badge>
              <span>{post.readMinutes}분 읽기</span>
            </div>
            <h1 className="sr-only">{post.title}</h1>
            <Tldr>{post.tldr}</Tldr>
            <DirectAnswer>{post.directAnswer}</DirectAnswer>
            <div
              className="prose prose-neutral mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
            <AuthorByline author={author} publishedAt={post.publishedAt} />
            {post.faqs && <FaqAccordion faqs={post.faqs} />}
            {post.relatedSlugs && <RelatedPosts slugs={post.relatedSlugs} />}
          </article>
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Fix the column list page to link to the detail route**

In `src/app/column/page.tsx`, change:
```typescript
<Link href={`/column`} className="block">
```
to:
```typescript
<Link href={`/column/${post.slug}`} className="block">
```

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors. The dynamic route should compile cleanly.

- [ ] **Step 4: Build to verify static generation works**

```bash
pnpm build
```

Expected: build succeeds, output shows `/column/[slug]` with all 4 entries listed under "Generating static pages".

- [ ] **Step 5: Manually verify in preview**

Start the dev server (if not already running) and visit `/column/renewal-vs-rebuild`. Confirm: TL;DR box shows, Direct Answer renders, body HTML renders, FAQ accordion expands, related cards link to other slugs, and view-source contains `<script type="application/ld+json">` blocks for Article, FAQPage, Person, BreadcrumbList.

```bash
# In your preview, after navigating: open DevTools → Elements → search "application/ld+json"
# You should see at least 4 script blocks.
```

- [ ] **Step 6: Commit**

```bash
git add src/app/column/[slug]/page.tsx src/app/column/page.tsx
git commit -m "feat(column): add /column/[slug] dynamic route with Article + FAQ + HowTo + Person JSON-LD"
```

---

## Task 8: Split sitemap into pages/articles/cases + sitemap-index

Next.js' `app/sitemap.ts` returns a single sitemap. For larger sites and engine preference, split into three separate route handlers (`sitemap-{pages,articles,cases}.xml`) and turn the existing `sitemap.ts` into an index that points at them.

**Files:**
- Create: `src/app/sitemap-pages.xml/route.ts`
- Create: `src/app/sitemap-articles.xml/route.ts`
- Create: `src/app/sitemap-cases.xml/route.ts`
- Modify: `src/app/sitemap.ts` (convert to sitemap-index)

- [ ] **Step 1: Add a helper for XML escaping**

Append to `src/lib/jsonld.ts` (or create `src/lib/xml.ts`):

```typescript
// src/lib/xml.ts
export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

export function urlsetXml(entries: UrlEntry[]): string {
  const items = entries
    .map((e) => {
      const parts = [
        `<loc>${escapeXml(e.loc)}</loc>`,
        e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : '',
        e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : '',
        typeof e.priority === 'number' ? `<priority>${e.priority.toFixed(1)}</priority>` : '',
      ]
        .filter(Boolean)
        .join('');
      return `<url>${parts}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}

export function sitemapIndexXml(locs: string[]): string {
  const items = locs.map((l) => `<sitemap><loc>${escapeXml(l)}</loc></sitemap>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}
```

- [ ] **Step 2: Create `src/app/sitemap-pages.xml/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { urlsetXml } from '@/lib/xml';

const STATIC_PATHS: { path: string; priority: number; changefreq: string }[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/service', priority: 0.9, changefreq: 'monthly' },
  { path: '/column', priority: 0.7, changefreq: 'weekly' },
  { path: '/whitepaper', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
];

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const xml = urlsetXml(
    STATIC_PATHS.map((r) => ({
      loc: `${base}${r.path}`,
      lastmod: today,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
  );
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
```

- [ ] **Step 3: Create `src/app/sitemap-articles.xml/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { columnPosts } from '@/data/columnPosts';
import { urlsetXml } from '@/lib/xml';

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const xml = urlsetXml(
    columnPosts.map((p) => ({
      loc: `${base}/column/${p.slug}`,
      lastmod: p.publishedAt,
      changefreq: 'monthly',
      priority: 0.7,
    })),
  );
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
```

- [ ] **Step 4: Create `src/app/sitemap-cases.xml/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { portfolios } from '@/data/portfolios';
import { urlsetXml } from '@/lib/xml';

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const xml = urlsetXml(
    portfolios.map((p) => ({
      loc: `${base}/portfolio/${p.slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
    })),
  );
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
```

- [ ] **Step 5: Replace `src/app/sitemap.ts` to act as sitemap-index**

The Next.js convention `app/sitemap.ts` returns a `MetadataRoute.Sitemap`. For a sitemap-index we override the route entirely by deleting the metadata file and creating a route handler instead.

Delete `src/app/sitemap.ts` and create `src/app/sitemap.xml/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { sitemapIndexXml } from '@/lib/xml';

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const xml = sitemapIndexXml([
    `${base}/sitemap-pages.xml`,
    `${base}/sitemap-articles.xml`,
    `${base}/sitemap-cases.xml`,
  ]);
  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
```

- [ ] **Step 6: Build and verify all four sitemap routes**

```bash
pnpm build
pnpm start &
SERVER_PID=$!
sleep 3
/usr/bin/curl -s http://localhost:3000/sitemap.xml | head -2
/usr/bin/curl -s http://localhost:3000/sitemap-pages.xml | head -2
/usr/bin/curl -s http://localhost:3000/sitemap-articles.xml | head -2
/usr/bin/curl -s http://localhost:3000/sitemap-cases.xml | head -2
kill $SERVER_PID
```

Expected: each returns valid XML starting with `<?xml version="1.0"`. The index references the three children.

- [ ] **Step 7: Commit**

```bash
git add src/lib/xml.ts src/app/sitemap*.xml src/app/sitemap.ts
git rm src/app/sitemap.ts 2>/dev/null || true
git add -A
git commit -m "feat(seo): split sitemap into pages/articles/cases + sitemap-index"
```

---

## Task 9: Update robots.ts with AI bot rules + add /llms.txt

robots.ts: add explicit `allow` for GPTBot, ChatGPT-User, OAI-SearchBot, Claude-Web, ClaudeBot, PerplexityBot, Google-Extended. Also redirect Google to the new sitemap-index location.

llms.txt: serve a structured manifest of major pages so AI crawlers can index efficiently per the [llmstxt.org](https://llmstxt.org) proposal.

**Files:**
- Modify: `src/app/robots.ts`
- Create: `src/app/llms.txt/route.ts`

- [ ] **Step 1: Update `src/app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Claude-Web',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
];

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: '/',
        disallow: ['/api/'],
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
```

- [ ] **Step 2: Create `src/app/llms.txt/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { brand } from '@/config/brand';
import { columnPosts } from '@/data/columnPosts';
import { portfolios } from '@/data/portfolios';

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const lines: string[] = [];

  lines.push(`# ${brand.name}`);
  lines.push('');
  lines.push(`> ${brand.tagline}`);
  lines.push('');
  lines.push(`${brand.description}`);
  lines.push('');
  lines.push('## Main pages');
  lines.push('');
  lines.push(`- [홈](${base}/): 회사 소개와 주요 서비스`);
  lines.push(`- [회사소개](${base}/about): 팀과 철학`);
  lines.push(`- [서비스](${base}/service): 기업 홈페이지 신규 제작·리뉴얼 서비스`);
  lines.push(`- [포트폴리오](${base}/portfolio): 진행 사례`);
  lines.push(`- [전문 칼럼](${base}/column): 기업 홈페이지 인사이트`);
  lines.push(`- [개발 백서](${base}/whitepaper): 다운로드 가능한 가이드 자료`);
  lines.push(`- [문의](${base}/contact): 프로젝트 문의 폼`);
  lines.push('');
  lines.push('## Column posts');
  lines.push('');
  for (const p of columnPosts) {
    lines.push(`- [${p.title}](${base}/column/${p.slug}): ${p.excerpt}`);
  }
  lines.push('');
  lines.push('## Case studies');
  lines.push('');
  for (const c of portfolios) {
    lines.push(`- [${c.title}](${base}/portfolio/${c.slug})`);
  }
  lines.push('');

  return new NextResponse(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
```

- [ ] **Step 3: Build + verify both endpoints**

```bash
pnpm build
pnpm start &
SERVER_PID=$!
sleep 3
/usr/bin/curl -s http://localhost:3000/robots.txt
echo "---"
/usr/bin/curl -s http://localhost:3000/llms.txt | head -20
kill $SERVER_PID
```

Expected: robots.txt shows AI bot blocks, llms.txt returns markdown-like manifest with all pages and posts listed.

- [ ] **Step 4: Commit**

```bash
git add src/app/robots.ts src/app/llms.txt/
git commit -m "feat(seo): allow major AI bots in robots.txt + add /llms.txt manifest"
```

---

## Task 10: GA4 conversion event helpers + wire into contact form

Wraps `window.dataLayer.push` (already pushed by GTM loader) into typed helpers. Tracks three conversions defined in the PRD's measurement section.

**Files:**
- Create: `src/lib/analytics-events.ts`
- Create: `src/lib/analytics-events.test.ts`
- Modify: `src/components/contact/ContactForm.tsx` (or the contact form component)

- [ ] **Step 1: Write failing test**

`src/lib/analytics-events.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
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
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm test
```

- [ ] **Step 3: Create `src/lib/analytics-events.ts`**

```typescript
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
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm test
```

- [ ] **Step 5: Locate the contact form's success handler**

```bash
/usr/bin/grep -rn "contact\b" src/components/contact/ --include="*.tsx"
```

Expected: a `ContactForm.tsx` (or similarly named) component that POSTs to `/api/contact` and reacts to `{ ok: true }`.

- [ ] **Step 6: Wire `trackContactFormSubmit` into the success branch**

In the file identified above, after the response is parsed and `data.ok` is true (before resetting the form / showing the success state), add:

```typescript
import { trackContactFormSubmit } from '@/lib/analytics-events';

// inside the onSubmit handler, in the success branch:
trackContactFormSubmit({ category: values.category });
```

- [ ] **Step 7: Typecheck + visual verification**

```bash
pnpm typecheck
```

Then in the preview (dev server already running), open DevTools console, run `window.dataLayer = []`, submit the contact form with `CONTACT_DRY_RUN=true`, and verify `window.dataLayer` contains the `contact_form_submit` event.

- [ ] **Step 8: Commit**

```bash
git add src/lib/analytics-events.ts src/lib/analytics-events.test.ts src/components/contact/
git commit -m "feat(analytics): add typed GA4 event helpers + wire contact form conversion"
```

---

## Wrap-up

After Task 10, run the final checks before opening a PR or merging:

- [ ] **Final typecheck**: `pnpm typecheck` → no errors
- [ ] **Final lint**: `pnpm lint` → no errors
- [ ] **Final test**: `pnpm test` → all green
- [ ] **Final build**: `pnpm build` → completes
- [ ] **Visual smoke test**: home, `/column/renewal-vs-rebuild`, `/llms.txt`, `/sitemap.xml`, `/robots.txt` all render correctly
- [ ] **JSON-LD validation**: paste the rendered HTML into [Google Rich Results Test](https://search.google.com/test/rich-results) for `/` and `/column/renewal-vs-rebuild` — confirm Organization, WebSite, Article, FAQPage, Person are all detected with zero errors.

## What's next (separate plans)

- **Content production**: Pillar 1편 + Cluster 25편 + Case 10편 over 6 months. Operational, not a code plan.
- **Pretendard subsetting** (M2 perf): reduce font payload from full Pretendard Variable to Korean-only subset. Separate plan.
- **`/whitepaper/[slug]` download gate** (M4): Resend-based email capture + signed download link. Separate plan.
- **Off-page outreach**: guest post pitching, HARO answers, OSS releases. Operational, not a code plan.
- **Measurement tooling**: Ahrefs lite setup, Looker Studio dashboard, monthly AEO citation tracking spreadsheet. Tool config, not a code plan.
