# websLAB SEO/AEO 전략 PRD — "홈페이지 리뉴얼 전문" Authority Play

- **작성일**: 2026-05-30
- **대상 사이트**: https://webslab.co.kr
- **시간 지평**: 6개월 (2026-06 ~ 2026-11)
- **상태**: Approved (브레인스토밍 → 사용자 승인 완료, 구현 계획은 별도 writing-plans 문서)

---

## 1. Context & Background

websLAB는 한국 B2B 기업 대상 홈페이지 제작·리뉴얼 에이전시다. 기술 차별점은 Next.js + Headless CMS + Edge Hosting 조합으로, Cafe24·Imweb·그누보드 위주의 기존 시장에서 "모던 스택 기반 기업 사이트"라는 포지셔닝을 가지고 있다.

사이트는 2026-05 기준 기술적 기반은 탄탄하다 — Next.js 14 App Router, JSON-LD (Organization, WebSite, Breadcrumb), 자동 sitemap/robots, Pretendard 폰트, Railway/Docker 배포가 모두 구축되어 있다. 그러나 **콘텐츠 본문 페이지가 사실상 없다** — 칼럼 4편·백서 3편이 모두 스텁 상태이며, `/column/[slug]`와 `/whitepaper/[slug]` 동적 라우트가 구현되어 있지 않다. 메타·schema 인프라는 있는데 실어 나를 콘텐츠가 없는 상황이다.

이번 PRD는 이 상황에서 **6개월 안에 "홈페이지 리뉴얼" 키워드 군에서 Google 1페이지 진입**을 만들기 위한 SEO/AEO 전략 전체를 정의한다.

## 2. Goals & Success Metrics

### 핵심 목표
6개월 후 **"기업 홈페이지 리뉴얼" 키워드 군에서 Google 검색 1페이지(상위 10위) 진입**, **월 4~6건의 유기 인바운드 리드** 확보.

### KPI

| 시점 | Tier 1 키워드 평균 순위 | 유기 세션 / 월 | 유기 리드 / 월 |
|---|---|---|---|
| **D0 (현재)** | 측정 불가 (노출 거의 없음) | <50 | 0~1 |
| **M3 (3개월)** | 30위 → 15위 | 500 | 2~3 |
| **M6 (6개월)** | 15위 → 5~10위 (1페이지) | 1,500 | 4~6 |
| **M12 (후행)** | Tier 1 다수 5위 이내 | 3,000+ | 8~10 |

**후행 지표**: Ahrefs DR(Domain Rating) **+10~15p**, referring domains **30+개 신규 확보**.

### 타깃 키워드 군 (잠정 — M1 키워드 리서치에서 확정)

| Tier | 키워드 예시 | 의도 | 6개월 목표 |
|---|---|---|---|
| **T1 — Money** | 홈페이지 리뉴얼 / 홈페이지 리뉴얼 비용 / 기업 홈페이지 리뉴얼 / 리뉴얼 견적 | 구매 직전 | 1페이지 |
| **T2 — Long-tail** | 홈페이지 리뉴얼 시기 / 리뉴얼 vs 신규제작 / 리뉴얼 효과 측정 / URL 마이그레이션 SEO | 정보 탐색 | 5위 이내 |
| **T3 — Brand** | websLAB / websLAB 리뉴얼 / websLAB 후기 | 브랜드 | 1위 |

## 3. Non-goals

이 PRD에서 **명시적으로 제외**하는 항목:

- 신규 제작(non-리뉴얼) 키워드 — 별도 PRD에서 다룸
- 영어권/해외 시장
- 단기 quick-win 위주의 long-tail 흩뿌리기 전략
- 유료 광고 (Google Ads, Naver 광고) — 별도 PRD
- Naver 메인 채널화 — 보조 채널로만 가볍게 운영

## 4. Target Audience (ICP)

- **회사 규모**: 한국 중견 기업, 직원 50~500명
- **포지션**: 마케팅/기획 담당자, 의사결정자 본인 또는 의사결정자 보고 라인
- **상황**: 보유 사이트가 5년 이상 노후 (디자인/기술 둘 다)
- **예산**: 3,000만 ~ 1억원
- **검색 행동**: 주로 Google (테크 친화적), 의사결정 전 5~8개 글 정독, 케이스 스터디 무게 큼

## 5. Topic Cluster Architecture

