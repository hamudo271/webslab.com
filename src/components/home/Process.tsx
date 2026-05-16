import { processSteps } from '@/data/processSteps';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';

export function Process() {
  return (
    <Section variant="darker" spacing="default">
      <Container>
        <div className="text-center">
          <SectionEyebrow variant="dark">WEBSLAB PROCESS</SectionEyebrow>
          <Heading as="h2" size="h1" className="mt-4">
            제작 프로세스
          </Heading>
          <p className="mx-auto mt-6 max-w-2xl text-white/70">
            문의부터 오픈 후 케어까지, 6단계로 진행합니다.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 border-l border-white/10 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((s) => (
            <div
              key={s.step}
              className="flex flex-col gap-6 border-r border-b border-white/10 p-8 md:p-10 lg:min-h-[280px]"
            >
              <p className="text-xs font-semibold tracking-[0.3em] text-primary-light">
                STEP {s.step}
              </p>
              <Heading as="h3" size="h3">{s.title}</Heading>
              <ul className="space-y-2 text-sm text-white/70">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-primary-light" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
