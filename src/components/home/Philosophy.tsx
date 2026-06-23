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
      {/* Decorative background — blueprint grid + soft brand glow (CSS only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 75% 70% at 22% 12%, #000 35%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 22% 12%, #000 35%, transparent 100%)',
          }}
        />
        <div className="absolute -right-32 -top-40 h-[540px] w-[540px] rounded-full bg-primary/20 blur-[130px]" />
        <div className="absolute -bottom-48 left-1/4 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[130px]" />
      </div>
      <Container className="relative z-10">
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
