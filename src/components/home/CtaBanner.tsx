import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Reveal } from '@/components/common/Reveal';

/**
 * 3막 — 결정. 1막과 같은 다크 무대로 돌아와 시안 오퍼로 닫는다.
 * variant는 darker(#191919) — 바로 아래 푸터와 같은 지면이라 이음매 없이 한 막이 된다.
 */
export function CtaBanner() {
  return (
    <Section variant="darker" spacing="breath" className="text-white">
      {/* 클로징 조명 — 코발트 한 점 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-30%] h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-electric/15 blur-[140px]" />
      </div>
      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-4xl font-extrabold leading-[1.12] tracking-[-0.04em] md:text-5xl lg:text-6xl">
              계약 전, <span className="text-electric-bright">시안</span>부터
              <br />
              확인하세요
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-7 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
              메인페이지 시안을 먼저 만들어 보여드립니다. 보고 결정하셔도 늦지 않습니다.
              문의는 1영업일 안에 회신드립니다.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-electric px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-electric-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-bright focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                프로젝트 문의
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 border border-white/25 px-8 py-4 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                포트폴리오 더보기
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
