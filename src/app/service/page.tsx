import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { Badge } from '@/components/common/Badge';
import { PageHero } from '@/components/common/PageHero';
import { Process } from '@/components/home/Process';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd';

export const metadata = buildMetadata({
  title: '서비스',
  description: '신규 홈페이지 제작·리뉴얼·유지보수까지, 웹슬랩이 제공하는 모든 서비스.',
  path: '/service',
});

const services = [
  {
    badge: 'NEW BUILD',
    title: '신규 홈페이지 제작',
    description:
      '기획부터 디자인, 개발, 오픈까지 한 팀이 전 과정을 책임집니다. 브랜드 톤에 맞춘 단독 시안, SEO 최적화, 운영자가 직접 다룰 수 있는 CMS를 기본 제공합니다.',
    features: [
      '단독 메인 시안 (계약 전 제공)',
      '반응형 퍼블리싱',
      '검색엔진 최적화 (SEO)',
      '관리자 페이지 (CMS) 구축',
      '오픈 후 2주 안정화 케어',
      '1년 무상 유지보수',
    ],
  },
  {
    badge: 'RENEWAL',
    title: '홈페이지 리뉴얼',
    description:
      '기존 자산은 그대로 살리되, 정보 구조와 비주얼만 새롭게. 운영 데이터를 무중단으로 마이그레이션하고, 옛 URL의 SEO 신호를 보존합니다.',
    features: [
      '현재 사이트 UX/UI 분석',
      '정보구조 재설계',
      '디자인 시스템 적용',
      '301 리다이렉트 설계',
      'DB·CMS 마이그레이션',
      '검색엔진 인덱싱 유지',
    ],
  },
  {
    badge: 'MAINTENANCE',
    title: '유지보수·운영',
    description:
      '오픈한 사이트가 계속 성장하도록 함께 운영합니다. 정기 점검, 콘텐츠 업데이트, 보안 패치, 성능 개선까지.',
    features: [
      '월간 정기 점검',
      '콘텐츠 업데이트 지원',
      '보안 패치·백업',
      '성능 모니터링',
      '리포트 발송',
      '필요 시 기능 개선',
    ],
  },
];

export default function ServicePage() {
  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: '홈', path: '/' }, { name: '서비스', path: '/service' }]} />
      <ServiceJsonLd
        name="기업 홈페이지 리뉴얼"
        description="5년 이상 노후 사이트의 디자인·기술 리뉴얼을 전담합니다. Next.js + Headless CMS 기반."
        serviceType="웹사이트 리뉴얼"
        areaServed="KR"
      />
      <PageHero
        eyebrow="SERVICE"
        title="기업 홈페이지를 위한 완성형 서비스"
        description="단계별 단발성 외주가 아니라, 기획부터 운영까지 책임지는 풀 사이클 서비스."
      />

      <Section variant="light" spacing="default">
        <Container>
          <div className="space-y-16 md:space-y-24">
            {services.map((s) => (
              <div key={s.title} className="grid gap-10 md:grid-cols-[1fr_2fr]">
                <div>
                  <Badge variant="primary" size="md">{s.badge}</Badge>
                  <Heading as="h2" size="h2" className="mt-4">{s.title}</Heading>
                </div>
                <div>
                  <p className="text-text-secondary leading-relaxed md:text-lg">{s.description}</p>
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-text-primary">
                        <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Process />
    </>
  );
}
