import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { portfolios } from '@/data/portfolios';
import { INDUSTRY_LABELS } from '@/data/industries';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { Badge } from '@/components/common/Badge';
import { ButtonLink } from '@/components/common/Button';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export async function generateStaticParams() {
  return portfolios.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = portfolios.find((p) => p.slug === params.slug);
  if (!item) return buildMetadata({ title: '포트폴리오' });
  return buildMetadata({
    title: item.title,
    description: item.summary,
    path: `/portfolio/${item.slug}`,
    ogImage: item.cover,
  });
}

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const item = portfolios.find((p) => p.slug === params.slug);
  if (!item) notFound();

  const idx = portfolios.findIndex((p) => p.slug === item.slug);
  const next = portfolios[(idx + 1) % portfolios.length];

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: '홈', path: '/' },
          { name: '포트폴리오', path: '/portfolio' },
          { name: item.title, path: `/portfolio/${item.slug}` },
        ]}
      />

      <section className="pt-32 pb-12 md:pt-44 md:pb-16">
        <Container>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary"
          >
            <ArrowLeft size={14} /> 포트폴리오 목록
          </Link>

          <div className="mt-10 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {INDUSTRY_LABELS[item.industry]} · {item.year}
              </p>
              <Heading as="h1" size="h1" className="mt-6">{item.title}</Heading>
              <p className="mt-6 text-lg text-text-secondary md:text-xl">{item.summary}</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-sm">
              <div>
                <dt className="text-text-muted">클라이언트</dt>
                <dd className="mt-1 font-medium">{item.client}</dd>
              </div>
              <div>
                <dt className="text-text-muted">카테고리</dt>
                <dd className="mt-1 font-medium">{item.category}</dd>
              </div>
              <div>
                <dt className="text-text-muted">기간</dt>
                <dd className="mt-1 font-medium">{item.duration}</dd>
              </div>
              <div>
                <dt className="text-text-muted">서비스</dt>
                <dd className="mt-1 font-medium">{item.services.join(', ')}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section>
        <div className="relative h-[60vh] min-h-[480px] w-full overflow-hidden">
          <Image
            src={item.cover}
            alt={item.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <Section variant="light" spacing="default">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <Heading as="h2" size="h3">프로젝트 소개</Heading>
            <p className="text-text-secondary leading-relaxed md:text-lg">{item.description}</p>
          </div>

          {item.results && item.results.length > 0 && (
            <div className="mt-20 grid gap-6 border-t border-line pt-12 md:grid-cols-3">
              {item.results.map((r) => (
                <div key={r.label}>
                  <p className="text-4xl font-bold tracking-tightest text-primary md:text-5xl">
                    {r.value}
                  </p>
                  <p className="mt-3 text-sm text-text-secondary">{r.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-20 space-y-8">
            {item.gallery.map((src, i) => (
              <div key={src} className="relative aspect-video w-full overflow-hidden bg-surface-light">
                <Image
                  src={src}
                  alt={`${item.title} 갤러리 ${i + 1}`}
                  fill
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="surface" spacing="compact">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">NEXT</Badge>
              <Link
                href={`/portfolio/${next.slug}`}
                className="text-xl font-bold tracking-tightest hover:text-primary md:text-2xl"
              >
                {next.title}
              </Link>
            </div>
            <ButtonLink href={`/portfolio/${next.slug}`} variant="primary">
              다음 케이스 보기 <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
