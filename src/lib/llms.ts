// llms.txt / llms-full.txt 본문 — AI 검색(ChatGPT·Perplexity·Claude 등)이 회사를 한 번에 파악하도록
// 사이트에 이미 공개된 사실만 모은다(회사 정보 brand.ts, 문답은 /faq 본문, 칼럼·사례는 data/).
// 순수 함수 — 라우트가 값을 넣어 부른다.

import type { Brand } from '@/config/brand';
import type { ColumnPost } from '@/data/columnPosts';
import type { Portfolio } from '@/data/portfolios';

export type LlmsInput = {
  base: string;
  brand: Brand;
  faqs: { question: string; answer: string }[];
  posts: ColumnPost[];
  cases: Portfolio[];
};

/** HTML 본문 → 읽을 수 있는 글(제목은 ###, 목록은 -, 표는 | 로) */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<h[2-6][^>]*>/g, '\n\n### ')
    .replace(/<li[^>]*>/g, '\n- ')
    .replace(/<\/(td|th)>\s*<(td|th)[^>]*>/g, ' | ')
    .replace(/<\/(p|h[2-6]|ul|ol|table|tr|blockquote|div|section)>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function header({ base, brand }: LlmsInput): string[] {
  const a = brand.address;
  return [
    `# ${brand.nameKo} (${brand.name})`,
    '',
    `> ${brand.description} 홈페이지 유지보수와 업무 자동화 프로그램 개발도 함께 합니다.`,
    '',
    '## 회사 정보',
    '',
    `- 상호: ${brand.nameKo} (${brand.name})`,
    `- 대표: ${brand.legal.representativeName}`,
    `- 사업자등록번호: ${brand.legal.businessNumber}`,
    `- 주소: ${a.streetAddress}`,
    `- 서비스 지역: 대한민국 전역 (사무실은 ${a.addressLocality})`,
    `- 이메일: ${brand.email}`,
    `- 전화: ${brand.phone}`,
    `- 상담 시간: ${brand.hours.weekdays} (${brand.hours.note})`,
    `- 견적 문의: ${base}/contact`,
    '',
    '## 서비스',
    '',
    `- [기업 홈페이지 제작·리뉴얼](${base}/service): 기획·디자인·개발·CMS·오픈까지 한 팀이 진행. 리뉴얼은 기존 콘텐츠와 검색 주소를 지키며 다시 설계`,
    `- [프로그램 개발·업무 자동화](${base}/program): 엑셀·웹·메신저·문서의 반복 업무를 맞춤 프로그램으로 자동화`,
    `- [홈페이지 유지보수](${base}/maintenance): 정기 점검·보안 패치, 월간 백업, 콘텐츠 수정·성능 개선`,
    `- [유지보수 비용 안내](${base}/maintenance/pricing): 건별 또는 월 단위 구독, 사이트 규모와 요청에 맞춘 항목별 견적`,
    '',
  ];
}

function faqSection(faqs: LlmsInput['faqs'], base: string): string[] {
  if (!faqs.length) return [];
  return [
    '## 자주 묻는 질문',
    '',
    ...faqs.flatMap((f) => [`### ${f.question}`, '', f.answer, '']),
    `전체 문답: ${base}/faq`,
    '',
  ];
}

function caseLines(cases: Portfolio[], base: string): string[] {
  return cases.map(
    (c) => `- [${c.title}](${base}/portfolio/${c.slug}): ${c.client} · ${c.year}년 · ${c.category}. ${c.summary}`,
  );
}

const otherPages = (base: string) => [
  '## 그 밖의 페이지',
  '',
  `- [회사소개](${base}/about): 하는 일, 진행 방식, 대표, 사업자 정보`,
  `- [포트폴리오](${base}/portfolio): 제작 사례 전체`,
  `- [전문 칼럼](${base}/column): 홈페이지 제작·리뉴얼 실무 가이드`,
  `- [공지사항](${base}/notice): 운영 안내`,
  `- [채용](${base}/careers): 모집 분야와 지원서`,
  `- [칼럼 전문(全文)](${base}/llms-full.txt): 모든 칼럼의 본문을 한 파일로`,
  '',
];

/** /llms.txt — 회사 요약 + 링크 목록 */
export function llmsTxt(input: LlmsInput): string {
  const { base, faqs, posts, cases } = input;
  return [
    ...header(input),
    ...faqSection(faqs, base),
    '## 전문 칼럼',
    '',
    ...posts.map((p) => `- [${p.title}](${base}/column/${p.slug}): ${p.excerpt}`),
    '',
    '## 제작 사례',
    '',
    ...caseLines(cases, base),
    '',
    ...otherPages(base),
  ].join('\n');
}

/** /llms-full.txt — 칼럼 본문 전체(요약·한 줄 답·본문·문답)를 한 파일로 */
export function llmsFullTxt(input: LlmsInput): string {
  const { base, faqs, posts, cases } = input;
  const articles = posts.flatMap((p) => [
    `## ${p.title}`,
    '',
    `- 주소: ${base}/column/${p.slug}`,
    `- 분류: ${p.category} · 발행 ${p.publishedAt}${p.modifiedAt !== p.publishedAt ? ` · 수정 ${p.modifiedAt}` : ''}`,
    '',
    `요약: ${p.tldr}`,
    '',
    `한 줄 답: ${p.directAnswer}`,
    '',
    htmlToText(p.body),
    '',
    ...(p.faqs?.length ? ['### 자주 묻는 질문', '', ...p.faqs.flatMap((f) => [`Q. ${f.question}`, `A. ${f.answer}`, ''])] : []),
    '---',
    '',
  ]);
  return [
    ...header(input),
    ...faqSection(faqs, base),
    '## 제작 사례',
    '',
    ...caseLines(cases, base),
    '',
    '---',
    '',
    '# 전문 칼럼 전문',
    '',
    ...articles,
  ].join('\n');
}
