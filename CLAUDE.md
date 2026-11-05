# CLAUDE.md

## 1. 프로젝트 목적
websLAB(웹스랩) 기업 홈페이지 제작·리뉴얼 에이전시의 마케팅 사이트. 회사소개·서비스·포트폴리오·SEO/AEO 칼럼을 제공하고 문의 폼으로 리드를 수집한다. 라이브: https://webslab.co.kr

## 2. 스택 & 배포
- **Next.js 14 App Router** + TypeScript + Tailwind + **pnpm**
- 빌드: `Dockerfile`(standalone, `node server.js`) → **Railway** 자동 빌드 → **Cloudflare** 엣지
- **배포 = `git push origin HEAD:main`** (Railway가 main push 감지해 ~2-3분 빌드). 라이브 확인: `curl "https://webslab.co.kr/?cb=$RANDOM"` (URL은 반드시 따옴표 — zsh가 `?`를 글로빙함)
- 로컬 개발: `pnpm dev` (:3000). 의존성 설치 시 인터랙티브 프롬프트 뜨면 `CI=true pnpm install`
- **공개 사이트 = 리뉴얼 정적 HTML** (2026-11-04~). 원본 작업 폴더 `웹스랩 리뉴얼본/`(git 제외, Unwebs 테마 기반 정적 시안 — 테마 사용 권한은 사용자 확인)을 고친 뒤 `pnpm sync:renewal` → 커밋 → 배포. 동기화는 페이지를 `src/site/pages/*.html`, 에셋을 `public/{assets,wp-content,wp-includes}`로 복사하고 미참조·제외 파일은 지운다.

## 3. 폴더 구조
```
src/
  app/         라우트. 공개 페이지는 route.ts(리뉴얼 HTML 응답) + admin/(React) + sitemap 4종, robots, llms.txt, api/
  site/        리뉴얼 사이트 — pages/*.html(동기화 원본), registry(경로↔페이지·SEO), render(운영 head 주입),
               column·column-pages(칼럼 목록/상세), legal·doc-pages(약관·404 본문)
  components/  React UI. 관리자(admin/)·분석(analytics/)이 현역. layout/·home/·content/ 등 이전 사이트 컴포넌트는 공개 페이지에서 더 이상 안 씀(정리 대상)
  lib/         순수 유틸 (테스트 대상). jsonld, metadata, seo-policy, validators, cn, xml, db, posts, slug, column-feed
  hooks/       공용 React 훅 (useScrolled, useScrollLock)
  data/        콘텐츠 데이터 (칼럼·포트폴리오·네비·히어로 등). 코드 아님
  config/      brand · site · analytics 설정 (단일 소스)
prisma/        schema.prisma + migrations (칼럼 CMS의 Post 모델)
public/        images(column/ = 칼럼 썸네일), fonts, og, site/(운영 레이어 ws-forms.js·ws-site.css),
               assets·wp-content·wp-includes(리뉴얼 동기화 — 직접 수정 금지, 원본 폴더에서 고친 뒤 sync)
```
루트: `next.config.mjs`(standalone), `Dockerfile`, `railway.json`, `.gitignore`(에이전트 아티팩트 제외)

