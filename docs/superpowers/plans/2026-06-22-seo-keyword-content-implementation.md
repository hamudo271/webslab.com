# SEO Keyword and 12-Column Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct technical SEO defects, map four commercial pages to distinct keywords, and publish 12 complete Korean buyer-focused columns with validated metadata, schema, internal links, and CTAs.

**Architecture:** Keep content in the existing typed `columnPosts` registry and render it through the current `/column/[slug]` route. Add pure policy and validation helpers so robots, sitemap dates, commercial metadata, article completeness, and keyword uniqueness can be tested without coupling tests to Next.js route internals. Reuse the existing JSON-LD and content components, extending only the fields required by the approved design.

**Tech Stack:** Next.js 14 App Router, TypeScript, React 18, Tailwind CSS, Vitest, Testing Library, pnpm.

## Global Constraints

- Use only the user-approved existing websLAB client, project, and performance facts.
- Do not invent prices, client quotes, traffic figures, conversion figures, awards, or market averages.
- One unique primary keyword per indexable page.
- Every article must have visible summary, direct answer, substantive body, verified author, related links, one commercial link, and one contact CTA.
- No article may contain `본문 작성 예정`, `TODO`, dummy identities, or unsupported superlatives.
- FAQ schema is semantic metadata only; do not describe it as a Google rich-result tactic.
- `llms.txt` remains optional and carries no ranking claim.
- Existing URLs are preserved where a matching slug already exists.

---

## File Structure

**Create:**
- `src/lib/seo-policy.ts` — commercial metadata definitions, crawler rules, and sitemap date constants.
- `src/lib/seo-policy.test.ts` — crawler, metadata, and sitemap policy tests.
- `src/lib/column-validation.ts` — pure registry validation.
- `src/lib/column-validation.test.ts` — article completeness, uniqueness, and link-integrity tests.
- `src/components/content/ColumnCta.tsx` — article-specific service/contact CTA.
- `src/components/content/ColumnCta.test.tsx` — CTA rendering and href tests.
- `src/app/icon.png` — stable square favicon generated from the approved websLAB mark.

**Modify:**
- `src/app/robots.ts`
- `src/app/sitemap-pages.xml/route.ts`
- `src/app/sitemap-cases.xml/route.ts`
- `src/app/sitemap-articles.xml/route.ts`
- `src/app/layout.tsx`
- `src/lib/metadata.ts`
- `src/lib/jsonld.ts`
- `src/lib/jsonld.test.ts`
- `src/data/authors.ts`
- `src/data/columnPosts.ts`
- `src/data/portfolios.ts`
- `src/app/page.tsx`
- `src/app/service/page.tsx`
- `src/app/portfolio/page.tsx`
- `src/app/about/page.tsx`
- `src/app/column/[slug]/page.tsx`
- `src/components/home/WhatWeDo.tsx`
- `src/components/home/Portfolio.tsx`

---

### Task 1: Correct crawler and sitemap policy

**Files:**
- Create: `src/lib/seo-policy.ts`
- Create: `src/lib/seo-policy.test.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap-pages.xml/route.ts`
- Modify: `src/app/sitemap-cases.xml/route.ts`
- Modify: `src/app/sitemap-articles.xml/route.ts`
- Modify: `src/data/portfolios.ts`

**Interfaces:**
- Produces `crawlerRules`, `STATIC_PAGE_DATES`, and `buildCaseSitemapEntries()`.
- Article sitemap consumes `ColumnPost.modifiedAt` introduced in Task 2.

- [ ] **Step 1: Write failing crawler and freshness tests**

