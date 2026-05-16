import { HeroSlider } from '@/components/home/HeroSlider';
import { PortfolioSection } from '@/components/home/Portfolio';
import { ClientLogos } from '@/components/home/ClientLogos';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { Process } from '@/components/home/Process';
import { BizCards } from '@/components/home/BizCards';
import { CtaBanner } from '@/components/home/CtaBanner';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ path: '/' });

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <PortfolioSection />
      <ClientLogos />
      <WhatWeDo />
      <Process />
      <BizCards />
      <CtaBanner />
    </>
  );
}