## 4. 자주 만지는 핵심 모듈
- **`src/config/brand.ts`** — 회사명·주소·연락처·사업자번호 등 **단일 소스**. 사이트 전역이 여기서 값을 가져옴. 하드코딩 금지, 항상 여기 수정.
- **`src/config/site.ts`** — `siteConfig.baseUrl`, `absoluteUrl(path)`. 절대 URL은 이 함수로만 생성.
- **`src/data/*.ts`** — 페이지 콘텐츠는 전부 데이터 파일 → 컴포넌트가 map. 문구/항목 추가는 여기. `columnPosts.ts`(≈950줄)는 칼럼 본문이라 크지만 정상.
- **`src/lib/jsonld.ts`** — JSON-LD 스키마 순수 함수 9개(organization/article/faqPage/service…). `components/seo/*JsonLd.tsx`가 렌더. 구조화 데이터 변경은 여기.
- **`src/lib/seo-policy.ts`** — robots.txt 크롤러 정책(AI 검색봇 허용 / 학습봇 차단). Cloudflare 관리형 차단과 **일치시켜야** 함.
- **`src/lib/metadata.ts`** — `buildMetadata()`로 페이지 메타/OG 생성.
- **`src/components/common/Button.tsx`** — `variants`/`sizes` 맵 기반. `ButtonLink`(a) / `Button`(button) 두 형태. 새 버튼 스타일은 맵에 추가.
- **`src/components/layout/Header.tsx`** — 스크롤/오버레이 메뉴. 로직은 `hooks/`로 분리됨(아래 6번 주의).
- **`src/lib/site-html.ts`** — 리뉴얼 시안 → 운영 HTML 변환(순수 함수, `site-html.test.ts`가 전 페이지 검사): 검색 차단·시안 문구 제거, **다른 회사 추적·인증 코드 제거**(`FOREIGN_TRACKING_MARKERS`), 링크 정리, 푸터 사업자 정보(brand.ts), 문의 폼 운영화(실제 개인정보 동의 체크·선택 항목 완화). 원본 폴더는 건드리지 않고 여기서 일괄 변환 → 재동기화해도 결과 동일.
- **`src/site/render.ts`** — 리뉴얼 페이지 공통 head(canonical·OG·소유확인·JSON-LD·분석 `lib/site-analytics.ts`) 주입. 공개 라우트는 전부 `sitePageHtml()`/`shellHtml()`만 호출.
- **`public/site/ws-forms.js`** — 폼 4종(견적 `.uw-inquiry-form` · 간편 `#uwQiForm` · 유지보수 `#mxForm` · 채용 지원 `#crForm`)을 `/api/contact`로 전송. `<head>` 동기 로드 + window 캡처 submit으로 시안 스크립트(공식 페이지 이동·mailto·admin-ajax)보다 먼저 받는다. 성공 시 GA `contact_form_submit`(관리자 통계 집계 기준). 채용 지원은 리드가 아니라 `career_apply_submit`만 보낸다.
- **`src/app/api/contact/route.ts`** — 문의 수신 → Resend 메일. multipart = 리뉴얼 폼 4종(`lib/validators/inquiry.ts`, 견적·채용만 첨부 최대 3개·파일당 10MB·합계 25MB, 메일 본문 `lib/inquiry-mail.ts`), JSON = 이전 React 폼 호환.
- **칼럼 썸네일** — `pnpm build:thumbnails`(`scripts/build_column_og.py`)가 회사소개서 표지 스타일로 `public/images/column/<slug>.png` + 기본 OG `public/og/default.png` 생성. 새 정적 칼럼을 넣으면 다시 실행.
- **칼럼 CMS(`/admin`)** — Railway Postgres + Prisma(`lib/db.ts` 싱글턴). 정적 12편(`data/columnPosts.ts`)은 그대로, **DB는 신규 글 전용** — `lib/column-feed.ts`가 병합(최신순, DB 장애 시 정적 폴백). 한글 제목 → 로마자 slug 자동(`lib/slug.ts`, 정적 슬러그 예약 + 충돌 시 `-2`). 인증: `ADMIN_PASSWORD` 평문 비교(timingSafeEqual, 로그인 라우트) + jose JWT(미들웨어 Edge 검증), `middleware.ts`가 `/admin/*`·`/api/admin/*` 보호. 에디터: Tiptap(`components/admin/Editor.tsx`) + Cloudinary 업로드(`/api/admin/upload`).

## 5. 코딩 컨벤션
- **className 병합은 항상 `cn()`** (`@/lib/cn`, clsx + tailwind-merge). 조건부 클래스도 `cn(base, cond && '...')`.
- **variant/size는 `Record<Variant, string>` 맵** 패턴 (Button 참고). switch/if 나열 지양.
- **콘텐츠는 컴포넌트에 하드코딩하지 말고 `data/`로** 분리 후 map.
- **설정값(브랜드·URL·연락처)은 `config/`에서** import. 리터럴 금지.
- 클라이언트 컴포넌트/훅은 최상단 `'use client'`.
- 에러 처리: API route는 try/catch로 감싸고 `NextResponse.json({error}, {status})` 반환 + `console.error('[태그]', …)`. 사용자 노출 문구는 한국어.
- 입력 검증은 **zod 스키마**(`lib/validators/`) — 폼(react-hook-form)과 API가 같은 스키마 공유.
- import 순서: 외부 → `@/lib`·`@/config`·`@/hooks`·`@/data` → `@/components`.
- 텍스트/주석/커밋은 한국어 기본. 커밋은 conventional(`feat(nav):` 등).

