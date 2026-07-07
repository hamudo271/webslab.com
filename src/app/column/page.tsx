import Image from 'next/image';
import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import { cn } from '@/lib/cn';
import { getColumnFeed, type ColumnListItem } from '@/lib/column-feed';
import { PUBLIC_PAGE_SIZE } from '@/lib/posts';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { Badge } from '@/components/common/Badge';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// DB 발행글을 실시간 반영
export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: '전문 칼럼',
  description:
    '기업 홈페이지 제작 비용, 업체 선정 기준, 제작 기간, 리뉴얼, SEO 유지까지 — 실무에서 정리한 가이드 칼럼으로 의사결정에 필요한 기준을 확인하세요.',
  path: '/column',
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function pageHref(page: number, category?: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (category) params.set('category', category);
  const qs = params.toString();
  return qs ? `/column?${qs}` : '/column';
}

function PostCard({ post }: { post: ColumnListItem }) {
  return (
    <article className="group">
      <Link href={`/column/${post.slug}`} className="block">
        <div className="relative aspect-[120/63] overflow-hidden rounded-lg bg-dark">
          {post.cover ? (
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-dark-section">
              <span className="text-lg font-extrabold tracking-tightest text-white/30">
                websLAB
              </span>
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center gap-3 text-xs text-text-muted">
          <Badge variant="outline" size="sm">{post.category}</Badge>
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readMinutes}분 읽기</span>
        </div>
        <h3 className="mt-3 text-xl font-bold tracking-tightest text-text-primary group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm text-text-secondary">{post.excerpt}</p>
      </Link>
    </article>
  );
}

type Search = { page?: string; category?: string };

export default async function ColumnPage({ searchParams }: { searchParams: Search }) {
  const all = await getColumnFeed();

  const categories = Array.from(new Set(all.map((p) => p.category)));
  const category = categories.includes(searchParams.category ?? '')
    ? searchParams.category
    : undefined;
  const filtered = category ? all.filter((p) => p.category === category) : all;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PUBLIC_PAGE_SIZE));
  const rawPage = Number.parseInt(searchParams.page ?? '1', 10);
  const page = Number.isInteger(rawPage) ? Math.min(Math.max(rawPage, 1), totalPages) : 1;
  const items = filtered.slice((page - 1) * PUBLIC_PAGE_SIZE, page * PUBLIC_PAGE_SIZE);

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[{ name: '홈', path: '/' }, { name: '전문 칼럼', path: '/column' }]}
      />
      <PageHero
        eyebrow="COLUMN"
        title="비즈니스 웹을 위한 인사이트"
        description="실제 프로젝트에서 얻은 지식과 데이터를 글로 정리합니다."
      />

      <Section variant="light" spacing="default">
        <Container>
          {/* 카테고리 필터 */}
          <div className="mb-12 flex flex-wrap gap-2">
            <Link
              href={pageHref(1)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                !category
                  ? 'border-primary bg-primary text-white'
                  : 'border-line text-text-secondary hover:border-text-secondary',
              )}
            >
              전체
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={pageHref(1, c)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-colors',
                  category === c
                    ? 'border-primary bg-primary text-white'
                    : 'border-line text-text-secondary hover:border-text-secondary',
                )}
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="mt-16 flex items-center justify-center gap-2" aria-label="페이지 이동">
              {page > 1 && (
                <Link
                  href={pageHref(page - 1, category)}
                  className="rounded-lg border border-line px-3 py-2 text-sm text-text-secondary hover:border-text-secondary"
                >
                  이전
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n, category)}
                  aria-current={n === page ? 'page' : undefined}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors',
                    n === page
                      ? 'bg-primary font-bold text-white'
                      : 'border border-line text-text-secondary hover:border-text-secondary',
                  )}
                >
                  {n}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={pageHref(page + 1, category)}
                  className="rounded-lg border border-line px-3 py-2 text-sm text-text-secondary hover:border-text-secondary"
                >
                  다음
                </Link>
              )}
            </nav>
          )}
        </Container>
      </Section>
    </>
  );
}
