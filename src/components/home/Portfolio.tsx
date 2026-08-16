import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { portfolios } from '@/data/portfolios';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { Reveal } from '@/components/common/Reveal';
import { PortfolioCard } from '@/components/portfolio/PortfolioCard';

/**
 * 2막 — 증거. 훑기 카드(PortfolioCard)를 2열 스태거로 배치해
 * 균일 그리드 대신 편집지의 지그재그 리듬을 만든다.
 * 오프셋은 translate가 아니라 margin이라 다음 섹션과 겹치지 않는다.
 */
export function PortfolioSection() {
  return (
    <Section variant="light" spacing="default">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Heading as="h2" size="h1" className="max-w-2xl">
            실제 비즈니스 성과로
            <br />
            이어진 사례
          </Heading>
          <Link
            href="/portfolio"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-text-primary hover:text-primary"
          >
            전체 포트폴리오 보기
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {portfolios.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08} className={cn(i % 2 === 1 && 'md:mt-28')}>
              <PortfolioCard portfolio={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
