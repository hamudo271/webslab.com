# websLAB SEO Keyword and 12-Column Content Design

- **Date:** 2026-06-22
- **Status:** Approved in conversation; pending written-spec review
- **Supersedes:** The content scope and 2026 search-feature assumptions in `2026-05-30-aeo-seo-design.md`

## Goal

Improve technical crawlability, align each important page to one commercial search intent, and publish 12 complete Korean columns that build topical authority around corporate website production, renewal, B2B sites, and industry-specific delivery.

Success means:

- Googlebot can crawl all rendering assets needed for the Next.js site.
- Sitemap freshness signals reflect real content changes.
- Home, service, portfolio, and about pages target distinct commercial keywords.
- All 12 columns contain complete, useful content with no placeholder copy.
- Every column has a unique primary keyword, clear answer, evidence, author identity, internal links, and a relevant contact CTA.
- Typecheck, automated SEO tests, production build, and rendered-page checks pass.

Rankings are a measured outcome, not an implementation guarantee.

## Scope

### Included

1. Technical SEO corrections:
   - Stop blocking `/_next/` in `robots.txt`.
   - Keep `/api/` disallowed.
   - Preserve explicit AI crawler access where it does not conflict with normal crawling.
   - Replace request-time `lastmod` values with explicit significant-update dates.
   - Remove sitemap fields that Google ignores when they add no operational value.
   - Add a stable square favicon and expose it through Next.js metadata.
2. Entity and structured-data corrections:
   - Use the verified representative name, business details, and author biography.
   - Add `dateModified` to article data and Article JSON-LD.
   - Keep Organization, WebSite, Breadcrumb, Person, Article, Service, FAQ, and HowTo schemas only when they match visible page content.
   - Treat FAQ markup as semantic metadata, not as a Google rich-result tactic.
   - Keep `llms.txt` as an optional machine-readable index with no ranking claim.
3. On-page commercial keyword mapping:
   - Home: `기업 홈페이지 제작 업체`
   - Service: `기업 홈페이지 제작`, secondary `홈페이지 리뉴얼 업체`
   - Portfolio: `B2B 홈페이지 제작 사례`
   - About: `기업 홈페이지 전문 에이전시`
4. Twelve complete column articles.
5. Internal links among columns, service, portfolio cases, and contact.
6. Automated regression tests for robots, sitemap dates, metadata mapping, article completeness, unique keywords, schema consistency, and internal-link requirements.

### Excluded

- New industry landing-page routes. These follow after Search Console data identifies the strongest industry cluster.
- Fabricated client facts, testimonials, awards, statistics, or prices.
- Search-volume claims without Keyword Planner or Naver Search Ads data.
- Backlink outreach, paid advertising, Google Business Profile operations, and Naver Place operations.
- A CMS migration. Column content remains in the existing typed data model for this cycle.
- Redesigning the visual system or replacing all portfolio imagery.

## Content Principles

- Write for a buyer making a real decision, not for keyword density.
- Use verified existing facts: 110+ projects, 85% renewal rate, approved client names, approved case details, and approved performance figures already present in the site data.
- Do not invent undisclosed project budgets, traffic figures, conversion figures, client quotes, or industry averages.
- When a numeric price cannot be verified, explain the cost drivers and provide a quotation framework rather than a made-up market average.
- Each article answers one primary search intent. Related terms may appear naturally but must not create a second competing article.
- Each article must provide first-hand operational detail: decision criteria, process, failure modes, checklist, or a verified case example.
- Important conclusions must exist as normal visible text, not only in JSON-LD or images.

## Keyword Map and Article Set

