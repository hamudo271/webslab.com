import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { Badge } from '@/components/common/Badge';

export function WhatWeDo() {
  return (
    <Section variant="dark" spacing="default">
      <Container>
        <div className="max-w-3xl">
          <SectionEyebrow variant="dark">WHAT WE DO</SectionEyebrow>
          <Heading as="h2" size="h1" className="mt-4">
            기업 홈페이지 전문 제작업체
          </Heading>
          <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
            지난 100건 이상의 제작 사례로 귀사를 위한 컨설팅을 진행합니다.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Link
            href="/service"
            className="group relative flex flex-col justify-between gap-12 border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-primary-light/40 hover:bg-white/[0.04] md:p-12 md:min-h-[360px]"
          >
            <Badge variant="dark" size="md">NEW BUILD</Badge>
            <div>
              <p className="text-sm font-medium text-primary-light">한 팀이 처음부터 끝까지</p>
              <Heading as="h3" size="h2" className="mt-3">홈페이지 신규 제작</Heading>
              <p className="mt-6 text-base text-white/70 md:text-lg">
                기획·디자인·개발까지, 한 팀에서 직접.
              </p>
            </div>
            <ArrowUpRight
              size={32}
              className="absolute right-8 top-8 text-white/40 transition-all group-hover:right-7 group-hover:top-7 group-hover:text-primary-light"
            />
          </Link>

          <Link
            href="/service"
            className="group relative flex flex-col justify-between gap-12 border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-primary-light/40 hover:bg-white/[0.04] md:p-12 md:min-h-[360px]"
          >
            <Badge variant="dark" size="md">RENEWAL</Badge>
            <div>
              <p className="text-sm font-medium text-primary-light">쌓아온 브랜드, 그대로 살려서</p>
              <Heading as="h3" size="h2" className="mt-3">홈페이지 리뉴얼</Heading>
              <p className="mt-6 text-base text-white/70 md:text-lg">
                콘텐츠는 살리고, 구조만 새로 짭니다.
              </p>
            </div>
            <ArrowUpRight
              size={32}
              className="absolute right-8 top-8 text-white/40 transition-all group-hover:right-7 group-hover:top-7 group-hover:text-primary-light"
            />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
