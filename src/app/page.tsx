import { HeroStage } from '@/components/home/HeroStage';
import { LatestColumns } from '@/components/home/LatestColumns';
import { PortfolioSection } from '@/components/home/Portfolio';
import { PortfolioParallax } from '@/components/home/PortfolioParallax';
import { Philosophy } from '@/components/home/Philosophy';
import { ClientLogos } from '@/components/home/ClientLogos';
import { Capabilities } from '@/components/home/Capabilities';
import { Process } from '@/components/home/Process';
import { CtaBanner } from '@/components/home/CtaBanner';
import { buildMetadata } from '@/lib/metadata';
import { COMMERCIAL_METADATA } from '@/lib/seo-policy';
import { CORE_GUIDE_LINKS } from '@/lib/seo-policy';
import { GuideLinks } from '@/components/content/GuideLinks';
import { HomeFaq } from '@/components/home/HomeFaq';
import { homeFaqs } from '@/data/faqs';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd';
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd';

export const metadata = buildMetadata(COMMERCIAL_METADATA['/']);

// 최신 칼럼(DB) 반영 주기 — 5분 ISR (빌드 시 DB 미연결이어도 정적 글로 폴백)
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">기업 홈페이지 제작과 리뉴얼 전문 업체 websLAB</h1>
      <LocalBusinessJsonLd />
      <WebPageJsonLd
        path="/"
        name={COMMERCIAL_METADATA['/'].title}
        description={COMMERCIAL_METADATA['/'].description}
      />
      <FaqJsonLd faqs={homeFaqs} />
      <HeroStage />
      <GuideLinks title="홈페이지 제작을 준비할 때 읽어보세요" links={CORE_GUIDE_LINKS['/']} />
      <Philosophy />
      <PortfolioSection />
      <PortfolioParallax />
      <ClientLogos />
      <Capabilities />
      <Process />
      <LatestColumns />
      <HomeFaq faqs={homeFaqs} />
      <CtaBanner />
    </>
  );
}
