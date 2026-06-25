import { Quote, Handshake, Award, Users, ShieldCheck } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { GridGlow } from '@/components/common/GridGlow';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { COMMERCIAL_METADATA } from '@/lib/seo-policy';
import { CORE_GUIDE_LINKS } from '@/lib/seo-policy';
import { GuideLinks } from '@/components/content/GuideLinks';
import { Process } from '@/components/home/Process';
import { CtaBanner } from '@/components/home/CtaBanner';

export const metadata = buildMetadata(COMMERCIAL_METADATA['/about']);

const storyStats = [
  { value: '1년 2개월', label: '한 프로젝트에 쏟은 시간' },
  { value: '360p', label: '설계한 UI/UX 화면' },
  { value: '3회', label: '끝까지 함께한 리뉴얼' },
];

const stats = [
  { value: '110+', label: '누적 프로젝트' },
  { value: '85%', label: '3년 연속 재계약률' },
  { value: '100%', label: '프로젝트 완수율' },
  { value: '0건', label: '보안 사고' },
];

const principles = [
  {
    icon: Handshake,
    title: '신뢰',
    desc: '계약 전 시안부터 오픈 후 케어까지, 매 단계마다 솔직한 진행 상황을 공유합니다.',
  },
  {
    icon: Award,
    title: '전문성',
    desc: '제조·물류·IT·바이오 등 다양한 산업에서 검증된 110건 이상의 제작 사례.',
  },
  {
    icon: Users,
    title: '협업',
    desc: '기획·디자인·개발이 한 팀에서 진행되어, 의사결정 속도가 빠릅니다.',
  },
  {
    icon: ShieldCheck,
    title: '책임',
    desc: '오픈 후 1년간 무상 유지보수로, 사이트가 비즈니스에 안착할 때까지 함께합니다.',
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: '홈', path: '/' }, { name: '회사소개', path: '/about' }]} />

      {/* Hero — dark with grid + glow */}
      <Section
        variant="dark"
        spacing="none"
        className="flex min-h-[50vh] items-center pb-20 pt-32 md:min-h-[58vh] md:pt-40"
      >
        <GridGlow />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <SectionEyebrow variant="dark">ABOUT</SectionEyebrow>
            <Heading as="h1" size="display" className="mt-6 text-white">
              비즈니스의 성장을 위한 디지털 파트너
            </Heading>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              웹스랩은 단순한 외주 업체가 아닌, 비즈니스 목표를 함께 고민하는 파트너입니다. 기획부터
              운영까지 한 팀에서 책임지고 마무리합니다.
            </p>
          </div>
        </Container>
      </Section>

      <GuideLinks title="업체 선정과 제작 일정 가이드" links={CORE_GUIDE_LINKS['/about']} />

      {/* 대표 인사말 */}
      <Section variant="light" spacing="default">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div>
              <SectionEyebrow>CEO MESSAGE</SectionEyebrow>
              <Heading as="h2" size="h2" className="mt-4">
                대표 인사말
              </Heading>
              <Quote size={64} strokeWidth={1.25} className="mt-8 text-primary/20" />
            </div>
            <div className="max-w-2xl space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
              <p>websLAB을 찾아주셔서 감사합니다.</p>
              <p>
                저희의 시작은 한 결혼정보회사였습니다. 세 번의 리뉴얼, 1년 2개월, 360페이지에 달하는
                UI/UX 작업 — 결코 쉬운 프로젝트가 아니었지만 저희는{' '}
                <strong className="font-semibold text-text-primary">끝까지 마무리했습니다.</strong>{' '}
                그 경험이 지금의 websLAB을 만들었습니다.
              </p>
              <p>
                사내 개발팀이 없는 기업일수록 웹사이트 제작은 막막합니다. 어디서부터 시작할지, 맡겨도
                끝까지 책임져 줄지. 그래서 저희는 ‘외주 업체’가 아니라 기획부터 운영까지 함께 가는{' '}
                <strong className="font-semibold text-text-primary">‘파트너’</strong>가 되기로
                했습니다.
              </p>
              <p>귀사의 비즈니스가 성장하는 그 과정에, websLAB이 끝까지 함께하겠습니다.</p>
              <div className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  조
                </span>
                <div>
                  <p className="text-sm text-text-muted">websLAB 대표</p>
                  <p className="text-lg font-bold tracking-tightest text-text-primary">조현도</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 우리의 시작 (브랜드 스토리) */}
      <Section variant="surface" spacing="default">
        <Container>
          <h2
            aria-hidden="true"
            className="pointer-events-none mb-2 select-none text-[16vw] font-bold leading-[0.85] tracking-tightest text-text-primary/[0.04] md:text-[13vw] lg:text-[190px]"
          >
            STORY
          </h2>
          <div className="-mt-[11vw] md:-mt-[9vw] lg:-mt-32">
            <SectionEyebrow>OUR STORY</SectionEyebrow>
            <Heading as="h2" size="h1" className="mt-4 max-w-3xl">
              끝까지 마무리하는 것, 거기서 시작했습니다
            </Heading>
          </div>
          <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
            <div className="space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
              <p>
                한 결혼정보회사의 웹사이트를, websLAB은 세 번에 걸쳐 리뉴얼했습니다. 1년 2개월 동안
                360페이지에 달하는 화면을 설계하고 다시 그렸습니다. 요구사항은 계속 바뀌었고, 일정은
                쉽지 않았습니다.
              </p>
              <p>
                그때 저희가 내린 결론은 분명했습니다.{' '}
                <strong className="font-semibold text-text-primary">
                  시작은 누구나 할 수 있지만, 끝까지 책임지고 마무리하는 회사는 많지 않다.
                </strong>{' '}
                그 차이가 결국 비즈니스의 성패를 가른다는 것을요.
              </p>
              <p>
                그래서 websLAB은 어떤 상황에서도 맡은 프로젝트를 끝까지 마무리합니다.
                기획·디자인·개발이 한 팀에서 움직이고, 오픈 후 1년은 무상으로 함께 살핍니다. 사내
                개발팀이 없는 기업이 가장 믿고 맡길 수 있는 파트너 — 그게 우리가 일하는 이유입니다.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-8 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {storyStats.map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-bold tracking-tightest text-primary md:text-5xl">
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 숫자 — dark glow band */}
      <Section variant="dark" spacing="default">
        <GridGlow />
        <Container className="relative z-10">
          <SectionEyebrow variant="dark">BY THE NUMBERS</SectionEyebrow>
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold tracking-tightest text-white md:text-6xl">
                  {s.value}
                </p>
                <p className="mt-3 text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 우리가 지키는 원칙 */}
      <Section variant="light" spacing="default">
        <Container>
          <h2
            aria-hidden="true"
            className="pointer-events-none mb-2 select-none text-[14vw] font-bold leading-[0.85] tracking-tightest text-text-primary/[0.05] md:text-[12vw] lg:text-[160px]"
          >
            PRINCIPLES
          </h2>
          <div className="-mt-[10vw] md:-mt-[8vw] lg:-mt-28">
            <SectionEyebrow>PRINCIPLES</SectionEyebrow>
            <Heading as="h2" size="h1" className="mt-4 max-w-2xl">
              우리가 지키는 원칙
            </Heading>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <div
                key={p.title}
                className="group border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_48px_-28px_rgba(29,116,255,0.45)]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <p.icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 text-lg font-bold tracking-tightest text-text-primary">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 일하는 방식 (프로세스) */}
      <Process />

      {/* 문의 CTA */}
      <CtaBanner />
    </>
  );
}
