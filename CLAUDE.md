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
  components/  React UI — 관리자 화면 전용. admin/(편집기·폼), analytics/(관리자 화면 분석 태그), common/(Button·Container·Heading)
  lib/         순수 유틸 (테스트 대상). jsonld, metadata, seo-policy, validators, cn, xml, db, posts, slug, column-feed, site-html, inquiry-mail
  data/        콘텐츠 데이터 (칼럼·포트폴리오·네비·히어로 등). 코드 아님
  config/      brand · site · analytics 설정 (단일 소스)
prisma/        schema.prisma + migrations (칼럼 CMS의 Post 모델)
public/        images(column/ = 칼럼 썸네일), fonts, og, site/(운영 레이어 ws-forms.js·ws-site.css·ws-media.js),
               assets·wp-content·wp-includes(리뉴얼 동기화 — 직접 수정 금지, 원본 폴더에서 고친 뒤 sync)
```
루트: `next.config.mjs`(standalone), `Dockerfile`, `railway.json`, `.gitignore`(에이전트 아티팩트 제외)

## 4. 자주 만지는 핵심 모듈
- **`src/config/brand.ts`** — 회사명·주소·연락처·사업자번호 등 **단일 소스**. 사이트 전역이 여기서 값을 가져옴. 하드코딩 금지, 항상 여기 수정.
- **`src/config/site.ts`** — `siteConfig.baseUrl`, `absoluteUrl(path)`. 절대 URL은 이 함수로만 생성.
- **`src/data/*.ts`** — 칼럼(`columnPosts.ts`, 칼럼 본문이라 큼)·포트폴리오(`portfolios.ts`, 사이트맵·llms.txt·사례 OG 소스)·저자·칼럼 분류. 공개 페이지 문구는 리뉴얼 원본 HTML에 있다.
- **`src/lib/jsonld.ts`** — JSON-LD 스키마 순수 함수(organization/article/faqPage/service…). `site/render.ts`·`site/column-pages.ts`가 head에 넣는다. 구조화 데이터 변경은 여기.
- **`src/lib/seo-policy.ts`** — robots.txt 크롤러 정책(AI 검색봇 허용 / 학습봇 차단). Cloudflare 관리형 차단과 **일치시켜야** 함(테스트가 같은 봇의 허용·차단 동시 지정을 잡는다). 페이지 수정일(`STATIC_PAGE_DATES`)은 **`src/site/page-dates.json`에서 온다** — `pnpm sync:renewal`이 본문(<main>) 글자·이미지 지문이 바뀐 날만 그날 날짜로 올린다(스타일만 바꾼 날은 그대로). 손으로 고치지 말 것. 리뉴얼 밖 문서(약관·개인정보)만 `MANUAL_PAGE_DATES`.
- **사이트맵·RSS** — `/sitemap.xml`(인덱스) → pages·articles·cases. pages에는 본문 사진(`pageImages`)이 image:image로 붙는다. `/rss.xml`은 칼럼(정적+DB, **본문 전체** `content:encoded` — 요약·본문·FAQ) + 제작 사례를 최신순으로 최대 50건. 네이버 서치어드바이저에는 `https://webslab.co.kr/sitemap.xml`과 `https://webslab.co.kr/rss.xml`을 제출한다. 메타 설명은 `clampDescription`이 155자 안쪽으로 자른다.
- **`src/lib/metadata.ts`** — `buildMetadata()`로 페이지 메타/OG 생성.
- **`src/components/common/Button.tsx`** — `variants`/`sizes` 맵 기반. `ButtonLink`(a) / `Button`(button) 두 형태. 새 버튼 스타일은 맵에 추가.
- **`src/lib/site-html.ts`** — 리뉴얼 시안 → 운영 HTML 변환(순수 함수, `site-html.test.ts`가 전 페이지 검사): 검색 차단·시안 문구 제거, **다른 회사 추적·인증 코드 제거**(`FOREIGN_TRACKING_MARKERS`), 링크 정리, 푸터 사업자 정보(brand.ts), 문의 폼 운영화(실제 개인정보 동의 체크·선택 항목 완화). 원본 폴더는 건드리지 않고 여기서 일괄 변환 → 재동기화해도 결과 동일.
- **`src/site/render.ts`** — 리뉴얼 페이지 공통 head(canonical·OG·소유확인·JSON-LD·분석 `lib/site-analytics.ts`) 주입. 공개 라우트는 전부 `sitePageHtml()`/`shellHtml()`만 호출. `ws-forms.js`·`ws-site.css`는 HTML에 **인라인**(렌더 차단 요청 0), `ws-media.js`만 defer 링크. `htmlResponse()`는 `s-maxage=600`(칼럼 목록·DB 글 60초, 404 no-store)을 보내지만 **Cloudflare는 HTML을 기본 캐시하지 않는다** — 대시보드 Cache Rule(/admin·/api 제외, 원서버 TTL 존중)을 켜야 원서버 왕복(~1초 TTFB)이 사라진다.
- **`public/site/ws-forms.js`** — 폼 4종(견적 `.uw-inquiry-form` · 간편 `#uwQiForm` · 유지보수 `#mxForm` · 채용 지원 `#crForm`)을 `/api/contact`로 전송. `<head>` 동기 로드 + window 캡처 submit으로 시안 스크립트(공식 페이지 이동·mailto·admin-ajax)보다 먼저 받는다. 성공 시 GA `contact_form_submit`(관리자 통계 집계 기준). 채용 지원은 리드가 아니라 `career_apply_submit`만 보낸다.
- **`src/app/api/contact/route.ts`** — 문의 수신 → Resend 메일. multipart = 리뉴얼 폼 4종(`lib/validators/inquiry.ts`, 견적·채용만 첨부 최대 3개·파일당 10MB·합계 25MB, 메일 본문 `lib/inquiry-mail.ts`). multipart가 아니면 415.
- **칼럼 썸네일** — `pnpm build:thumbnails`(`scripts/build_column_og.py`)가 회사소개서 표지 스타일로 `public/images/column/<slug>.png` + 기본 OG `public/og/default.png` 생성. 새 정적 칼럼을 넣으면 다시 실행.
- **칼럼 CMS(`/admin`)** — Railway Postgres + Prisma(`lib/db.ts` 싱글턴). 정적 12편(`data/columnPosts.ts`)은 그대로, **DB는 신규 글 전용** — `lib/column-feed.ts`가 병합(최신순, DB 장애 시 정적 폴백). 한글 제목 → 로마자 slug 자동(`lib/slug.ts`, 정적 슬러그 예약 + 충돌 시 `-2`). 인증: `ADMIN_PASSWORD` 평문 비교(timingSafeEqual, 로그인 라우트) + jose JWT(미들웨어 Edge 검증), `middleware.ts`가 `/admin/*`·`/api/admin/*` 보호. 에디터: Tiptap(`components/admin/Editor.tsx`) + Cloudinary 업로드(`/api/admin/upload`).

## 5. 코딩 컨벤션
- **className 병합은 항상 `cn()`** (`@/lib/cn`, clsx + tailwind-merge). 조건부 클래스도 `cn(base, cond && '...')`.
- **variant/size는 `Record<Variant, string>` 맵** 패턴 (Button 참고). switch/if 나열 지양.
- **콘텐츠는 컴포넌트에 하드코딩하지 말고 `data/`로** 분리 후 map.
- **설정값(브랜드·URL·연락처)은 `config/`에서** import. 리터럴 금지.
- 클라이언트 컴포넌트/훅은 최상단 `'use client'`.
- 에러 처리: API route는 try/catch로 감싸고 `NextResponse.json({error}, {status})` 반환 + `console.error('[태그]', …)`. 사용자 노출 문구는 한국어.
- 입력 검증은 **zod 스키마**(`lib/validators/`) — API(`/api/contact`, 관리자 글 저장)가 쓴다. 브라우저 쪽 검사는 `public/site/ws-forms.js`가 같은 규칙으로 맞춘다.
- import 순서: 외부 → `@/lib`·`@/config`·`@/hooks`·`@/data` → `@/components`.
- 텍스트/주석/커밋은 한국어 기본. 커밋은 conventional(`feat(nav):` 등).

## 6. 작업 시 주의사항
- **`brand.ts` 수정 시** — 주소·사업자번호·소셜에 아직 `// TODO`(실주소/우편번호 등)와 빈 `social.*`가 있음. 값 채울 때 JSON-LD(`OrganizationJsonLd`, `LocalBusinessJsonLd`)와 footer가 자동 반영되는지 확인.
- **`seo-policy.ts` 크롤러 목록 변경 시** — Cloudflare 관리형 AI봇 차단 규칙과 **모순되지 않게** 맞출 것(레포엔 안 보이는 Cloudflare robots.txt가 별도로 존재).
- **리뉴얼 페이지 수정 시** — `public/assets` 등 동기화 결과물을 직접 고치지 말 것(다음 sync에 덮임). 원본 폴더 수정 → `pnpm sync:renewal` → `CI=true npx vitest run`(시안 흔적·추적 코드 잔존 검사) 순서. 시안 문구를 운영 문구로 바꾸는 규칙은 `site-html.ts`의 `PREVIEW_COPY`. 새 페이지는 `src/site/registry.ts` + `src/app/<경로>/route.ts` 추가.
- **정적 파일은 30일 캐시**(`next.config.mjs` headers — `/assets`·`/wp-content`·`/images` 등). CSS·JS를 고치면 HTML의 `?v=`를 반드시 올리고, 이미지·영상을 바꿀 때는 **파일 이름을 바꾸거나 `?v=`를 붙일 것** — 같은 이름으로 덮으면 브라우저·Cloudflare가 최대 30일 옛 파일을 보여준다.
- **CSS 묶음**: `pnpm sync:renewal`이 페이지 head의 로컬 CSS를 순서대로 합쳐 `public/assets/bundle/<내용해시>.css` 두 개(전 페이지 공통 테마 + 페이지별)로 바꾸고 **lightningcss로 압축**한다(gzip 뒤 39KB→23KB) — 렌더 차단 요청 29개 → 2개. 원본 HTML은 개별 link 그대로 두고 고치면 되고(해시라 캐시 자동 갱신), 묶음 파일을 직접 고치지 말 것. CSS 안 상대 `url()`은 절대 경로로 바뀌고, 묶음에 들어간 개별 CSS 파일은 public에 남지 않는다.
- **운영 변환의 속도 처리**(`site-html.ts` `optimizeAssets`): 안 쓰는 WP 인라인 스타일 제거, **jQuery(+migrate)·uw-board.js·uw-inquiry.js 제거**(`UNUSED_THEME_SCRIPTS` — 테마 JS 중 jQuery를 쓰는 건 그 둘뿐이고, 전송은 ws-forms.js·파일 위젯은 main.js·URL 추가는 ws-forms.js가 맡는다. 새 테마 스크립트가 `$`를 쓰면 안 됨), **한글 폰트는 Pretendard 가변판**(`public/site/pretendard-v1.3.9.css` — 정적판 굵기 7종 링크를 이 사본으로 바꾼다. family만 Pretendard로 바꾼 사본이고 폰트 파일은 버전 고정 jsDelivr. 첫 방문 폰트 약 600KB → 330KB), **아이콘 폰트는 XEIcon 부분집합**(jsDelivr 링크 제거 → `public/site/xeicon-sub.woff2` 1.6KB + `ws-site.css` 규칙. 새 `xi-*` 글리프를 쓰면 테스트가 잡으니 부분집합을 다시 뽑을 것), 외부 스크립트 전부 `defer`(폼 연결 `ws-forms.js`만 동기), `<video autoplay>`는 `data-ws-autoplay`+`preload="none"`으로 바꿔 `ws-media.js`가 보일 때만 재생(원본에 autoplay를 써도 됨)
- **쉴 때는 아무것도 움직이지 않게**: 작은 점 하나라도 `infinite` 애니메이션이 돌면 Chrome이 화면 전체를 120Hz로 계속 다시 그려(헤더·AI 입력창의 backdrop blur 포함) 모든 페이지가 무거워진다(2026-11-05 트레이스로 확인). 무한 애니메이션이 있는 섹션은 `site-html.ts`가 `data-ws-live`를 붙이고 `ws-site.css`+`ws-media.js`가 화면 밖에서 멈춘다 — 새 섹션에 무한 애니메이션을 넣으면 그 클래스 목록에 추가. 항상 떠 있는 요소(헤더·AI 입력창)는 무한 애니메이션 금지(hover/open 때만). WebGL(오브·오로라·지구)은 load 뒤 한가할 때 생성, 30fps 상한, 화면 밖 정지., Splitting.js는 버전 고정 jsDelivr. 새 인라인 스크립트가 외부 라이브러리를 **바로** 부르면 defer 때문에 깨진다 — `DOMContentLoaded` 안에서 부를 것.
- **반응형 기준**: PC ≥1025px · 태블릿 ≤1024px(헤더가 햄버거로) · 모바일 ≤768px · 작은 모바일 ≤480px. 2026-11-06에 테마의 1180px·홈 섹션의 1100px를 1024px로 내렸다(맥북 창을 조금만 줄여도 태블릿으로 바뀌던 문제). 새 CSS도 이 넷을 쓸 것. 예외는 내용 폭 때문에 생긴 규칙뿐(일정표 1100px 가로 스크롤, 간편상담 패널).
- **`globals.css`에 `scroll-behavior: smooth` 넣지 말 것** — App Router의 라우트 변경 시 즉시 top 이동을 깨뜨림(과거 버그).
- **환경변수(하드코딩 금지)**: `RESEND_API_KEY`(문의 메일), `CONTACT_FROM_EMAIL`·`CONTACT_TO_EMAIL`, `CONTACT_DRY_RUN=true`(메일 안 보내고 로그만), `NEXT_PUBLIC_SITE_URL`, analytics 키들 + CMS용 `DATABASE_URL`(Railway Postgres 자동 주입)·`ADMIN_PASSWORD`(평문)·`ADMIN_JWT_SECRET`·`CLOUDINARY_URL`. Railway 대시보드에서 관리. ⚠️ 로컬 `.env`에서 값에 `$`가 있으면 `\$`로 이스케이프(Next가 $변수 확장함).
- **Prisma 스키마 변경 시** — 마이그레이션 SQL을 레포에 커밋(`prisma migrate diff` 또는 로컬 `migrate dev`). 배포 시 `railway.json` startCommand의 `prisma migrate deploy`가 적용. Prisma는 **v6 고정**(v7은 설정 체계가 다름). Docker(alpine)용 `binaryTargets` 유지.
- **검증**: 변경 후 `npx tsc --noEmit` + `CI=true npx vitest run`. 프리뷰는 헤드리스 `innerHeight:0`이라 스크롤 기반 상태 검증이 불안정 — 내부 페이지(`/about`)의 solid 헤더로 대체 확인.
- **정직성 원칙**: 포트폴리오/사례는 실제 데이터만. `scripts/build_brochure.py`·`build_pptx.js`(옛 회사소개서 생성기)와 일부 칼럼 본문에 남은 가공 사례는 실제 값으로 교체 대상. 사이트가 내려주는 회사소개서는 리뉴얼 원본의 `assets/webslab/files/webslab-company-profile.pdf`.

## 7. 외부 의존성
- **Resend** — 문의 메일 발송 (`api/contact`). `RESEND_API_KEY` 필요.
- **Railway Postgres + Prisma 6** — 칼럼 CMS 저장소. **Cloudinary** — 칼럼 이미지/썸네일 업로드(`CLOUDINARY_URL`). **Tiptap 3** — 관리자 에디터. **@tailwindcss/typography** — 칼럼 본문 `prose` 스타일.
- **lucide-react** — 관리자 아이콘, **zod** — 입력 검증, **tailwind-merge + clsx** — `cn()`. 공개 페이지 애니메이션은 리뉴얼 레이어의 바닐라 JS(`assets/webslab/*.js`, 히어로 오로라는 WebGL `aurora-v1.js`).
- **analytics** — 공개 페이지는 `lib/site-analytics.ts`(GA4·GTM·Naver·Clarity·Meta·Kakao, env 게이팅; 스텁·큐는 head에서 바로, 외부 스크립트는 **load 뒤 한가할 때** 받는다 — 첫 화면과 경쟁하지 않게. 큐에 쌓인 이벤트는 스크립트가 오면 전송됨), 관리자 React 화면은 `components/analytics/*`. 설정은 `config/analytics.ts`, 키는 env.
- **Railway**(호스팅) + **Cloudflare**(DNS·엣지·AI봇 차단). `www`는 Cloudflare Redirect Rule로 apex에 301.
