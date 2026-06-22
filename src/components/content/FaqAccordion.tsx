'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

type Faq = { question: string; answer: string };

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="my-12 border-t border-line pt-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tightest">자주 묻는 질문</h2>
      <ul className="list-none divide-y divide-line pl-0">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <li key={i} className="list-none">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-center justify-between py-5 text-left text-base font-medium hover:text-primary"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span>{f.question}</span>
                <ChevronDown
                  size={20}
                  className={cn('transition-transform', isOpen && 'rotate-180')}
                />
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                hidden={!isOpen}
                className="pb-5 text-sm leading-relaxed text-text-secondary"
              >
                {f.answer}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
