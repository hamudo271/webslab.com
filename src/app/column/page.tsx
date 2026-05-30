import Image from 'next/image';
import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { Badge } from '@/components/common/Badge';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { columnPosts } from '@/data/columnPosts';

export const metadata = buildMetadata({
  title: '전문 칼럼',
  description: '기업 홈페이지 제작·운영에 대한 전문가의 인사이트.',
  path: '/column',
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function ColumnPage() {
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
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {columnPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/column/${post.slug}`} className="block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-surface-light">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
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
            ))}
          </div>

          <div className="mt-16 border-t border-line pt-10 text-center text-sm text-text-muted">
            더 많은 글이 곧 업데이트됩니다.
          </div>
        </Container>
      </Section>
    </>
  );
}
