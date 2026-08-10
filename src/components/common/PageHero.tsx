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
  // 아래 Section이 자체 상단 패딩(py-20 md:py-28)을 갖고 있어, 히어로 하단까지 여유롭게 잡으면
  // 본문 시작 전에 죽은 공백이 200px 넘게 생긴다. 히어로 쪽 하단은 얕게 둔다.
  return (
    <section className="pt-32 pb-10 md:pt-44 md:pb-14">
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