### Hub-and-Spoke 모델

```
                  [Pillar Page]
       "기업 홈페이지 리뉴얼 완벽 가이드 2026"
        /          |          |          \
   [Cluster A] [Cluster B] [Cluster C] [Cluster D~F]
   (시기/판단) (비용/견적) (프로세스)    (마이그/UX/기술)
        \          |          |          /
                [Case Studies × 10]
                       ↓
                  [Contact CTA]
```

### Pillar (1편)

**"기업 홈페이지 리뉴얼 완벽 가이드 2026 — 시기·비용·프로세스 전 과정"**
- 3,000~5,000자
- FAQ + HowTo schema
- 모든 cluster로 hub 링크
- 핵심 진입 지점: "리뉴얼 vs 신규제작 판단" 섹션
- TL;DR 박스 (도입부), Direct answer block, Author byline

### Cluster (25편, 6개 카테고리)

| 카테고리 | 편수 | 대표 제목 예시 |
|---|---|---|
| **A. 시기 / 판단** | 4 | 리뉴얼 시기 판단 7가지 신호 / 리뉴얼 vs 신규제작 / ROI 측정 / 권위 손실 없는 리뉴얼 원칙 |
| **B. 비용 / 견적** | 4 | 규모별 견적 범위 / 견적 필수 항목 12가지 / 비용 절감 vs 절감 금지 / RFP 작성 가이드 |
| **C. 프로세스 / 일정** | 4 | 표준 6단계 프로세스 / 규모별 표준 기간 / 클라이언트 준비 사항 / 위험 신호 5가지 |
| **D. 마이그레이션 / SEO 보호** | 5 | URL 마이그레이션 SEO / 301 매핑 실전 / 리뉴얼 직후 30일 체크리스트 / 데이터 이관 절차 / 사이트맵·robots 점검 |
| **E. 디자인 / UX** | 4 | B2B 디자인 트렌드 2026 / 컨버전 UX 패턴 7가지 / 모바일 우선+CWV / WCAG 접근성 |
| **F. 기술 / 플랫폼** | 4 | WordPress/Cafe24/Imweb → Next.js / Headless CMS 운영 / 운영 체크리스트 / CWV 만점 가이드 |

### Case Studies (10편, 포트폴리오 deep-dive)

이미 포트폴리오 12개 보유 → 그 중 10개를 long-form case study로 확장한다.
- 각 케이스: 1,500~2,500자
- 표준 구조: 클라이언트 배경 / 리뉴얼 전 문제 / 의사결정 과정 / 접근 / 결과 (메트릭) / 배운 점
- 관련 cluster 3~5개 inline 링크
- 실제 스크린샷 + 정량 데이터 포함

### 기존 콘텐츠 재배치

| 기존 (스텁) | 처리 |
|---|---|
| `renewal-vs-rebuild` | → Cluster A2 (본문 작성) |
| `seo-checklist-for-b2b` | → Cluster D15 (리뉴얼 직후 SEO 체크리스트로 리포지셔닝) |
| `cms-strategy-for-marketing-team` | → Cluster F23 (Headless CMS) |
| `why-business-website-matters` | → **deprecate** (리뉴얼 영역 밖) — 410 응답 또는 Pillar 도입부 흡수 |
| WP `business-website-buyers-guide-2025` | → "리뉴얼 구매자 가이드"로 리포지셔닝 + 본문 작성 |
| WP `modern-stack-for-corporate-site` | → Cluster F22~25 묶음의 다운로드 자산 |

### Internal Linking 규칙

1. **Pillar ↔ Cluster**: 양방향 1회 이상
2. **Cluster ↔ Cluster (lateral)**: 같은 카테고리 형제 글 2~3개씩
3. **Case Study → Cluster**: 케이스에서 쓴 노하우의 cluster 3~5개
4. **모든 페이지 끝**: Pillar 또는 Contact CTA
5. **앵커 텍스트**: 키워드 자연 노출 (과최적화 회피, 동일 텍스트 반복 금지)

## 6. Technical SEO

