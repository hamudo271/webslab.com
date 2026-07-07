import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/metadata';
import { prisma } from '@/lib/db';
import { findPublishedPostBySlug, makeExcerpt } from '@/lib/posts';
import { estimateReadMinutes } from '@/lib/column-feed';
import { columnPosts } from '@/data/columnPosts';
import { getAuthor, representative } from '@/data/authors';
import { absoluteUrl } from '@/config/site';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { Badge } from '@/components/common/Badge';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { HowToJsonLd } from '@/components/seo/HowToJsonLd';
import { PersonJsonLd } from '@/components/seo/PersonJsonLd';
import { Tldr } from '@/components/content/Tldr';
import { DirectAnswer } from '@/components/content/DirectAnswer';
import { AuthorByline } from '@/components/content/AuthorByline';
import { FaqAccordion } from '@/components/content/FaqAccordion';
import { RelatedPosts } from '@/components/content/RelatedPosts';
import { ColumnCta } from '@/components/content/ColumnCta';

// 정적 12편 + DB 발행글 공용 — DB 글 실시간 반영·조회수 카운트
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = columnPosts.find((p) => p.slug === params.slug);
  if (post) {
    return buildMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/column/${post.slug}`,
      ogImage: post.cover,
    });
  }

  const dbPost = await findPublishedPostBySlug(params.slug).catch(() => null);
  if (!dbPost) return {};
  return buildMetadata({
    title: dbPost.title,
    description: makeExcerpt(dbPost.excerpt, dbPost.content),
    path: `/column/${dbPost.slug}`,
    ...(dbPost.thumbnailUrl ? { ogImage: dbPost.thumbnailUrl } : {}),
  });
}

function formatDateIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// DB 발행글 상세 (관리자 CMS 작성 글)
async function DbColumnDetail({ slug }: { slug: string }) {
  const post = await findPublishedPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  // 조회수 카운트 (실패해도 렌더는 계속)
  await prisma.post
    .update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } })
    .catch((err) => console.error('[column:view]', err));

  const author = representative;
  const excerpt = makeExcerpt(post.excerpt, post.content);
  const publishedAt = formatDateIso(post.publishedAt ?? post.createdAt);
  const modifiedAt = formatDateIso(post.updatedAt);
  const articleImage = post.thumbnailUrl ?? absoluteUrl('/og/default.png');

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: '홈', path: '/' },
          { name: '전문 칼럼', path: '/column' },
          { name: post.title, path: `/column/${post.slug}` },
        ]}
      />
      <ArticleJsonLd
        headline={post.title}
        description={excerpt}
        slug={post.slug}
        datePublished={publishedAt}
        dateModified={modifiedAt}
        image={articleImage}
        author={author}
      />
      <PersonJsonLd author={author} />

      <PageHero eyebrow={post.category} title={post.title} description={excerpt} />

      <Section variant="light" spacing="default">
        <Container>
          <article className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
              <Badge variant="outline" size="sm">{post.category}</Badge>
              <span>{estimateReadMinutes(post.content)}분 읽기</span>
            </div>
            <div
              className="prose prose-neutral mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <AuthorByline author={author} publishedAt={publishedAt} modifiedAt={modifiedAt} />
            <ColumnCta
              title="홈페이지 제작·리뉴얼, 전문가와 상의해 보세요"
              description="기획부터 디자인, 개발, 운영까지 한 팀에서 책임집니다. 필요한 범위와 예상 비용을 무료 상담으로 확인하세요."
              serviceHref="/service"
              serviceLabel="서비스 살펴보기"
              fromPath={`/column/${post.slug}`}
            />
          </article>
        </Container>
      </Section>
    </>
  );
}

export default function ColumnDetailPage({ params }: { params: { slug: string } }) {
  const post = columnPosts.find((p) => p.slug === params.slug);
  if (!post) return <DbColumnDetail slug={params.slug} />;

  const author = getAuthor(post.authorId);
  const articleImage = post.cover.startsWith('http') ? post.cover : absoluteUrl(post.cover);

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: '홈', path: '/' },
          { name: '전문 칼럼', path: '/column' },
          { name: post.title, path: `/column/${post.slug}` },
        ]}
      />
      <ArticleJsonLd
        headline={post.title}
        description={post.excerpt}
        slug={post.slug}
        datePublished={post.publishedAt}
        dateModified={post.modifiedAt}
        image={articleImage}
        author={author}
      />
      <PersonJsonLd author={author} />
      {post.faqs && <FaqJsonLd faqs={post.faqs} />}
      {post.howTo && (
        <HowToJsonLd
          name={post.howTo.name}
          description={post.howTo.description}
          steps={post.howTo.steps}
        />
      )}

      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
      />

      <Section variant="light" spacing="default">
        <Container>
          <article className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
              <Badge variant="outline" size="sm">{post.category}</Badge>
              <span>{post.readMinutes}분 읽기</span>
            </div>
            <Tldr>{post.tldr}</Tldr>
            <DirectAnswer>{post.directAnswer}</DirectAnswer>
            <div
              className="prose prose-neutral mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
            <AuthorByline
              author={author}
              publishedAt={post.publishedAt}
              modifiedAt={post.modifiedAt}
            />
            {post.faqs && <FaqAccordion faqs={post.faqs} />}
            <RelatedPosts slugs={post.relatedSlugs} />
            <ColumnCta
              title={post.ctaTitle}
              description={post.ctaDescription}
              serviceHref={post.serviceHref}
              serviceLabel={post.serviceLabel}
              fromPath={`/column/${post.slug}`}
            />
          </article>
        </Container>
      </Section>
    </>
  );
}
