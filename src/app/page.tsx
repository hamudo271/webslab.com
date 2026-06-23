import { HeroSlider } from '@/components/home/HeroSlider';
import { PortfolioSection } from '@/components/home/Portfolio';
import { PortfolioParallax } from '@/components/home/PortfolioParallax';
import { Philosophy } from '@/components/home/Philosophy';
import { ClientLogos } from '@/components/home/ClientLogos';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { Process } from '@/components/home/Process';
import { BizCards } from '@/components/home/BizCards';
import { CtaBanner } from '@/components/home/CtaBanner';
import { buildMetadata } from '@/lib/metadata';
import { COMMERCIAL_METADATA } from '@/lib/seo-policy';
import { CORE_GUIDE_LINKS } from '@/lib/seo-policy';
import { GuideLinks } from '@/components/content/GuideLinks';
import { HomeFaq } from '@/components/home/HomeFaq';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd';

export const metadata = buildMetadata(COMMERCIAL_METADATA['/']);

const homeFaqs = [
  {
    question: '기업 홈페이지 제작 비용은 보통 얼마인가요?',
    answer:
      '페이지 수보다 기획 범위, 콘텐츠 준비도, CMS, 외부 연동, 데이터 이전에 따라 결정됩니다. 같은 기준으로 견적을 비교할 수 있도록 필요한 범위부터 정리해 드립니다.',
  },
  {
    question: '제작 기간은 얼마나 걸리나요?',
    answer:
      '규모와 콘텐츠 준비 상황에 따라 다르지만, 표준 기업 사이트는 보통 6~10주가 소요됩니다. 문의·기획·디자인·개발·검수·오픈 단계로 진행합니다.',
  },
  {
    question: '신규 제작과 리뉴얼 중 무엇을 선택해야 하나요?',
    answer:
      '정보 구조와 기술 스택을 70% 이상 보존할 수 있으면 리뉴얼, 그 이하면 신규 제작이 적합합니다. 현재 사이트를 진단해 방향을 제안합니다.',
  },
  {
    question: '사내 개발팀이 없어도 운영할 수 있나요?',
    answer:
      '네. 마케팅·기획 담당자가 직접 콘텐츠를 수정·관리할 수 있도록 권한별 CMS와 관리자 페이지를 함께 구축합니다.',
  },
  {
    question: '리뉴얼하면 기존 검색 순위(SEO)는 유지되나요?',
    answer:
      'URL 인벤토리 추출 → 301 매핑 → canonical·사이트맵 점검 → 오픈 후 30일 모니터링을 표준 절차로 진행해 검색 유입 손실을 방지합니다.',
  },
];

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">기업 홈페이지 제작과 리뉴얼 전문 업체 websLAB</h1>
      <LocalBusinessJsonLd />
      <FaqJsonLd faqs={homeFaqs} />
      <HeroSlider />
      <GuideLinks title="홈페이지 제작을 준비할 때 읽어보세요" links={CORE_GUIDE_LINKS['/']} />
      <Philosophy />
      <PortfolioSection />
      <PortfolioParallax />
      <ClientLogos />
      <WhatWeDo />
      <Process />
      <BizCards />
      <HomeFaq faqs={homeFaqs} />
      <CtaBanner />
    </>
  );
}