| 항목 | 현재 | 변경 |
|---|---|---|
| Schema | Organization, WebSite, Breadcrumb | **+ Article, FAQPage, HowTo, Service, Person(저자)** |
| Sitemap | 단일 `sitemap.xml` | **3개 분리** (`pages`, `articles`, `cases`) + `sitemap_index.xml` |
| `/column/[slug]` 라우트 | ❌ 없음 (가장 큰 공백) | **ISR 동적 라우트 신설** + `generateMetadata` |
| `/whitepaper/[slug]` 라우트 | ❌ 없음 | **다운로드 게이트 페이지 신설** (이메일 캡처) |
| `robots.txt` | 기본 | **GPTBot, Claude-Web, PerplexityBot 명시 허용** |
| Core Web Vitals | 측정 안 됨 | **LCP < 2.5s / INP < 200ms / CLS < 0.1** 목표 + Vercel/Railway analytics |
| 404 / 410 | 404 일괄 | **deprecate 페이지는 410**, 영구 이전만 301 |
| 폰트 | Pretendard 풀 셋 | **한글 subset로 KB 절감** (LCP 개선) |

## 7. On-page SEO 패턴 (모든 글 강제 적용)

- **Title**: `{타깃 키워드} — {부제} | websLAB` (60자 이내)
- **Meta description**: 120~155자, 키워드 + 가치 제안 + CTA tone
- **H1 1개**, H2가 cluster 진입점
- **Direct answer block**: 도입부 1~2문장 "정답" 명시 (snippet 노출용)
- **TL;DR 박스**: 글 상단 핵심 요약 — AI 인용 우호
- **Author byline**: 대표자 + Person schema + 저자 프로필 페이지 링크
- **Image alt**: 의도 있는 묘사 (keyword stuffing 회피)
- **URL slug**: 영문 lowercase, hyphen, 짧고 의미 명확

## 8. AEO 전술

Google AI Overviews + ChatGPT/Perplexity/Naver Cue 인용을 목표.

