import { NextResponse } from 'next/server';
import { brand } from '@/config/brand';
import { siteConfig } from '@/config/site';
import { getColumnFeed } from '@/lib/column-feed';
import { prisma } from '@/lib/db';
import { absolutizeHtml, rssXml } from '@/lib/xml';
import { escapeHtml } from '@/lib/site-html';
import { columnPosts } from '@/data/columnPosts';
import { portfolios } from '@/data/portfolios';
import { getAuthor, representative } from '@/data/authors';

// 사이트 RSS 2.0 — 네이버 서치어드바이저 'RSS 제출'과 피드 리더용.
// 칼럼(정적 + DB 발행글, 본문 전체 포함)과 제작 사례를 최신순으로 함께 싣는다.
// DB 글은 실시간 반영(getColumnFeed가 DB 장애 시 정적 글로 폴백).
export const dynamic = 'force-dynamic';

const MAX_ITEMS = 50;

// DB 글에는 작성자 필드가 없어 사이트 대표 작성자로 통일한다
const staticBySlug = new Map(columnPosts.map((p) => [p.slug, p]));

/** DB 발행글 본문 — 목록 피드(getColumnFeed)에는 본문이 없어 한 번에 따로 읽는다. 실패하면 요약만 싣는다. */
async function dbBodies(slugs: string[]): Promise<Map<string, string>> {
  if (!slugs.length) return new Map();
  try {
    const rows = await prisma.post.findMany({ where: { slug: { in: slugs }, status: 'PUBLISHED' }, select: { slug: true, content: true } });
    return new Map(rows.map((r) => [r.slug, r.content]));
  } catch (err) {
    console.error('[rss] DB 본문 조회 실패 — 요약만 싣는다', err);
    return new Map();
  }
}

export async function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const abs = (src: string) => (/^https?:\/\//.test(src) ? src : `${base}${src}`);
  const cover = (src: string | null | undefined, alt: string) =>
    src ? `<p><img src="${escapeHtml(abs(src))}" alt="${escapeHtml(alt)}"></p>` : '';

  try {
    const columns = (await getColumnFeed()).slice(0, MAX_ITEMS);
    const bodies = await dbBodies(columns.filter((c) => c.source === 'db').map((c) => c.slug));

    const columnItems = columns.map((p) => {
      const local = staticBySlug.get(p.slug);
      // 글 페이지에 보이는 그대로: 핵심 요약 → 본문 → 자주 묻는 질문
      const body = local
        ? (local.tldr ? `<p><strong>핵심 요약</strong> ${escapeHtml(local.tldr)}</p>` : '') +
          (local.directAnswer ? `<p><strong>한 줄 답</strong> ${escapeHtml(local.directAnswer)}</p>` : '') +
          local.body +
          (local.faqs?.length
            ? `<h2>자주 묻는 질문</h2>` +
              local.faqs.map((f) => `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`).join('')
            : '')
        : bodies.get(p.slug);
      return {
        title: p.title,
        link: `${base}/column/${p.slug}`,
        description: p.excerpt,
        content: body ? absolutizeHtml(cover(p.cover, p.title) + body, base) : undefined,
        category: p.category,
        pubDate: new Date(p.publishedAt),
        author: local ? getAuthor(local.authorId).name : representative.name,
        image: p.cover ? abs(p.cover) : undefined,
      };
    });

    // 제작 사례 — 데이터에 있는 사실만(소개·작업 범위·기간·실사이트 주소). 발행일은 사이트에 올린 날(modifiedAt)
    const caseItems = portfolios.map((c) => ({
      title: `${c.title} — 웹스랩 제작 사례`,
      link: `${base}/portfolio/${c.slug}`,
      description: c.description,
      content:
        cover(c.cover, c.title) +
        `<p>${escapeHtml(c.description)}</p>` +
        `<ul><li>고객: ${escapeHtml(c.client)}</li><li>구분: ${escapeHtml(c.category)}</li>` +
        (c.services.length ? `<li>작업 범위: ${escapeHtml(c.services.join(', '))}</li>` : '') +
        `<li>기간: ${escapeHtml(c.duration)}</li>` +
        (c.url ? `<li>사이트: <a href="${escapeHtml(c.url)}">${escapeHtml(c.url.replace(/^https?:\/\//, ''))}</a></li>` : '') +
        `</ul>`,
      category: '제작 사례',
      pubDate: new Date(`${c.modifiedAt}T00:00:00+09:00`),
      author: brand.nameKo,
      image: abs(c.cover),
    }));

    const xml = rssXml({
      title: `${brand.nameKo} — 홈페이지 제작 칼럼·제작 사례`,
      link: `${base}/`,
      description: '기업 홈페이지 제작·리뉴얼 실무 가이드 칼럼과 웹스랩이 직접 만든 제작 사례.',
      selfUrl: `${base}/rss.xml`,
      image: { url: `${base}/images/rss-logo.png`, width: 144, height: 30 },
      copyright: `© ${brand.name}`,
      ttl: 60,
      items: [...columnItems, ...caseItems].slice(0, MAX_ITEMS),
    });

    return new NextResponse(xml, {
      headers: {
        'content-type': 'application/rss+xml; charset=utf-8',
        'cache-control': 'public, max-age=600, s-maxage=600',
      },
    });
  } catch (err) {
    console.error('[rss]', err);
    return new NextResponse('피드를 생성하지 못했습니다.', { status: 500 });
  }
}
