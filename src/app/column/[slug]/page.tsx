import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/metadata';
import { columnPosts } from '@/data/columnPosts';
import { getAuthor } from '@/data/authors';
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

export function generateStaticParams() {
  return columnPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = columnPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/column/${post.slug}`,
    ogImage: post.cover,
  });
}

export default function ColumnDetailPage({ params }: { params: { slug: string } }) {
  const post = columnPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

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
            <h1 className="sr-only">{post.title}</h1>
            <Tldr>{post.tldr}</Tldr>
            <DirectAnswer>{post.directAnswer}</DirectAnswer>
            <div
              className="prose prose-neutral mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
            <AuthorByline author={author} publishedAt={post.publishedAt} />
            {post.faqs && <FaqAccordion faqs={post.faqs} />}
            {post.relatedSlugs && <RelatedPosts slugs={post.relatedSlugs} />}
          </article>
        </Container>
      </Section>
    </>
  );
}
