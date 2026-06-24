import Link from 'next/link';
import {
  FileSpreadsheet,
  Globe,
  MessageSquare,
  FileText,
  LayoutDashboard,
  ScanLine,
  ArrowRight,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { GridGlow } from '@/components/common/GridGlow';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata = buildMetadata({
  title: '프로그램 개발 · 업무 자동화',
  description:
    '엑셀·웹·메신저·문서 업무를 자동화하는 맞춤 프로그램을 개발합니다. 사람이 반복하던 일을 프로그램이 대신해 시간과 비용을 줄입니다.',
  path: '/program',
});

const fields = [
  {
    icon: FileSpreadsheet,
    title: '엑셀 업무 자동화',
    desc: '재고·정산·리포트 등 반복되는 엑셀 작업을 자동으로 집계하고 생성합니다.',
  },
  {
    icon: Globe,
    title: '데이터 수집·크롤링',
    desc: '여러 사이트에 흩어진 정보를 자동으로 모아 엑셀·DB로 정리합니다.',
  },
  {
    icon: MessageSquare,
    title: '메신저·메일 자동화',
    desc: '카카오톡·이메일 발송과 응대, 알림을 정해진 규칙대로 자동 처리합니다.',
  },
  {
    icon: FileText,
    title: '문서·서식 자동 발급',
    desc: '등기부·명세서 등 반복 발급·정리 작업을 프로그램이 대신합니다.',
  },
  {
    icon: LayoutDashboard,
    title: '사내 관리 프로그램',
    desc: '재고·인력·일정 등 업무에 꼭 맞는 관리 도구를 맞춤 제작합니다.',
  },
  {
    icon: ScanLine,
    title: 'OCR·문서 인식',
    desc: '스캔본·이미지에서 필요한 데이터를 자동으로 추출해 입력합니다.',
  },
];

const benefits = [
  { icon: Clock, title: '시간 절감', desc: '하루 몇 시간씩 걸리던 반복 작업을 분 단위로 줄입니다.' },
  { icon: ShieldCheck, title: '휴먼 에러 제거', desc: '사람이 실수하던 단순 반복을 프로그램이 정확하게 처리합니다.' },
  { icon: TrendingDown, title: '비용 절감', desc: '반복 업무에 쓰던 인건비와 시간을 더 중요한 일에 씁니다.' },
];

const steps = [
  { no: '01', title: '업무 진단', desc: '반복 업무를 함께 분석해 자동화할 범위와 효과를 먼저 정리합니다.' },
  { no: '02', title: '개발·검증', desc: '업무에 맞는 프로그램을 개발하고 실제 데이터로 정확도를 검증합니다.' },
  { no: '03', title: '적용·운영', desc: '현장에 적용한 뒤 안정화하고, 업무 변화에 맞춰 개선까지 지원합니다.' },
];

export default function ProgramPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: '홈', path: '/' },
          { name: '프로그램 개발', path: '/program' },
        ]}
      />

      {/* Hero — dark with grid + glow */}
      <Section
        variant="dark"
        spacing="none"
        className="flex min-h-[58vh] items-center pb-20 pt-32 md:min-h-[66vh] md:pt-40"
      >
        <GridGlow />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <SectionEyebrow variant="dark">PROGRAM · AUTOMATION</SectionEyebrow>
            <Heading as="h1" size="display" className="mt-6 text-white">
              반복 업무는 프로그램에 맡기세요
            </Heading>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              엑셀·웹·메신저·문서 업무를 자동화하는 맞춤 프로그램을 직접 개발합니다. 사람이
              반복하던 일을 프로그램이 대신합니다.
            </p>
            <Link
              href="/contact"
              className="group mt-9 inline-flex items-center gap-2 bg-white px-7 py-3.5 text-sm font-semibold text-text-primary transition-colors hover:bg-primary-light"
            >
              자동화 상담 신청
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </Section>

      {/* Capabilities — giant watermark + hover cards */}
      <Section variant="light" spacing="default">
        <Container>
          <h2
            aria-hidden="true"
            className="pointer-events-none mb-2 select-none text-[14vw] font-bold leading-[0.85] tracking-tightest text-text-primary/[0.05] md:text-[12vw] lg:text-[170px]"
          >
            AUTOMATION
          </h2>
          <div className="-mt-[10vw] md:-mt-[8vw] lg:-mt-28">
            <SectionEyebrow>WHAT WE BUILD</SectionEyebrow>
            <Heading as="h2" size="h1" className="mt-4 max-w-2xl">
              이런 프로그램을 개발합니다
            </Heading>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((f) => (
              <div
                key={f.title}
                className="group relative border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_48px_-28px_rgba(29,116,255,0.45)]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <f.icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 text-lg font-bold tracking-tightest text-text-primary md:text-xl">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{f.desc}</p>
                <ArrowUpRight
                  size={20}
                  className="absolute right-6 top-6 text-text-muted/30 transition-all group-hover:right-5 group-hover:top-5 group-hover:text-primary"
                />
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-text-muted">
            * 위 분야 외에도, 반복되는 업무라면 대부분 자동화·프로그램으로 만들 수 있습니다.
          </p>
        </Container>
      </Section>

      {/* Why automation — dark with grid + glow */}
      <Section variant="dark" spacing="default">
        <GridGlow />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <SectionEyebrow variant="dark">WHY AUTOMATION</SectionEyebrow>
            <Heading as="h2" size="h1" className="mt-4 text-white">
              사람은 더 중요한 일에,
              <br className="hidden md:block" /> 반복은 프로그램에
            </Heading>
          </div>
          <div className="mt-14 grid gap-10 border-t border-white/10 pt-12 md:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title}>
                <b.icon size={28} strokeWidth={1.5} className="text-primary-light" />
                <h3 className="mt-5 text-xl font-bold tracking-tightest text-white">{b.title}</h3>
                <p className="mt-3 leading-relaxed text-white/70">{b.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Process — numbered cards */}
      <Section variant="surface" spacing="default">
        <Container>
          <SectionEyebrow>HOW IT WORKS</SectionEyebrow>
          <Heading as="h2" size="h1" className="mt-4">
            진행 방식
          </Heading>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.no} className="border border-line bg-white p-8 md:p-10">
                <p className="text-5xl font-bold leading-none tracking-tightest text-primary/15 md:text-6xl">
                  {s.no}
                </p>
                <h3 className="mt-5 text-xl font-bold tracking-tightest text-text-primary">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA — strong dark band */}
      <Section variant="darker" spacing="default">
        <GridGlow />
        <Container className="relative z-10">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <Heading as="h2" size="h2" className="text-white">
                무엇부터 줄일 수 있을지, 무료로 진단해 드립니다
              </Heading>
              <p className="mt-4 text-white/70 md:text-lg">
                반복하시는 업무를 알려주시면 자동화 가능 여부와 효과를 먼저 정리해 드립니다.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 bg-white px-8 py-4 text-base font-semibold text-text-primary transition-colors hover:bg-primary-light"
            >
              자동화 상담 신청
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
