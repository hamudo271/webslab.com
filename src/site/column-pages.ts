// 칼럼 목록·상세 페이지 HTML (리뉴얼 셸) — 라우트 핸들러가 부른다.

import type { Post } from '@prisma/client';
import { absoluteUrl, siteConfig } from '@/config/site';
import { brand } from '@/config/brand';
import { makeExcerpt } from '@/lib/posts';
import { estimateReadMinutes, type ColumnListItem } from '@/lib/column-feed';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  howToJsonLd,
  personJsonLd,
} from '@/lib/jsonld';
import { columnPosts, type ColumnPost } from '@/data/columnPosts';
import { getAuthor, representative } from '@/data/authors';
import { applyColumnList, isoDay, renderArticle, renderArticleNotFound } from './column';
import { shellHtml, sitePageHtml } from './render';

const COVER_SIZE = { width: 1200, height: 630 };
const abs = (src: string) => (/^https?:\/\//.test(src) ? src : absoluteUrl(src));

function crumbs(title: string, slug: string) {
  return breadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '전문 칼럼', path: '/column' },
    { name: title, path: `/column/${slug}` },
  ]);
}

export function columnListHtml(items: ColumnListItem[]): string {
  return sitePageHtml('/column', (raw) => applyColumnList(raw, items));
}

export function staticArticleHtml(post: ColumnPost): string {
  const author = getAuthor(post.authorId);
  const related = post.relatedSlugs
    .map((s) => columnPosts.find((p) => p.slug === s))
    .filter((p): p is ColumnPost => Boolean(p));
  return shellHtml({
    path: `/column/${post.slug}`,
    title: `${post.title} | ${brand.nameKo}`,
    description: post.excerpt,
    ogImage: post.cover,
    ogImageSize: COVER_SIZE,
    ogType: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.modifiedAt,
    mainClass: 'ws-column-article',
    main: renderArticle({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      publishedAt: post.publishedAt,
      modifiedAt: post.modifiedAt,
      readMinutes: post.readMinutes,
      cover: post.cover,
      author,
      bodyHtml: post.body,
      tldr: post.tldr,
      directAnswer: post.directAnswer,
      faqs: post.faqs,
      related,
      cta: {
        title: post.ctaTitle,
        description: post.ctaDescription,
        serviceHref: post.serviceHref,
        serviceLabel: post.serviceLabel,
      },
    }),
    jsonLd: [
      crumbs(post.title, post.slug),
      articleJsonLd({
        headline: post.title,
        description: post.excerpt,
        slug: post.slug,
        datePublished: post.publishedAt,
        dateModified: post.modifiedAt,
        image: abs(post.cover),
        author,
      }),
      personJsonLd(author),
      ...(post.faqs?.length ? [faqPageJsonLd(post.faqs)] : []),
      ...(post.howTo ? [howToJsonLd(post.howTo)] : []),
    ],
  });
}

/** 관리자(CMS)에서 발행한 글 */
export function dbArticleHtml(post: Post): string {
  const author = representative;
  const excerpt = makeExcerpt(post.excerpt, post.content);
  const publishedAt = isoDay((post.publishedAt ?? post.createdAt).toISOString());
  const modifiedAt = isoDay(post.updatedAt.toISOString());
  return shellHtml({
    path: `/column/${post.slug}`,
    title: `${post.title} | ${brand.nameKo}`,
    description: excerpt,
    ogImage: post.thumbnailUrl ?? undefined,
    ogType: 'article',
    publishedTime: publishedAt,
    modifiedTime: modifiedAt,
    mainClass: 'ws-column-article',
    main: renderArticle({
      slug: post.slug,
      title: post.title,
      excerpt,
      category: post.category,
      publishedAt,
      modifiedAt,
      readMinutes: estimateReadMinutes(post.content),
      cover: post.thumbnailUrl,
      author,
      bodyHtml: post.content,
      cta: {
        title: '홈페이지 제작·리뉴얼, 전문가와 상의해 보세요',
        description:
          '기획부터 디자인, 개발, 운영까지 한 팀에서 책임집니다. 필요한 범위와 예상 비용을 무료 상담으로 확인하세요.',
        serviceHref: '/service',
        serviceLabel: '서비스 살펴보기',
      },
    }),
    jsonLd: [
      crumbs(post.title, post.slug),
      articleJsonLd({
        headline: post.title,
        description: excerpt,
        slug: post.slug,
        datePublished: publishedAt,
        dateModified: modifiedAt,
        image: post.thumbnailUrl ? abs(post.thumbnailUrl) : absoluteUrl(siteConfig.defaultOgImage),
        author,
      }),
      personJsonLd(author),
    ],
  });
}

export function articleNotFoundHtml(): string {
  return shellHtml({
    path: '/column',
    title: `글을 찾을 수 없어요 | ${brand.nameKo}`,
    description: '요청하신 칼럼을 찾을 수 없습니다.',
    mainClass: 'ws-not-found',
    main: renderArticleNotFound(),
    jsonLd: [],
    noindex: true,
  });
}