1. **FAQ schema** — 모든 cluster 글 마지막. AI Overviews 데이터 소스 직격
2. **HowTo schema** — 프로세스/가이드 글
3. **Atom-friendly 구조** — 한 섹션 = 한 질문에 한 답 (AI 추출 단위)
4. **`/llms.txt`** — 사이트 루트에 주요 페이지 인덱스를 AI 친화적으로 제공 ([llmstxt.org](https://llmstxt.org) 제안 표준)
5. **Author authority** — Person schema + 저자 프로필(`/about` 강화) + `sameAs` (LinkedIn) → E-E-A-T
6. **Source citation** — 인용/통계 출처 명시 (AI가 신뢰)

## 9. Off-page / Authority Building

목표: 6개월에 **referring domains 30+**

| 채널 | 활동 | 예상 백링크 |
|---|---|---|
| **게스트 포스트** | EO 블로그, 디지털인사이트, ChannelTalk 매거진 등 한국 B2B 매체 | 6~10 |
| **자체 자료 배포** | 리뉴얼 구매자 가이드 백서, 비용 계산기 위젯 (embed 코드 제공) | 5~10 |
| **HARO / 영어 답변** | 한국 시장 인사이트 답변 → 영어 매체 인용 | 3~5 |
| **OSS / Tech 커뮤니티** | Next.js Korea 컴포넌트, schema 헬퍼 — 자연 백링크 | 3~5 |
| **인터뷰 / 발표** | 디자인 컨퍼런스, 스타트업 미디어 인터뷰 | 2~5 |
| **Naver 보조 (가볍게)** | Naver Place 등록, 카카오 비즈 프로필 (Local + 브랜드 검색) | — |

## 10. Measurement Infrastructure

| 도구 | 측정 항목 | 주기 | 비용 |
|---|---|---|---|
| **Search Console** | 노출/클릭/평균 순위/CTR | 주간 | 무료 |
| **GA4 + 전환 이벤트** | `contact_form_submit` (리드), `whitepaper_download` (의도), `pillar_to_contact` (퍼널) | 주간 | 무료 |
| **Ahrefs lite** | 키워드 순위, 백링크, DR | 월간 | $99/월 |
| **Vercel/Railway analytics** | Core Web Vitals | 주간 | 포함 |
| **Looker Studio 대시보드** | 월간 종합 리포트 | 월간 | 무료 |
| **AEO 수동 측정** | ChatGPT/Perplexity/Claude/Naver Cue 인용 빈도 | 월 1회 | 무료 |

### 리뷰 cadence

- **주간 (월요일 30분)**: 발행 진척, SC 노출 증감
- **월간 (월말 1시간)**: 키워드 순위, organic sessions, 리드 수, 전략 조정 검토
- **분기 (90일 단위 반나절)**: DR, referring domains, **피벗 결정 지점**

## 11. Phasing & Milestones

총 콘텐츠: Pillar 1 + Cluster 25 + Case 10 = **36편 / 24주 (주 평균 1.5편)**

| 월 | 주제 | 콘텐츠 | 인프라 / Off-page | 마일스톤 |
|---|---|---|---|---|
| **M1** | Foundation | Pillar 1편 발행 | Schema 확장, `/column/[slug]` 라우트, `llms.txt`, sitemap 분리, 키워드 리서치 도구 도입 | Search Console + GA4 측정 시작 |
| **M2** | Sprint 1 | Cluster A 4편 + B 2편 = **6편** | Pretendard subsetting, CWV 1차 측정 | 첫 인덱싱 + 노출 데이터 |
| **M3** | Sprint 2 | Cluster B 2편 + C 4편 + D 1편 = **7편** | 첫 게스트 포스트 1편 | **3개월 차 KPI 체크 — Tier 1 평균 30→15위** |
| **M4** | Sprint 3 | Cluster D 4편 + Case 2편 = **6편** | 백서 다운로드 게이트, 게스트 포스트 1편 | 첫 리드 컨버전 측정 |
| **M5** | Sprint 4 | Cluster E 4편 + Case 3편 = **7편** | AEO 인용 빈도 측정 시작, 게스트 포스트 1편 | DR 1차 측정 |
| **M6** | Sprint 5 | Cluster F 4편 + Case 5편 = **9편** | 전체 사이트 audit, internal linking 점검 | **6개월 차 최종 KPI — Tier 1 평균 5~10위, 리드 월 4~6건** |

## 12. Risks & Mitigations

| 리스크 | 가능성 | 영향 | 완화책 |
|---|---|---|---|
| 콘텐츠 생산 페이스 둔화 (주 1.5편 → 0.5편) | 중 | **큼** | AI 드래프트 워크플로 백업, 월간 리뷰에서 조기 감지 |
| Google 알고리즘 업데이트 충격 | 중 | 중 | E-E-A-T 신호 강화 (저자 bylines, Person schema), white-hat only |
| Case study 클라이언트 동의 거부 | 중 | 중 | 익명화 옵션 사전 준비, NDA 협의 표준 절차 |
| AEO 표준(llms.txt) 비채택 | 중 | 저 | 기본 schema는 무조건, llms.txt는 부차 |
| 키워드 의도 미스매치 | 중 | **큼** | 첫 5편 후 SC 데이터로 의도 검증, 즉시 피벗 |
| Core Web Vitals 미달 | 저 | 중 | M1에 측정+개선 우선, Vercel analytics 활용 |
| 경쟁사 같은 니치 진입 | 저 | 중 | 콘텐츠 깊이 + case study로 진입장벽 |

## 13. Budget

- 콘텐츠 작성: **내부** (외주비 0)
- Ahrefs lite: **월 $99 (~₩15만)**
- Naver Place / 카카오 비즈 프로필: 무료
- 게스트 포스트: cross-promotion 또는 무료
- **합계: 월 ~₩15~30만 / 6개월 ~₩90~180만** (도구 비용만)

## 14. Open Decisions / Future Considerations

이 PRD가 다루지 않으며 별도 결정이 필요한 항목:

- **Headless CMS 도입 시점**: 현재 모든 콘텐츠가 TypeScript 데이터 파일이라 비기술 인력이 발행 못 함. 36편 운영 시 CMS 도입 필요 여부 — M3 시점에 판단.
- **저자 다각화**: 대표자 단일 저자 vs 추후 외부 전문가 게스트 저자 추가 — E-E-A-T에 영향.
- **번역/영문판**: M6 KPI 달성 후 영어권 시장 진입 시 hreflang 전략.
- **광고 통합**: M3 이후 organic 데이터를 기반으로 retargeting 광고 PRD 검토.
- **신규 제작 키워드**: M6 이후 리뉴얼 권위가 자리 잡으면 인접 토픽 확장 PRD.
- **Newsletter / Lead nurturing**: M4 백서 다운로드 게이트에서 모인 이메일을 어떻게 nurture할지 별도 시퀀스 설계.