## 6. 작업 시 주의사항
- **`brand.ts` 수정 시** — 주소·사업자번호·소셜에 아직 `// TODO`(실주소/우편번호 등)와 빈 `social.*`가 있음. 값 채울 때 JSON-LD(`OrganizationJsonLd`, `LocalBusinessJsonLd`)와 footer가 자동 반영되는지 확인.
- **`seo-policy.ts` 크롤러 목록 변경 시** — Cloudflare 관리형 AI봇 차단 규칙과 **모순되지 않게** 맞출 것(레포엔 안 보이는 Cloudflare robots.txt가 별도로 존재).
- **리뉴얼 페이지 수정 시** — `public/assets` 등 동기화 결과물을 직접 고치지 말 것(다음 sync에 덮임). 원본 폴더 수정 → `pnpm sync:renewal` → `CI=true npx vitest run`(시안 흔적·추적 코드 잔존 검사) 순서. 시안 문구를 운영 문구로 바꾸는 규칙은 `site-html.ts`의 `PREVIEW_COPY`. 새 페이지는 `src/site/registry.ts` + `src/app/<경로>/route.ts` 추가.
- **(이전 React 사이트) `Header.tsx` 관련** — 오버레이는 `<header>`의 **형제**로 둬야 함. header에 `backdrop-blur`(backdrop-filter)가 있어 fixed 자식의 containing block이 되면 오버레이가 뷰포트가 아닌 header 높이로 붕괴됨. 스크롤 락은 `<html>`(documentElement) 대상 — body는 스크롤러가 아니라 안 먹힘. 이 로직은 `hooks/useScrollLock.ts`·`useScrolled.ts`에 있음.
- **`globals.css`에 `scroll-behavior: smooth` 넣지 말 것** — App Router의 라우트 변경 시 즉시 top 이동을 깨뜨림(과거 버그).
- **환경변수(하드코딩 금지)**: `RESEND_API_KEY`(문의 메일), `CONTACT_FROM_EMAIL`·`CONTACT_TO_EMAIL`, `CONTACT_DRY_RUN=true`(메일 안 보내고 로그만), `NEXT_PUBLIC_SITE_URL`, analytics 키들 + CMS용 `DATABASE_URL`(Railway Postgres 자동 주입)·`ADMIN_PASSWORD`(평문)·`ADMIN_JWT_SECRET`·`CLOUDINARY_URL`. Railway 대시보드에서 관리. ⚠️ 로컬 `.env`에서 값에 `$`가 있으면 `\$`로 이스케이프(Next가 $변수 확장함).
- **Prisma 스키마 변경 시** — 마이그레이션 SQL을 레포에 커밋(`prisma migrate diff` 또는 로컬 `migrate dev`). 배포 시 `railway.json` startCommand의 `prisma migrate deploy`가 적용. Prisma는 **v6 고정**(v7은 설정 체계가 다름). Docker(alpine)용 `binaryTargets` 유지.
- **검증**: 변경 후 `npx tsc --noEmit` + `CI=true npx vitest run`. 프리뷰는 헤드리스 `innerHeight:0`이라 스크롤 기반 상태 검증이 불안정 — 내부 페이지(`/about`)의 solid 헤더로 대체 확인.
- **정직성 원칙**: 포트폴리오/사례는 실제 데이터만. 브로슈어/PPTX 생성기와 일부 칼럼 본문에 남아있는 가공 사례는 실제 값으로 교체 대상(런칭 전 정리 항목).

## 7. 외부 의존성
- **Resend** — 문의 메일 발송 (`api/contact`). `RESEND_API_KEY` 필요.
- **Railway Postgres + Prisma 6** — 칼럼 CMS 저장소. **Cloudinary** — 칼럼 이미지/썸네일 업로드(`CLOUDINARY_URL`). **Tiptap 3** — 관리자 에디터. **@tailwindcss/typography** — 칼럼 본문 `prose` 스타일.
- **framer-motion** — 애니메이션, **swiper** — 히어로 슬라이더(`globals.css`에서 CSS import), **lucide-react** — 아이콘, **react-hook-form + zod** — 폼/검증, **tailwind-merge + clsx** — `cn()`.
- **analytics** — 공개 페이지는 `lib/site-analytics.ts`(GA4·GTM·Naver·Clarity·Meta·Kakao, env 게이팅), 관리자 React 화면은 `components/analytics/*`. 설정은 `config/analytics.ts`, 키는 env.
- **Railway**(호스팅) + **Cloudflare**(DNS·엣지·AI봇 차단). ⚠️ `www.webslab.co.kr` CNAME 미설정 상태 — Cloudflare에서 `www → webslab.co.kr`(프록시 ON) 추가 필요.
