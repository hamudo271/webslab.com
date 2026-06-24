import Link from 'next/link';
import {
  FileSpreadsheet,
  Globe,
  MessageSquare,
  FileText,
  LayoutDashboard,
  ScanLine,
  ArrowRight,
} from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { PageHero } from '@/components/common/PageHero';
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
      <PageHero
        eyebrow="PROGRAM"
        title="반복 업무를 줄이는 프로그램·자동화 개발"
        description="사람이 반복하던 엑셀·웹·메신저·문서 업무를 프로그램이 대신합니다. 업무에 꼭 맞는 자동화 도구를 직접 개발합니다."
      />

      {/* 개발 분야 */}
      <Section variant="light" spacing="default">
        <Container>
          <SectionEyebrow>WHAT WE BUILD</SectionEyebrow>
          <Heading as="h2" size="h1" className="mt-4 max-w-2xl">
            이런 프로그램을 개발합니다
          </Heading>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((f) => (
              <div
                key={f.title}
                className="border border-line bg-white p-8 transition-colors hover:border-primary/40"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 text-lg font-bold tracking-tightest text-text-primary">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-text-muted">
            * 위 분야 외에도, 반복되는 업무라면 대부분 자동화·프로그램으로 만들 수 있습니다.
          </p>
        </Container>
      </Section>

      {/* 진행 방식 */}
      <Section variant="dark" spacing="default">
        <Container>
          <div className="text-center">
            <SectionEyebrow variant="dark">HOW IT WORKS</SectionEyebrow>
            <Heading as="h2" size="h1" className="mt-4">
              진행 방식
            </Heading>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.no} className="border border-white/10 bg-white/[0.02] p-8 md:p-10">
                <p className="font-mono text-sm font-bold text-primary-light">{s.no}</p>
                <h3 className="mt-5 text-xl font-bold tracking-tightest text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="surface" spacing="default">
        <Container>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Heading as="h2" size="h2">
                무엇부터 줄일 수 있을지, 무료로 진단해 드립니다
              </Heading>
              <p className="mt-4 text-text-secondary md:text-lg">
                반복하시는 업무를 알려주시면 자동화 가능 여부와 효과를 먼저 정리해 드립니다.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 bg-primary px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-primary/90"
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
