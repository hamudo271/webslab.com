import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { Reveal } from '@/components/common/Reveal';

const proof = [
  { value: '100%', label: '프로젝트 완수율' },
  { value: '85%', label: '3년 연속 재계약률' },
  { value: '4.9', suffix: '/5.0', label: '고객 만족도' },
  { value: '0건', label: '보안 사고' },
];

/**
 * 2막의 문 — 다크 무대(1막)가 끝나고 밝은 지면이 시작되는 자리.
 * 좌측 열을 비워 편집지처럼 숨을 쉬게 하고, 서사는 우측 9열에 싣는다.
 */
export function Philosophy() {
  return (
    <Section variant="light" spacing="breath">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            {/* 비워두는 열 — 모바일에서는 상단 러닝 라벨로 접힌다 */}
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted lg:sticky lg:top-32">
              websLAB — Digital Studio
            </p>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <Heading as="h2" size="h1">
                외주가 아니라,
                <br />
                끝까지 책임지는 파트너입니다.
              </Heading>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
                사내 개발팀이 없어도 괜찮습니다. 기획부터 디자인·개발·운영까지, 한 팀이
                프로젝트의 시작과 마무리를 책임집니다.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-16 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
                {proof.map((p) => (
                  <div key={p.label}>
                    <p className="text-3xl font-bold tracking-tightest text-text-primary md:text-4xl">
                      {p.value}
                      {p.suffix && (
                        <span className="text-lg font-semibold text-text-muted">{p.suffix}</span>
                      )}
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">{p.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <Link
                href="/about"
                className="group mt-12 inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-primary"
              >
                회사소개에서 우리의 시작 보기
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
