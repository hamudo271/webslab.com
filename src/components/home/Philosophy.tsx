import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';

const proof = [
  { value: '100%', label: '프로젝트 완수율' },
  { value: '85%', label: '3년 연속 재계약률' },
  { value: '4.9', suffix: '/5.0', label: '고객 만족도' },
  { value: '0건', label: '보안 사고' },
];

export function Philosophy() {
  return (
    <Section variant="dark" spacing="default">
      <Container>
        <div className="max-w-3xl">
          <SectionEyebrow variant="dark">OUR PHILOSOPHY</SectionEyebrow>
          <Heading as="h2" size="h1" className="mt-5">
            외주가 아니라,
            <br />
            끝까지 책임지는 파트너입니다.
          </Heading>
          <p className="mt-7 text-base leading-relaxed text-white/70 md:text-lg">
            사내 개발팀이 없어도 괜찮습니다. 기획부터 디자인·개발·운영까지, 한 팀이 프로젝트의
            시작과 마무리를 책임집니다.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
          {proof.map((p) => (
            <div key={p.label}>
              <p className="text-3xl font-bold tracking-tightest text-white md:text-4xl">
                {p.value}
                {p.suffix && <span className="text-lg text-white/40">{p.suffix}</span>}
              </p>
              <p className="mt-2 text-sm text-white/60">{p.label}</p>
            </div>
          ))}
        </div>

        <Link
          href="/about"
          className="group mt-12 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-primary-light hover:bg-white/5"
        >
          회사소개에서 우리의 시작 보기
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Container>
    </Section>
  );
}
