import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { portfolios } from '@/data/portfolios';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { PortfolioCard } from '@/components/portfolio/PortfolioCard';

export function PortfolioSection() {
  return (
    <Section variant="light" spacing="default" className="pt-32 md:pt-40">
      <Container>
        <h2
          aria-hidden="true"
          className="pointer-events-none mb-2 select-none text-[14vw] font-bold leading-[0.85] tracking-tightest text-text-primary/[0.06] md:text-[12vw] lg:text-[180px]"
        >
          OUR PORTFOLIO
        </h2>
        <div className="-mt-[10vw] flex flex-col gap-6 md:-mt-[8vw] md:flex-row md:items-end md:justify-between lg:-mt-32">
          <div className="relative">
            <SectionEyebrow>OUR PORTFOLIO</SectionEyebrow>
            <Heading as="h2" size="h1" className="mt-4 max-w-2xl">
              실제 비즈니스 성과로 이어진 사례
            </Heading>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary"
          >
            전체 포트폴리오 보기
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 카드는 /portfolio와 같은 PortfolioCard를 재사용한다(마크업 중복 제거 +
            hover 훑기 동작 일치). 3:4 세로 카드라 2열은 지나치게 커져 lg에서 4열로 편다. */}
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {portfolios.map((p) => (
            <PortfolioCard key={p.slug} portfolio={p} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
