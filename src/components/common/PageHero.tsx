import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './Container';
import { Heading } from './Heading';
import { SectionEyebrow } from './SectionEyebrow';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** 헤드라인 우측(모바일에서는 아래)에 놓이는 보조 블록. 넓은 화면의 빈 여백을 채운다. */
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, description, aside }: PageHeroProps) {
  return (
    <section className="pt-32 pb-16 md:pt-44 md:pb-24">
      <Container>
        <div
          className={cn(
            aside && 'lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16',
          )}
        >
          <div className="max-w-3xl">
            {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
            <Heading as="h1" size="display" className="mt-6">
              {title}
            </Heading>
            {description && (
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                {description}
              </p>
            )}
          </div>
          {aside && <div className="mt-12 lg:mt-0">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
