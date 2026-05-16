'use client';

import Image from 'next/image';
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
            함께 한 100여 곳의 기업
          </Heading>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {clientLogos.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: 'easeOut' }}
              className="flex h-20 items-center justify-center rounded-md bg-white"
            >
              <Image
                src={c.src}
                alt={c.alt}
                width={140}
                height={48}
                className="opacity-60 transition-opacity duration-300 hover:opacity-100"
                style={{ filter: 'grayscale(1)' }}
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
