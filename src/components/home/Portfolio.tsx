import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { portfolios } from '@/data/portfolios';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { Badge } from '@/components/common/Badge';

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

        <div className="mt-12 grid gap-x-6 gap-y-16 md:grid-cols-2">
          {portfolios.map((p) => (
            <Link key={p.slug} href={`/portfolio/${p.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-light">
                <Image
                  src={p.cover}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold tracking-tightest text-text-primary md:text-xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">{p.summary}</p>
                </div>
                <Badge variant="outline" size="sm" className="shrink-0">
                  {p.duration}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
