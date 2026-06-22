import { HeroSlider } from '@/components/home/HeroSlider';
import { PortfolioSection } from '@/components/home/Portfolio';
import { ClientLogos } from '@/components/home/ClientLogos';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { Process } from '@/components/home/Process';
import { BizCards } from '@/components/home/BizCards';
import { CtaBanner } from '@/components/home/CtaBanner';
import { buildMetadata } from '@/lib/metadata';
import { COMMERCIAL_METADATA } from '@/lib/seo-policy';
import { CORE_GUIDE_LINKS } from '@/lib/seo-policy';
import { GuideLinks } from '@/components/content/GuideLinks';

export const metadata = buildMetadata(COMMERCIAL_METADATA['/']);

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">기업 홈페이지 제작과 리뉴얼 전문 업체 websLAB</h1>
      <HeroSlider />
      <GuideLinks title="홈페이지 제작을 준비할 때 읽어보세요" links={CORE_GUIDE_LINKS['/']} />
      <PortfolioSection />
      <ClientLogos />
      <WhatWeDo />
      <Process />
      <BizCards />
      <CtaBanner />
    </>
  );
}
