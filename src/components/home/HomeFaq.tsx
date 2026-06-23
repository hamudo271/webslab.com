'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { cn } from '@/lib/cn';

type Faq = { question: string; answer: string };

export function HomeFaq({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section variant="light" spacing="default">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {/* Left — section header + CTA (sticky on desktop) */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionEyebrow>FAQ</SectionEyebrow>
            <Heading as="h2" size="h1" className="mt-4">
              자주 묻는 질문
            </Heading>
            <p className="mt-6 max-w-md leading-relaxed text-text-secondary">
              홈페이지 제작을 준비하며 가장 많이 묻는 질문을 모았습니다. 더 궁금한 점은 편하게
              문의해 주세요.
            </p>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-primary"
            >
              1:1 무료 상담 문의하기
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right — numbered accordion */}
          <ul className="list-none border-t border-line pl-0">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={i} className="list-none border-b border-line">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`home-faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-start gap-5 py-6 text-left md:gap-6"
                  >
                    <span className="pt-0.5 font-mono text-sm font-bold tabular-nums text-primary/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'flex-1 text-lg font-bold leading-snug tracking-tightest transition-colors md:text-xl',
                        isOpen ? 'text-primary' : 'text-text-primary group-hover:text-primary',
                      )}
                    >
                      {f.question}
                    </span>
                    <Plus
                      size={22}
                      strokeWidth={1.75}
                      className={cn(
                        'mt-0.5 shrink-0 text-text-muted transition-all duration-300',
                        isOpen ? 'rotate-45 text-primary' : 'group-hover:text-primary',
                      )}
                    />
                  </button>
                  <div
                    id={`home-faq-${i}`}
                    role="region"
                    hidden={!isOpen}
                    className="pb-7 pl-10 pr-8 text-base leading-relaxed text-text-secondary md:pl-11"
                  >
                    {f.answer}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
