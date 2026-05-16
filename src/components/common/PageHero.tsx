import { Container } from './Container';
import { Heading } from './Heading';
import { SectionEyebrow } from './SectionEyebrow';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="pt-32 pb-16 md:pt-44 md:pb-24">
      <Container>
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
      </Container>
    </section>
  );
}
