import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { Badge } from '@/components/common/Badge';
import { PageHero } from '@/components/common/PageHero';
import { Process } from '@/components/home/Process';
import { Pricing } from '@/components/home/Pricing';
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd';
import { COMMERCIAL_METADATA } from '@/lib/seo-policy';
import { CORE_GUIDE_LINKS } from '@/lib/seo-policy';
import { GuideLinks } from '@/components/content/GuideLinks';

export const metadata = buildMetadata(COMMERCIAL_METADATA['/service']);

const services = [
  {
    badge: 'NEW BUILD',
    title: '신규 홈페이지 제작',
    description:
      '사이트가 없거나, 지금 사이트로는 회사를 설명할 수 없을 때. 기획부터 디자인·개발·오픈까지 한 팀이 맡습니다. 계약 전 단독 메인 시안, 검색엔진이 읽을 수 있는 구조, 운영자가 직접 다루는 CMS가 기본 구성입니다.',
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
      '쌓아둔 콘텐츠와 검색 주소는 지키고 싶은데 구조와 디자인만 낡았을 때. 운영 데이터를 무중단으로 옮기고, 옛 URL은 301로 연결해 검색 유입을 지킵니다.',
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
      '만들어 놓고 아무도 손대지 않는 사이트가 되지 않도록. 정기 점검, 콘텐츠 업데이트, 보안 패치, 성능 개선을 월 단위로 함께 맡습니다.',
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
      <WebPageJsonLd
        path="/service"
        name={COMMERCIAL_METADATA['/service'].title}
        description={COMMERCIAL_METADATA['/service'].description}
      />
      <ServiceJsonLd
        name="기업 홈페이지 리뉴얼"
        description="5년 이상 노후 사이트의 디자인·기술 리뉴얼을 전담합니다. Next.js + Headless CMS 기반."
        serviceType="웹사이트 리뉴얼"
        areaServed="KR"
      />
      <PageHero
        eyebrow="SERVICE"
        title="기업 홈페이지, 어디부터 손대야 할까요"
        description="정보 구조와 기술 스택을 그대로 쓸 수 있으면 리뉴얼, 아니면 신규 제작입니다. 현재 사이트를 먼저 보고 방향부터 말씀드립니다. 필요한 단계만 맡기셔도 됩니다."
      />
      <GuideLinks title="제작·리뉴얼 의사결정 가이드" links={CORE_GUIDE_LINKS['/service']} />

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

      <Pricing />

      <Process />
    </>
  );
}
