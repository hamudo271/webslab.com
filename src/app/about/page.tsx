import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { PageHero } from '@/components/common/PageHero';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata = buildMetadata({
  title: '회사소개',
  description: '웹슬랩은 기업 홈페이지 신규 제작과 리뉴얼을 전문으로 하는 디지털 에이전시입니다.',
  path: '/about',
});

const values = [
  { title: '신뢰', desc: '계약 전 시안부터 오픈 후 케어까지, 매 단계마다 솔직한 진행 상황을 공유합니다.' },
  { title: '전문성', desc: '제조·물류·IT·바이오 등 다양한 산업에서 검증된 100건 이상의 제작 사례.' },
  { title: '협업', desc: '기획·디자인·개발이 한 팀에서 진행되어, 의사결정 속도가 빠릅니다.' },
  { title: '책임', desc: '오픈 후 1년간 무상 유지보수로, 사이트가 비즈니스에 안착할 때까지 함께합니다.' },
];

const stats = [
  { value: '100+', label: '누적 프로젝트' },
  { value: '7년+', label: '운영 경험' },
  { value: '95%', label: '재계약·추천 비율' },
  { value: '6단계', label: '제작 프로세스' },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: '홈', path: '/' }, { name: '회사소개', path: '/about' }]} />
      <PageHero
        eyebrow="ABOUT"
        title="비즈니스의 성장을 위한 디지털 파트너"
        description="웹슬랩은 단순한 외주 업체가 아닌, 비즈니스 목표를 함께 고민하는 파트너입니다. 기획부터 운영까지 한 팀에서 책임지고 마무리합니다."
      />

      <Section variant="surface" spacing="default">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold tracking-tightest text-primary md:text-5xl">
                  {s.value}
                </p>
                <p className="mt-3 text-sm text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="light" spacing="default">
        <Container>
          <SectionEyebrow>VALUES</SectionEyebrow>
          <Heading as="h2" size="h1" className="mt-4 max-w-2xl">
            우리가 일하는 방식
          </Heading>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-6 border border-line bg-white p-8 md:p-10"
              >
                <Heading as="h3" size="h3">{v.title}</Heading>
                <p className="text-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