```ts
import { describe, expect, it } from 'vitest';
import { crawlerRules, STATIC_PAGE_DATES, buildCaseSitemapEntries } from './seo-policy';

describe('crawlerRules', () => {
  it('allows Next.js rendering assets and blocks only API routes for general crawlers', () => {
    const general = crawlerRules.find((rule) => rule.userAgent === '*');
    expect(general).toEqual({ userAgent: '*', allow: '/', disallow: ['/api/'] });
  });
});

describe('sitemap freshness', () => {
  it('uses maintained dates instead of request-time dates', () => {
    expect(STATIC_PAGE_DATES['/']).toMatch(/^2026-\d{2}-\d{2}$/);
    expect(Object.values(STATIC_PAGE_DATES)).not.toContain(new Date().toISOString().slice(0, 10));
  });

  it('uses each case modified date', () => {
    const entries = buildCaseSitemapEntries([
      { slug: 'sample', modifiedAt: '2026-05-30' },
    ]);
    expect(entries).toEqual([{ path: '/portfolio/sample', lastmod: '2026-05-30' }]);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm test src/lib/seo-policy.test.ts`

Expected: FAIL because `seo-policy.ts` does not exist.

- [ ] **Step 3: Implement the policy helper**

```ts
export type CrawlerRule = { userAgent: string; allow: string; disallow: string[] };

const AI_BOTS = ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'Claude-Web', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

export const crawlerRules: CrawlerRule[] = [
  { userAgent: '*', allow: '/', disallow: ['/api/'] },
  ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow: ['/api/'] })),
];

export const STATIC_PAGE_DATES: Record<string, string> = {
  '/': '2026-06-22',
  '/about': '2026-06-22',
  '/service': '2026-06-22',
  '/portfolio': '2026-06-22',
  '/column': '2026-06-22',
  '/whitepaper': '2026-05-30',
  '/contact': '2026-05-30',
  '/privacy-policy': '2026-05-30',
  '/terms': '2026-05-30',
};

export function buildCaseSitemapEntries(cases: Array<{ slug: string; modifiedAt: string }>) {
  return cases.map((item) => ({ path: `/portfolio/${item.slug}`, lastmod: item.modifiedAt }));
}
```

Add `modifiedAt: string` to `Portfolio` and assign the verified latest significant-content date to every case. Routes import these helpers, stop calling `new Date()`, and emit canonical URL plus `lastmod` only.

- [ ] **Step 4: Run GREEN and regression tests**

Run: `pnpm test src/lib/seo-policy.test.ts`

Expected: PASS.

Run: `pnpm typecheck`

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo-policy.ts src/lib/seo-policy.test.ts src/app/robots.ts src/app/sitemap-*.xml/route.ts src/data/portfolios.ts
git commit -m "fix(seo): correct crawler and sitemap freshness policy"
```

### Task 2: Enforce a complete article content contract

**Files:**
- Modify: `src/data/columnPosts.ts`
- Create: `src/lib/column-validation.ts`
- Create: `src/lib/column-validation.test.ts`
- Modify: `src/data/authors.ts`
- Modify: `src/lib/jsonld.ts`
- Modify: `src/lib/jsonld.test.ts`

**Interfaces:**
- Extends `ColumnPost` with `primaryKeyword`, `modifiedAt`, `serviceHref`, `serviceLabel`, `ctaTitle`, and `ctaDescription`.
- Produces `validateColumnPosts(posts): string[]`.
- Article JSON-LD consumes `modifiedAt` as `dateModified`.

- [ ] **Step 1: Write failing registry validation tests**

```ts
import { describe, expect, it } from 'vitest';
import { validateColumnPosts } from './column-validation';

const completePost = {
  slug: 'sample-a',
  primaryKeyword: '샘플 키워드 A',
  body: `<p>${'검증 가능한 본문입니다. '.repeat(80)}</p>`,
  relatedSlugs: ['sample-b', 'sample-c'],
  serviceHref: '/service',
};

