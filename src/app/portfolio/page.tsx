import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { PortfolioCard } from '@/components/portfolio/PortfolioCard';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { portfolios, type Industry } from '@/data/portfolios';
import { industryFilters } from '@/data/industries';
import { cn } from '@/lib/cn';

export const metadata = buildMetadata({
  title: '포트폴리오',
  description: '제조·물류·IT·바이오 등 다양한 산업의 100여 건 제작 사례를 둘러보세요.',
  path: '/portfolio',
});

type SearchParams = { industry?: string };

export default function PortfolioPage({ searchParams }: { searchParams: SearchParams }) {
  const active = (searchParams.industry as Industry | 'ALL' | undefined) ?? 'ALL';
  const filtered =
    active === 'ALL' ? portfolios : portfolios.filter((p) => p.industry === active);

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: '홈', path: '/' },
          { name: '포트폴리오', path: '/portfolio' },
        ]}
      />
      <PageHero
        eyebrow="PORTFOLIO"
        title="실제 비즈니스 성과로 이어진 사례"
        description="기업 홈페이지가 성장 자산이 되는 방법, 사례로 확인하세요."
      />

      <Section variant="light" spacing="compact">
        <Container>
          <div className="flex flex-wrap gap-2 border-b border-line pb-6">
            {industryFilters.map((f) => (
              <Link
                key={f.key}
                href={f.key === 'ALL' ? '/portfolio' : `/portfolio?industry=${f.key}`}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  active === f.key
                    ? 'border-primary bg-primary text-white'
                    : 'border-line text-text-secondary hover:border-primary hover:text-primary',
                )}
              >
                {f.label}
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PortfolioCard key={p.slug} portfolio={p} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-text-muted">해당 카테고리의 사례가 아직 없습니다.</p>
          )}
        </Container>
      </Section>
    </>
  );
}
