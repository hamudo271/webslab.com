'use client';

import { motion } from 'framer-motion';
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
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:mt-20 md:gap-x-20">
          {clientLogos.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="text-xl font-bold tracking-tightest text-text-primary/70 transition-colors hover:text-text-primary md:text-3xl"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </Container>
    </Section>
  );
}