describe('validateColumnPosts', () => {
  it('accepts complete posts with unique slugs, keywords, and valid links', () => {
    const posts = [
      completePost,
      { ...completePost, slug: 'sample-b', primaryKeyword: '샘플 키워드 B', relatedSlugs: ['sample-a', 'sample-c'] },
      { ...completePost, slug: 'sample-c', primaryKeyword: '샘플 키워드 C', relatedSlugs: ['sample-a', 'sample-b'] },
    ];
    expect(validateColumnPosts(posts as never[])).toEqual([]);
  });

  it('rejects duplicate keywords, placeholder copy, thin bodies, and broken links', () => {
    const posts = [completePost, { ...completePost, slug: 'sample-b', body: '<p>TODO</p>', relatedSlugs: ['missing', 'sample-a'] }];
    expect(validateColumnPosts(posts as never[])).toEqual(expect.arrayContaining([
      'duplicate keyword: 샘플 키워드 A',
      'thin body: sample-b',
      'placeholder: sample-b',
      'invalid related slug: sample-b:missing',
    ]));
  });
});
```

- [ ] **Step 2: Run RED**

Run: `pnpm test src/lib/column-validation.test.ts`

Expected: FAIL because `column-validation.ts` and the required content fields do not exist.

- [ ] **Step 3: Implement the content contract and validator**

```ts
export function validateColumnPosts(posts: ColumnPost[]): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const keywords = new Set<string>();
  const knownSlugs = new Set(posts.map((post) => post.slug));

  for (const post of posts) {
    if (slugs.has(post.slug)) errors.push(`duplicate slug: ${post.slug}`);
    if (keywords.has(post.primaryKeyword)) errors.push(`duplicate keyword: ${post.primaryKeyword}`);
    if (post.body.replace(/<[^>]+>/g, '').trim().length < 900) errors.push(`thin body: ${post.slug}`);
    if (/본문 작성 예정|TODO|대표자명|홍길동/.test(JSON.stringify(post))) errors.push(`placeholder: ${post.slug}`);
    if (post.relatedSlugs.length < 2 || post.relatedSlugs.length > 3) errors.push(`related count: ${post.slug}`);
    for (const related of post.relatedSlugs) {
      if (!knownSlugs.has(related) || related === post.slug) errors.push(`invalid related slug: ${post.slug}:${related}`);
    }
    if (!post.serviceHref.startsWith('/')) errors.push(`invalid service href: ${post.slug}`);
    slugs.add(post.slug);
    keywords.add(post.primaryKeyword);
  }

  return errors;
}
```

Update the verified author:

```ts
export const representative: Author = {
  id: 'representative',
  name: '조현도',
  nameKo: '조현도',
  role: 'websLAB 대표',
  bio: '기업 홈페이지 신규 제작과 리뉴얼 프로젝트를 기획부터 운영까지 담당합니다. UI/UX, 데이터 이전, SEO 보존, CMS 운영 구조를 함께 설계합니다.',
  profileUrl: 'https://webslab.co.kr/about',
  sameAs: [],
};
```

Add `modifiedAt` to the article schema input and verify `dateModified` equals the visible article value.

- [ ] **Step 4: Run the focused test**

Run: `pnpm test src/lib/column-validation.test.ts src/lib/jsonld.test.ts`

Expected: PASS. No task may be committed with failing tests.

- [ ] **Step 5: Commit the contract separately**

```bash
git add src/data/columnPosts.ts src/data/authors.ts src/lib/column-validation.ts src/lib/column-validation.test.ts src/lib/jsonld.ts src/lib/jsonld.test.ts
git commit -m "feat(seo): define validated column content contract"
```

### Task 3: Map commercial pages to distinct keywords

**Files:**
- Modify: `src/lib/metadata.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/service/page.tsx`
- Modify: `src/app/portfolio/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/components/home/WhatWeDo.tsx`
- Modify: `src/components/home/Portfolio.tsx`
- Modify: `src/lib/seo-policy.test.ts`

**Interfaces:**
- Produces four explicit `buildMetadata()` calls with unique titles, descriptions, canonicals, and primary intents.

- [ ] **Step 1: Add failing metadata policy assertions**

```ts
import { COMMERCIAL_METADATA } from './seo-policy';

