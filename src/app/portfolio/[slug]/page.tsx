import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
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
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd';

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
      <WebPageJsonLd
        path={`/portfolio/${item.slug}`}
        name={item.title}
        description={item.summary}
        dateModified={item.modifiedAt}
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
              {/* 실제로 돌아가는 사이트를 보여주는 것 자체가 가장 강한 증거인데 그동안 묻혀 있었다 */}
              {item.url && (
                <div className="col-span-2">
                  <dt className="text-text-muted">웹사이트</dt>
                  <dd className="mt-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                    >
                      {item.url.replace(/^https?:\/\//, '')}
                      <ExternalLink size={14} />
                    </a>
                  </dd>
                </div>
              )}
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
            className="object-cover object-[80%_50%] md:object-center"
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

          {/* 실제 페이지 전체. gallery는 현재 전 케이스가 비어 있어 이 자리가 통째로 놀고 있었다. */}
          {item.fullShot && (
            <figure className="mt-20 border-t border-line pt-12">
              <figcaption className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-lg font-bold tracking-tightest text-text-primary">
                  페이지 전체 보기
                </h2>
                <span className="text-sm text-text-muted">
                  오픈 당시 메인페이지를 위에서 아래까지 캡처했습니다
                </span>
              </figcaption>
              {/* 캡처 원본이 720px 폭이라 그 이상 늘리면 흐려진다. 원본 크기에서 멈추고 가운데 정렬. */}
              <div className="mx-auto max-w-[720px] overflow-hidden rounded-[10px] border border-line bg-surface-light">
                <Image
                  src={item.fullShot}
                  alt={`${item.title} 메인페이지 전체`}
                  width={720}
                  height={2600}
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="w-full"
                />
              </div>
            </figure>
          )}

          {item.gallery.length > 0 && (
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
          )}
        </Container>
      </Section>

      {/* 케이스를 끝까지 본 방문자가 사이트에서 가장 관심이 높은 상태인데
          그동안 다음 케이스로 넘기는 링크뿐이라 문의로 가는 길이 없었다. */}
      <Section variant="darker" spacing="default">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Heading as="h2" size="h2" className="max-w-xl text-balance text-white">
                이런 사이트가 필요하신가요?
              </Heading>
              <p className="mt-5 max-w-lg leading-relaxed text-white/70">
                계약 전에 메인페이지 시안을 먼저 보여드립니다. 문의를 남겨주시면 1영업일 안에
                담당자가 회신드립니다.
              </p>
            </div>
            <ButtonLink href="/contact" variant="primary" size="lg" className="shrink-0">
              프로젝트 문의 <ArrowRight size={18} />
            </ButtonLink>
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
