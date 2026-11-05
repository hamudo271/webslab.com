// 리뉴얼 정적 페이지 목록 — 경로 ↔ 원본 HTML ↔ 페이지별 SEO 정보.
// 원본 HTML은 scripts/sync-renewal.mjs가 작업 폴더에서 복사한다. 새 페이지가 생기면 여기와 라우트를 추가.

import { COMMERCIAL_METADATA } from '@/lib/seo-policy';
import { extractFaqs } from '@/lib/site-html';
import { caseStudyJsonLd, faqPageJsonLd, serviceJsonLd } from '@/lib/jsonld';
import { portfolios } from '@/data/portfolios';

import home from './pages/home.html';
import about from './pages/about.html';
import service from './pages/service.html';
import program from './pages/program.html';
import portfolio from './pages/portfolio.html';
import portfolioRoland from './pages/portfolio--roland-korea.html';
import portfolioByeolha from './pages/portfolio--byeolha-studycafe.html';
import portfolioUniverlab from './pages/portfolio--univerlab-media.html';
import portfolioBlueOcean from './pages/portfolio--blue-ocean-guardians.html';
import portfolioDcd from './pages/portfolio--dcd-company.html';
import portfolioFirstMcn from './pages/portfolio--thefirstmcn.html';
import portfolioReyou from './pages/portfolio--reyourclinic.html';
import portfolioApkoc from './pages/portfolio--apkocdesign.html';
import column from './pages/column.html';
import contact from './pages/contact.html';
import faq from './pages/faq.html';
import notice from './pages/notice.html';
import maintenance from './pages/maintenance.html';
import maintenancePricing from './pages/maintenance--pricing.html';
import careers from './pages/careers.html';

export type Crumb = { name: string; path: string };

export type SitePage = {
  path: string;
  html: string;
  /** 브레드크럼·WebPage name */
  name: string;
  /** 원본 <title> 대신 쓸 검색 제목(원본이 너무 짧을 때) */
  title?: string;
  /** 홈과 자기 자신 사이의 상위 경로 */
  parents?: Crumb[];
  /** 원본 meta description 대신 쓸 설명(원본이 시안 문구일 때) */
  description?: string;
  /** 기본 공유 이미지 대신 쓸 이미지(사이트 경로) */
  ogImage?: string;
  /** WebPage dateModified — 없으면 seo-policy STATIC_PAGE_DATES */
  modified?: string;
  extraJsonLd?: (raw: string) => object[];
};

const AREA = '대한민국';

const caseHtml: Record<string, string> = {
  'roland-korea': portfolioRoland,
  'byeolha-studycafe': portfolioByeolha,
  'univerlab-media': portfolioUniverlab,
  'blue-ocean-guardians': portfolioBlueOcean,
  'dcd-company': portfolioDcd,
  thefirstmcn: portfolioFirstMcn,
  reyourclinic: portfolioReyou,
  apkocdesign: portfolioApkoc,
};

export const CASE_SLUGS = Object.keys(caseHtml);

export const SITE_PAGES: SitePage[] = [
  { path: '/', html: home, name: '홈', description: COMMERCIAL_METADATA['/'].description },
  { path: '/about', html: about, name: '회사소개', title: `${COMMERCIAL_METADATA['/about'].title} | 웹스랩` },
  {
    path: '/service',
    html: service,
    name: '서비스',
    extraJsonLd: () => [
      serviceJsonLd({
        name: '기업 홈페이지 제작·리뉴얼',
        description: COMMERCIAL_METADATA['/service'].description,
        serviceType: '홈페이지 제작',
        areaServed: AREA,
      }),
    ],
  },
  {
    path: '/program',
    html: program,
    name: '프로그램 개발',
    extraJsonLd: () => [
      serviceJsonLd({
        name: '프로그램 개발·업무 자동화',
        description: '엑셀·웹·메신저·문서 업무를 자동화하는 맞춤 프로그램을 개발합니다.',
        serviceType: '업무 자동화 프로그램 개발',
        areaServed: AREA,
      }),
    ],
  },
  { path: '/portfolio', html: portfolio, name: '포트폴리오' },
  ...CASE_SLUGS.map((slug) => {
    const p = portfolios.find((x) => x.slug === slug);
    return {
      path: `/portfolio/${slug}`,
      html: caseHtml[slug],
      name: p?.client ?? slug,
      parents: [{ name: '포트폴리오', path: '/portfolio' }],
      ogImage: p?.cover,
      modified: p?.modifiedAt,
      extraJsonLd: () =>
        p
          ? [
              caseStudyJsonLd({
                path: `/portfolio/${slug}`,
                name: p.title,
                description: p.description,
                image: p.cover,
                year: p.year,
                client: p.client,
                siteUrl: p.url,
                keywords: p.services,
              }),
            ]
          : [],
    };
  }),
  { path: '/column', html: column, name: '전문 칼럼', title: '홈페이지 제작·리뉴얼 전문 칼럼 | 웹스랩' },
  {
    path: '/contact',
    html: contact,
    name: '문의하기',
    title: '홈페이지 제작 견적 문의 | 웹스랩',
    description:
      '홈페이지 제작·리뉴얼 견적 문의. 현재 상황과 목표를 알려주시면 필요한 범위를 1영업일 안에 정리해 회신드립니다. 계약 전 메인 시안은 무료입니다.',
  },
  {
    path: '/faq',
    html: faq,
    name: '자주묻는질문',
    title: '홈페이지 제작 비용·기간 자주 묻는 질문 | 웹스랩',
    extraJsonLd: (raw) => {
      const faqs = extractFaqs(raw);
      return faqs.length ? [faqPageJsonLd(faqs)] : [];
    },
  },
  {
    path: '/notice',
    html: notice,
    name: '공지사항',
    title: '공지사항 — 웹스랩 운영 안내 | 웹스랩',
    description: '웹스랩의 새 소식과 운영 안내를 전합니다. 상담·휴무 일정과 서비스 안내 변경 사항을 이곳에서 먼저 확인하세요.',
  },
  {
    path: '/maintenance',
    html: maintenance,
    name: '유지보수 신청',
    title: '홈페이지 유지보수 신청 | 웹스랩',
    extraJsonLd: () => [
      serviceJsonLd({
        name: '홈페이지 유지보수',
        description: '정기 점검·보안 패치, 월간 백업, 콘텐츠 수정·성능 개선까지 필요한 유지보수만 골라 맡길 수 있습니다.',
        serviceType: '홈페이지 유지보수',
        areaServed: AREA,
      }),
    ],
  },
  {
    path: '/maintenance/pricing',
    html: maintenancePricing,
    name: '유지보수 비용 안내',
    parents: [{ name: '유지보수 신청', path: '/maintenance' }],
  },
  { path: '/careers', html: careers, name: '채용', title: '채용 — 웹 디자이너·퍼블리셔·개발자·기획 | 웹스랩' },
];

export function getSitePage(path: string): SitePage {
  const page = SITE_PAGES.find((p) => p.path === path);
  if (!page) throw new Error(`등록되지 않은 리뉴얼 페이지: ${path}`);
  return page;
}

/** 칼럼 상세·약관처럼 리뉴얼 헤더/푸터만 빌려 쓰는 페이지의 셸 (서브페이지 헤더 상태) */
export const SHELL_HTML = column;