it('maps one distinct commercial keyword to each core page', () => {
  expect(COMMERCIAL_METADATA['/'].keyword).toBe('기업 홈페이지 제작 업체');
  expect(COMMERCIAL_METADATA['/service'].keyword).toBe('기업 홈페이지 제작');
  expect(COMMERCIAL_METADATA['/portfolio'].keyword).toBe('B2B 홈페이지 제작 사례');
  expect(COMMERCIAL_METADATA['/about'].keyword).toBe('기업 홈페이지 전문 에이전시');
  expect(new Set(Object.values(COMMERCIAL_METADATA).map((item) => item.keyword)).size).toBe(4);
});
```

- [ ] **Step 2: Run RED**

Run: `pnpm test src/lib/seo-policy.test.ts`

Expected: FAIL because `COMMERCIAL_METADATA` is missing.

- [ ] **Step 3: Implement exact metadata**

```ts
export const COMMERCIAL_METADATA = {
  '/': {
    keyword: '기업 홈페이지 제작 업체',
    title: '기업 홈페이지 제작 업체 | 기획·디자인·개발·운영',
    description: '기업 홈페이지 신규 제작과 리뉴얼을 기획·UI/UX·개발·CMS·운영까지 한 팀에서 책임지는 websLAB의 서비스와 B2B 구축 사례를 확인하세요.',
  },
  '/service': {
    keyword: '기업 홈페이지 제작',
    title: '기업 홈페이지 제작·리뉴얼 서비스',
    description: '기업 홈페이지 제작, 리뉴얼, SEO 보존 마이그레이션, CMS 구축과 유지보수를 한 팀에서 제공합니다.',
  },
  '/portfolio': {
    keyword: 'B2B 홈페이지 제작 사례',
    title: 'B2B 홈페이지 제작 사례 | 제조·물류·IT·바이오',
    description: '제조·물류·IT·바이오 기업의 홈페이지 신규 제작과 리뉴얼 사례, 작업 범위와 성과를 확인하세요.',
  },
  '/about': {
    keyword: '기업 홈페이지 전문 에이전시',
    title: '기업 홈페이지 전문 에이전시 소개',
    description: '기획부터 디자인, 개발, 데이터 이전, 운영까지 직접 수행하는 기업 홈페이지 전문 에이전시 websLAB을 소개합니다.',
  },
} as const;
```

Use these values in each route. Add contextual links from home/service/portfolio sections to the future cost, agency selection, renewal SEO, B2B structure, and CMS columns with natural anchor text.

- [ ] **Step 4: Verify GREEN**

Run: `pnpm test src/lib/seo-policy.test.ts`

Expected: PASS.

Run: `pnpm typecheck`

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo-policy.ts src/lib/seo-policy.test.ts src/lib/metadata.ts src/app/page.tsx src/app/service/page.tsx src/app/portfolio/page.tsx src/app/about/page.tsx src/components/home/
git commit -m "feat(seo): map commercial pages to target keywords"
```

### Task 4: Publish columns 1-4 for cost and agency selection

**Files:**
- Modify: `src/data/columnPosts.ts`

**Articles:**
- `corporate-website-cost`
- `website-agency-selection`
- `website-production-timeline`
- `website-quote-comparison`

- [ ] **Step 1: Keep the completeness test RED and add article-specific assertions**

```ts
it.each([
  ['corporate-website-cost', '기업 홈페이지 제작 비용'],
  ['website-agency-selection', '기업 홈페이지 제작 업체 선정 기준'],
  ['website-production-timeline', '홈페이지 제작 기간'],
  ['website-quote-comparison', '홈페이지 제작 견적서'],
])('%s has its approved keyword and a substantive body', (slug, keyword) => {
  const post = columnPosts.find((item) => item.slug === slug);
  expect(post?.primaryKeyword).toBe(keyword);
  expect(post?.body.replace(/<[^>]+>/g, '').length).toBeGreaterThan(900);
});

it('publishes the first four approved articles as a valid registry', () => {
  expect(columnPosts).toHaveLength(4);
  expect(validateColumnPosts(columnPosts)).toEqual([]);
});
```

- [ ] **Step 2: Run RED**

Run: `pnpm test src/lib/column-validation.test.ts`

Expected: FAIL because the four approved articles are absent or incomplete.

- [ ] **Step 3: Write the four complete articles**

Each article follows this exact editorial payload:

- Cost: explain scope, page types, content readiness, CMS, integrations, migration, QA, and maintenance; use a quote-component checklist instead of an invented market price.
- Agency selection: evaluate comparable case depth, discovery quality, named ownership, migration plan, CMS usability, QA, maintenance terms, quote transparency, communication cadence, and measurable outcomes.
- Timeline: cover discovery, IA, visual direction, design, implementation, content/data migration, QA, launch, and stabilization; explain dependencies rather than promising an unsupported fixed duration.
- Quote comparison: compare scope definition, deliverables, exclusions, revision limits, content responsibility, migration, SEO work, source ownership, maintenance, schedule, and payment milestones.

