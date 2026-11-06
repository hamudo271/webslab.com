// 리뉴얼 페이지 렌더 — 원본 HTML + 운영 head(SEO·분석·폼 스크립트) → Response.
// 페이지 라우트(src/app/**/route.ts)는 전부 이 파일의 함수 하나만 부른다.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { brand } from '@/config/brand';
import { analytics } from '@/config/analytics';
import { siteConfig, absoluteUrl } from '@/config/site';
import { STATIC_PAGE_DATES, STATIC_PAGE_PUBLISHED } from '@/lib/seo-policy';
import {
  breadcrumbJsonLd,
  localBusinessJsonLd,
  organizationJsonLd,
  webPageJsonLd,
  websiteJsonLd,
} from '@/lib/jsonld';
import { readMeta, readTitle, renderHeadMeta, replaceMain, toProductionHtml } from '@/lib/site-html';
import { analyticsBodyStart, analyticsHead } from '@/lib/site-analytics';
import { getSitePage, SHELL_HTML, type Crumb, type SitePage } from './registry';

/** 기본 공유 이미지 (scripts/build_column_og.py가 회사소개서 표지 스타일로 생성) */
const DEFAULT_OG = { path: siteConfig.defaultOgImage, width: 1200, height: 630 };

const versions = new Map<string, string>();
const contents = new Map<string, string>();

function readSiteAsset(file: string): string {
  let s = contents.get(file);
  if (s === undefined) {
    try {
      s = fs.readFileSync(path.join(process.cwd(), 'public/site', file), 'utf8');
    } catch {
      s = '';
    }
    contents.set(file, s);
  }
  return s;
}

/** public/site/* 파일 내용 해시 — 배포마다 CDN·브라우저 캐시를 확실히 갈아끼운다 */
function assetVersion(file: string): string {
  let v = versions.get(file);
  if (!v) {
    v = crypto.createHash('md5').update(readSiteAsset(file)).digest('hex').slice(0, 8) || 'v1';
    versions.set(file, v);
  }
  return v;
}

/** 첫 화면에 꼭 필요한 작은 운영 파일(폼 연결 JS·운영 CSS)은 요청을 따로 보내지 않고 HTML에 넣는다 —
 *  렌더를 막는 요청이 둘 줄어 느린 회선에서 수백 ms. 파일이 비어 있으면(테스트 등) 링크로 돌아간다. */
function inlineScript(file: string): string {
  const s = readSiteAsset(file);
  return s && !s.includes('</script') ? `<script>${s}</script>` : `<script src="/site/${file}?v=${assetVersion(file)}"></script>`;
}
function inlineStyle(file: string): string {
  const s = readSiteAsset(file);
  return s && !s.includes('</style') ? `<style>${s}</style>` : `<link rel="stylesheet" href="/site/${file}?v=${assetVersion(file)}">`;
}

const abs = (src: string) => (/^https?:\/\//.test(src) ? src : absoluteUrl(src));

export type RenderInput = {
  raw: string;
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  ogImageSize?: { width: number; height: number };
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd: object[];
  noindex?: boolean;
};

export function renderHtml(input: RenderInput): string {
  const ogImage = input.ogImage ? abs(input.ogImage) : absoluteUrl(DEFAULT_OG.path);
  const ogSize = input.ogImage ? input.ogImageSize : DEFAULT_OG;
  const headStart = [
    // 폼 연결 스크립트는 테마 스크립트보다 먼저 submit을 받아야 해서 동기(인라인)
    inlineScript('ws-forms.js'),
    analyticsHead(),
    renderHeadMeta({
      path: input.path,
      canonical: absoluteUrl(input.path),
      title: input.title,
      description: input.description,
      ogImage,
      ogImageWidth: ogSize?.width,
      ogImageHeight: ogSize?.height,
      ogType: input.ogType,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
      siteName: brand.nameKo,
      locale: siteConfig.locale,
      verification: {
        google: analytics.verification.google || undefined,
        naver: analytics.verification.naver || undefined,
      },
      rssUrl: absoluteUrl('/rss.xml'),
      jsonLd: input.jsonLd,
      noindex: input.noindex,
    }),
  ].join('\n');
  const headEnd = [
    inlineStyle('ws-site.css'),
    // 자동 재생 영상을 화면에 보일 때만 재생(site-html.ts가 autoplay를 data-ws-autoplay로 바꾼다)
    `<script src="/site/ws-media.js?v=${assetVersion('ws-media.js')}" defer></script>`,
  ].join('\n');
  return toProductionHtml(input.raw, {
    title: input.title,
    headStart,
    headEnd,
    bodyStart: analyticsBodyStart(),
  });
}

function crumbsFor(page: SitePage): Crumb[] {
  return [{ name: '홈', path: '/' }, ...(page.parents ?? []), { name: page.name, path: page.path }];
}

/** 등록된 리뉴얼 페이지 1장. mutate로 본문 일부(예: 칼럼 목록)를 먼저 바꿀 수 있다. */
export function sitePageHtml(pagePath: string, mutate?: (raw: string) => string): string {
  const page = getSitePage(pagePath);
  const description = page.description ?? readMeta(page.html, 'description') ?? brand.description;
  const webPage = webPageJsonLd({
    path: page.path,
    name: page.path === '/' ? brand.nameKo : page.name,
    description,
    datePublished: STATIC_PAGE_PUBLISHED[page.path],
    dateModified: page.modified ?? STATIC_PAGE_DATES[page.path] ?? STATIC_PAGE_DATES['/'],
  });
  const jsonLd =
    page.path === '/'
      ? [organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd(), webPage]
      : [webPage, breadcrumbJsonLd(crumbsFor(page))];
  return renderHtml({
    raw: mutate ? mutate(page.html) : page.html,
    path: page.path,
    title: page.title ?? readTitle(page.html),
    description,
    ogImage: page.ogImage,
    jsonLd: [...jsonLd, ...(page.extraJsonLd?.(page.html) ?? [])],
  });
}

export type ShellInput = Omit<RenderInput, 'raw'> & { main: string; mainClass: string };

/** 리뉴얼 헤더·푸터 셸 + 임의 본문 (칼럼 상세·약관·404) */
export function shellHtml(input: ShellInput): string {
  const { main, mainClass, ...rest } = input;
  return renderHtml({ ...rest, raw: replaceMain(SHELL_HTML, main, mainClass) });
}

/** 리뉴얼 페이지 HTML 응답. 본문은 빌드 시점에 정해지므로 CDN이 10분 들고 있어도 된다(배포마다 새 빌드).
 *  Cloudflare는 HTML을 기본으로 캐시하지 않는다 — 대시보드에 "HTML 캐시" Cache Rule(/admin·/api 제외)을 만들면
 *  이 헤더대로 엣지에서 바로 응답해 원서버(Railway) 왕복 ~1초가 사라진다. 브라우저는 매번 재검증(max-age=0). */
export function htmlResponse(html: string, status = 200, edgeSeconds = 600): Response {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      ...(status === 200
        ? { 'cache-control': `public, max-age=0, s-maxage=${edgeSeconds}, stale-while-revalidate=86400`, 'cdn-cache-control': `max-age=${edgeSeconds}` }
        : { 'cache-control': 'no-store' }),
    },
  });
}