| # | Slug | Primary keyword | Search intent | Working title |
|---|---|---|---|---|
| 1 | `corporate-website-cost` | 기업 홈페이지 제작 비용 | Commercial investigation | 2026 기업 홈페이지 제작 비용: 견적을 결정하는 7가지 요소 |
| 2 | `website-agency-selection` | 기업 홈페이지 제작 업체 선정 기준 | Commercial investigation | 기업 홈페이지 제작 업체 선정 기준 10가지 |
| 3 | `website-production-timeline` | 홈페이지 제작 기간 | Commercial investigation | 홈페이지 제작 기간은 얼마나 걸릴까: 단계별 일정 가이드 |
| 4 | `website-quote-comparison` | 홈페이지 제작 견적서 | Commercial investigation | 홈페이지 제작 견적서 비교 방법: 가격보다 먼저 볼 항목 |
| 5 | `renewal-vs-rebuild` | 신규 제작 리뉴얼 차이 | Decision | 홈페이지 신규 제작과 리뉴얼, 무엇을 선택해야 할까 |
| 6 | `website-renewal-cost` | 홈페이지 리뉴얼 비용 | Commercial investigation | 홈페이지 리뉴얼 비용과 작업 범위 결정 방법 |
| 7 | `website-renewal-seo` | 홈페이지 리뉴얼 SEO | Problem solving | 홈페이지 리뉴얼 시 SEO를 유지하는 방법 |
| 8 | `b2b-website-structure` | B2B 홈페이지 구성 | Informational/commercial | B2B 홈페이지에 반드시 필요한 8가지 구성 |
| 9 | `manufacturing-website-pages` | 제조업 홈페이지 제작 | Industry commercial | 제조업 홈페이지 제작 시 필요한 페이지와 제품 구조 |
| 10 | `logistics-multilingual-website` | 물류 회사 홈페이지 제작 | Industry commercial | 물류·무역 기업의 다국어 홈페이지 제작 가이드 |
| 11 | `corporate-website-cms` | 기업 홈페이지 CMS | Problem solving | 기업 홈페이지에 CMS가 필요한 이유와 선택 기준 |
| 12 | `corporate-website-seo-checklist` | 기업 홈페이지 SEO | Problem solving | 기업 홈페이지 SEO 체크리스트 20가지 |

Existing slugs that match this table are upgraded in place so indexed URLs are not unnecessarily changed. Stub articles outside the final set are removed from indexable navigation and sitemaps until complete.

## Required Article Structure

Every article contains, in this order:

1. Category, publication date, modification date, and reading time.
2. One H1 rendered by `PageHero`; no duplicate hidden H1.
3. A 1-3 sentence summary.
4. A direct answer that can stand alone when quoted.
5. A decision-oriented body with descriptive H2/H3 headings.
6. At least one verified websLAB process detail or case example when relevant.
7. A checklist, comparison table, or numbered process where it helps the reader decide or act.
8. Visible sources for external factual claims. Pure websLAB process guidance does not need artificial citations.
9. Author byline using `조현도`, role, and a substantive biography.
10. Two or three related-column links.
11. One service or portfolio link using descriptive anchor text.
12. A contact CTA matched to the article intent.
13. FAQ content only when the questions add information not already obvious from headings.

Article body copy must not contain `본문 작성 예정`, `TODO`, dummy names, unsupported superlatives, or keyword-stuffed sentences.

## On-Page Page Design

### Home

- Title: `기업 홈페이지 제작 업체 | 기획·디자인·개발·운영 | websLAB`
- H1 remains natural Korean and clearly states corporate website production expertise.
- Description mentions new production, renewal, B2B specialization, and end-to-end delivery.
- Add crawlable links to the service page, two strongest case studies, and the cost/agency-selection columns.

### Service

- Title targets `기업 홈페이지 제작` and describes renewal in the description and H2 hierarchy.
- Service JSON-LD reflects only visible services.
- Add links to cost, timeline, renewal cost, renewal SEO, and CMS columns.

### Portfolio

- Title targets `B2B 홈페이지 제작 사례`.
- Intro text explains industries, work scope, and what each case demonstrates.
- Case descriptions remain unique and link to relevant explanatory columns where useful.

### About