Every article includes 2-3 related slugs and links to `/service` or `/portfolio`.

- [ ] **Step 4: Run focused GREEN**

Run: `pnpm test src/lib/column-validation.test.ts -t "cost and agency"`

Expected: PASS with four complete articles and no registry errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/columnPosts.ts src/lib/column-validation.test.ts
git commit -m "content(seo): publish cost and agency selection columns"
```

### Task 5: Publish columns 5-8 for renewal and B2B decisions

**Files:**
- Modify: `src/data/columnPosts.ts`
- Modify: `src/lib/column-validation.test.ts`

**Articles:**
- `renewal-vs-rebuild`
- `website-renewal-cost`
- `website-renewal-seo`
- `b2b-website-structure`

- [ ] **Step 1: Add article-specific failing assertions using the same table-driven contract as Task 4**

Primary keywords must exactly match the approved map. Change the registry count assertion from `4` to `8`.

- [ ] **Step 2: Run RED**

Run: `pnpm test src/lib/column-validation.test.ts`

Expected: FAIL for missing/incomplete Task 5 articles.

- [ ] **Step 3: Write the four complete articles**

- Renewal vs rebuild: preservation threshold, information architecture, technology debt, content quality, operational cost, SEO risk, and business-goal change.
- Renewal cost: audit, redesign depth, migration volume, integrations, CMS, redirect work, QA, and stabilization.
- Renewal SEO: URL inventory, search data baseline, 1:1 301 mapping, canonical checks, sitemap/robots, staging noindex removal, launch monitoring, and rollback ownership.
- B2B structure: audience/problem framing, service architecture, proof, case studies, process, technical resources, trust data, and contextual conversion paths.

Use approved portfolio facts where relevant and avoid adding unpublished numbers.

- [ ] **Step 4: Run focused GREEN and commit**

Run: `pnpm test src/lib/column-validation.test.ts`

Expected: PASS with eight complete articles and no registry errors.

```bash
git add src/data/columnPosts.ts src/lib/column-validation.test.ts
git commit -m "content(seo): publish renewal and B2B decision columns"
```

### Task 6: Publish columns 9-12 for industry, CMS, and SEO

**Files:**
- Modify: `src/data/columnPosts.ts`
- Modify: `src/lib/column-validation.test.ts`

**Articles:**
- `manufacturing-website-pages`
- `logistics-multilingual-website`
- `corporate-website-cms`
- `corporate-website-seo-checklist`

- [ ] **Step 1: Add article-specific failing assertions**

Use the exact primary keywords and slugs from the design specification. Change the registry count assertion from `8` to `12`.

- [ ] **Step 2: Run RED**

Run: `pnpm test src/lib/column-validation.test.ts`

Expected: FAIL for missing/incomplete Task 6 articles.

- [ ] **Step 3: Write the four complete articles**

- Manufacturing: product taxonomy, product detail template, specifications/downloads, certifications, application cases, distributor/inquiry flows, search indexing, and CMS operations; reference approved SMC/Virex facts.
- Logistics: service/lane structure, global network, Incoterms/support information, multilingual governance, localizable metadata, case proof, and inquiry routing; reference approved IMPEX facts.
- CMS: editor roles, structured modules, preview, approvals, SEO fields, asset governance, security, backups, and when a CMS is unnecessary.
- SEO checklist: crawlability, status codes, canonical, metadata, headings, internal links, image text/alt, structured data, sitemap, robots, redirects, CWV, Search Console, content ownership, and measurement.

- [ ] **Step 4: Run the full content gate GREEN**

Run: `pnpm test src/lib/column-validation.test.ts`

Expected: PASS with 12 complete articles, unique slugs/keywords, valid related links, and no placeholders.

- [ ] **Step 5: Commit**

```bash
git add src/data/columnPosts.ts src/lib/column-validation.test.ts
git commit -m "content(seo): publish industry CMS and SEO columns"
```

### Task 7: Render article metadata, author, links, and CTA consistently

**Files:**
- Create: `src/components/content/ColumnCta.tsx`
- Create: `src/components/content/ColumnCta.test.tsx`
- Modify: `src/app/column/[slug]/page.tsx`
- Modify: `src/components/content/AuthorByline.tsx`
- Modify: `src/components/content/RelatedPosts.tsx`

**Interfaces:**
- `ColumnCta` consumes `{ title, description, serviceHref, serviceLabel, fromPath }`.

- [ ] **Step 1: Write a failing CTA component test**

```tsx
render(
  <ColumnCta
    title="기업 홈페이지 제작을 검토하고 있나요?"
    description="목적과 현재 사이트를 확인한 뒤 필요한 범위를 정리해드립니다."
    serviceHref="/service"
    serviceLabel="기업 홈페이지 제작 서비스"
    fromPath="/column/corporate-website-cost"
  />,
);
expect(screen.getByRole('link', { name: '기업 홈페이지 제작 서비스' })).toHaveAttribute('href', '/service');
expect(screen.getByRole('link', { name: '프로젝트 문의' })).toHaveAttribute('href', '/contact');
```

- [ ] **Step 2: Run RED**

Run: `pnpm test src/components/content/ColumnCta.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the CTA and article integration**

