'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { clientLogos } from '@/data/clientLogos';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';

export function ClientLogos() {
  return (
    <Section variant="surface" spacing="default">
      <Container>
        <h2
          aria-hidden="true"
          className="pointer-events-none mb-2 select-none text-center text-[14vw] font-bold leading-[0.85] tracking-tightest text-text-primary/[0.05] md:text-[12vw] lg:text-[180px]"
        >
          OUR CLIENTS
        </h2>
        <div className="-mt-[10vw] text-center md:-mt-[8vw] lg:-mt-32">
          <SectionEyebrow>OUR CLIENTS</SectionEyebrow>
          <Heading as="h2" size="h2" className="mt-4">
            신뢰로 함께한 브랜드
          </Heading>
          <p className="mx-auto mt-5 max-w-md text-sm text-text-secondary md:text-base">
            websLAB과 함께 사이트를 만든 브랜드입니다. 로고를 누르면 케이스로 이동합니다.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {clientLogos.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
            >
              <Link
                href={c.href}
                className="group relative flex h-full flex-col items-center justify-center gap-2 border border-line bg-white px-6 py-14 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_48px_-28px_rgba(29,116,255,0.4)]"
              >
                <span className="text-xl font-bold tracking-tightest text-text-primary/55 transition-colors group-hover:text-primary md:text-2xl">
                  {c.name}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-text-muted">
                  {c.tag}
                </span>
                <ArrowUpRight
                  size={18}
                  className="absolute right-5 top-5 text-text-muted/30 transition-all group-hover:right-4 group-hover:top-4 group-hover:text-primary"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