- Title targets `기업 홈페이지 전문 에이전시`.
- Replace generic authority text with verified company identity, representative identity, operating model, and measurable experience.

## Technical Architecture

### Content data

Extend `ColumnPost` with:

```ts
type ColumnPost = {
  primaryKeyword: string;
  publishedAt: string;
  modifiedAt: string;
  body: string;
  relatedSlugs: string[];
  serviceHref: string;
  serviceLabel: string;
  ctaTitle: string;
  ctaDescription: string;
};
```

The exact type retains all existing required properties. Build-time validation rejects duplicate slugs, duplicate primary keywords, incomplete body copy, missing related links, and links to unknown slugs.

### SEO policy helpers

Create small pure helpers for:

- Commercial page metadata definitions.
- Sitemap entries with explicit `lastmod` values.
- Article completeness validation.

Pure helpers are tested directly. Route and component tests verify integration without snapshotting whole pages.

### Sitemap policy

- Article `lastmod` comes from `modifiedAt`.
- Case-study `lastmod` is stored with case data or an explicit release map.
- Static-page `lastmod` is a maintained constant changed only with significant content updates.
- Sitemap contains canonical, indexable URLs only.

### Crawler policy

- General crawlers: allow public pages and `/_next/`; disallow `/api/`.
- AI crawler-specific rules may explicitly allow public pages but must not imply that crawler access guarantees citations or rankings.
- `Google-Extended` is treated separately from Google Search eligibility; normal Googlebot access remains controlled by the general rule.

## Internal Linking Model

- Commercial pages link down to relevant explanatory columns.
- Columns link laterally to two or three non-competing articles.
- Columns link up to one service or portfolio destination.
- Every article offers a contextual contact CTA.
- Anchor text describes the destination; repeated exact-match anchors are avoided.
- All links are standard server-rendered Next.js links with resolvable `href` values.

## Error and Edge Handling

- Unknown article slugs return the existing 404 response.
- Content validation fails the test/build rather than publishing an incomplete article.
- Invalid or duplicate related slugs fail validation.
- Missing optional FAQ or HowTo content omits the corresponding schema.
- Metadata descriptions are kept concise and unique; no automatic keyword repetition is added.

## Testing and Verification

1. Unit tests:
   - Robots policy allows `/_next/` and disallows `/api/`.
   - Sitemap dates are explicit and articles use `modifiedAt`.
   - Four commercial pages have distinct target metadata.
   - Twelve articles exist with unique slugs and primary keywords.
   - No article includes placeholder markers.
   - Related slugs resolve and required commercial links exist.
   - Article JSON-LD uses visible author and date values.
2. Static verification:
   - `pnpm test`
   - `pnpm typecheck`
   - `pnpm build`
3. Render verification:
   - Desktop and mobile checks for home, service, portfolio, about, column index, and representative column pages.
   - Confirm one visible H1, metadata, canonical, JSON-LD, internal links, no clipping, and no console errors.
4. External launch checks after deployment:
   - Google Search Console URL inspection and sitemap submission.
   - Bing Webmaster Tools verification and optional IndexNow follow-up.
   - Rich Results Test for supported Article/Breadcrumb/Organization markup.

## Delivery Sequence

1. Technical crawl and sitemap corrections.
2. Data validation and verified author identity.
3. Commercial-page metadata and internal links.
4. Twelve complete columns in keyword-cluster order.
5. Cross-linking, schema review, and CTA integration.
6. Automated, build, and rendered-page verification.

## Risks and Mitigations

- **Thin AI-generated copy:** Every article must include a concrete decision framework, process, or verified case detail.
- **Keyword cannibalization:** One primary keyword per indexable page and a test-enforced keyword map.
- **Unsupported numeric claims:** Use only user-approved existing figures; explain factors instead of inventing averages.
- **Publishing too much at once:** Technical correctness and full article quality are release gates. Search engines decide crawl and ranking timing.
- **Schema drift:** JSON-LD values are derived from the same article and author data rendered visibly.

