'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE_OUT_EXPO } from '@/lib/motion';

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'article';
};

export function Reveal({ children, delay = 0, duration = 0.6, className, as = 'div' }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
      variants={variants}
    >
      {children}
    </Comp>
  );
}