Render one service link and one contact link. Track the contact link with the existing `trackPillarToContact()` event. Pass `post.modifiedAt` into Article JSON-LD, show both published and modified dates when different, remove the duplicate `sr-only` H1 because `PageHero` already renders H1, and render related posts plus `ColumnCta` after the FAQ.

- [ ] **Step 4: Run GREEN and component regression tests**

Run: `pnpm test src/components/content`

Expected: PASS.

Run: `pnpm typecheck`

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/content src/app/column/[slug]/page.tsx
git commit -m "feat(seo): add consistent article links author dates and CTA"
```

### Task 8: Add favicon and perform release verification

**Files:**
- Create: `src/app/icon.png`
- Modify: `src/app/layout.tsx` only if explicit icon metadata is required after Next.js file-convention verification.
- Modify: any file required to fix discovered verification defects.

- [ ] **Step 1: Create the favicon from the approved logo asset**

Generate a square 512x512 PNG containing the websLAB mark with adequate padding and verify it visually before using it as `src/app/icon.png`.

- [ ] **Step 2: Run all automated checks**

Run: `pnpm test`

Expected: all tests pass with no warnings.

Run: `pnpm typecheck`

Expected: no output and exit 0.

Run: `pnpm build`

Expected: production build succeeds and includes 12 column detail routes plus all sitemap/robots routes.

- [ ] **Step 3: Inspect generated output**

Verify:

- `/robots.txt` does not contain `Disallow: /_next/`.
- `/sitemap-articles.xml` contains 12 canonical article URLs and explicit modified dates.
- Core pages emit the approved unique title, description, and canonical.
- Representative articles emit one H1, Article/Person/Breadcrumb JSON-LD, author, published/modified dates, related links, service link, and contact CTA.

- [ ] **Step 4: Browser verification**

Run the local Next.js server and inspect desktop 1440x900 and mobile 390x844 for:

- Home
- Service
- Portfolio
- About
- Column index
- `corporate-website-cost`
- `website-renewal-seo`
- `manufacturing-website-pages`

Confirm no clipping, overlap, broken internal links, missing content, console errors, or blank images. Check full-page layout and above-the-fold heading clarity.

- [ ] **Step 5: Final commit**

```bash
git add src/app/icon.png src/app/layout.tsx
git commit -m "feat(seo): add search favicon and complete release verification"
```

---

## Plan Self-Review

- Every approved technical, metadata, content, schema, internal-link, CTA, and verification requirement maps to a task.
- Existing SEO infrastructure is reused rather than rebuilt.
- Content facts are constrained to user-approved existing data.
- The 12 article slugs and keywords are unique and explicit.
- Every task returns to GREEN before commit; the registry count advances from 4 to 8 to 12 across content tasks.
- No production behavior is implemented before its failing test.
