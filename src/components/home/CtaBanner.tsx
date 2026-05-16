import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';

export function CtaBanner() {
  return (
    <Section variant="surface" spacing="none">
      <Container>
        <div className="grid divide-y divide-line border-t border-line md:grid-cols-2 md:divide-x md:divide-y-0">
          <Link
            href="/portfolio"
            className="group flex flex-col justify-between gap-12 py-16 md:py-24 md:pr-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
              Our Portfolio
            </p>
            <div className="flex items-end justify-between gap-4">
              <Heading as="h3" size="h2" className="text-text-primary group-hover:text-primary">
                포트폴리오 더보기
              </Heading>
              <ArrowRight
                size={32}
                className="text-text-muted transition-all group-hover:translate-x-1 group-hover:text-primary"
              />
            </div>
          </Link>

          <Link
            href="/contact"
            className="group flex flex-col justify-between gap-12 py-16 md:py-24 md:pl-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
              Contact us
            </p>
            <div className="flex items-end justify-between gap-4">
              <Heading as="h3" size="h2" className="text-text-primary group-hover:text-primary">
                문의하기
              </Heading>
              <ArrowRight
                size={32}
                className="text-text-muted transition-all group-hover:translate-x-1 group-hover:text-primary"
              />
            </div>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
