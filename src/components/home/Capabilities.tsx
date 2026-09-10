import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { bizCards } from '@/data/bizCards';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { Reveal } from '@/components/common/Reveal';

/**
 * WhatWeDo(서비스 2카드) + BizCards(혜택 11카드 스와이퍼)를 통합한 편집형 섹션.
 * 카드 나열 대신 헤어라인 행으로 밀도를 낮추고, 항목은 11개 → 6개로 다이어트.
 * 기존 WhatWeDo의 "지난 100건 이상" 문구는 미검증 수치라 승계하지 않는다.
 */

const services = [
  {
    when: '사이트가 없거나, 지금 사이트로는 회사를 설명할 수 없을 때',
    title: '홈페이지 신규 제작',
    description:
      '회사 소개·서비스·문의까지 처음부터 설계합니다. 원고와 사진이 준비돼 있지 않아도 질문지로 함께 정리합니다.',
    href: '/service',
  },
  {
    when: '사이트는 있는데 몇 년째 손대지 못했을 때',
    title: '홈페이지 리뉴얼',
    description:
      '쌓아둔 콘텐츠와 검색 주소는 그대로 옮기고, 구조와 디자인만 새로 짭니다. 옛 URL은 301로 연결합니다.',
    href: '/service',
  },
  {
    when: '오픈은 했는데 이후 관리가 막막할 때',
    title: '유지보수·운영',
    description:
      '정기 점검·보안 패치·콘텐츠 수정·성능 개선까지, 오픈 이후를 월 단위로 함께 운영합니다.',
    href: '/service',
  },
];

/** bizCards 11개 중 계약 결정에 실제로 작용하는 6개만 노출 */
const CAPABILITY_NOS = ['04', '05', '06', '07', '08', '10'];
const capabilities = bizCards.filter((c) => CAPABILITY_NOS.includes(c.no));

export function Capabilities() {
  return (
    <Section variant="light" spacing="default">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Heading as="h2" size="h1">
                지금 어떤
                <br />
                상황이신가요
              </Heading>
              <p className="mt-6 max-w-sm leading-relaxed text-text-secondary">
                신규와 리뉴얼 중 무엇이 맞는지부터 정리해 드립니다. 지금 상황에 가까운 쪽을
                눌러보세요.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            {/* 서비스 3종 — 큰 행 */}
            <ul className="list-none border-t border-line pl-0">
              {services.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 0.06} className="list-none border-b border-line">
                  <Link
                    href={s.href}
                    className="group flex items-baseline justify-between gap-6 py-8 md:py-10"
                  >
                    <div>
                      <p className="text-xs font-semibold text-electric md:text-[13px]">{s.when}</p>
                      <Heading
                        as="h3"
                        size="h3"
                        className="mt-2 transition-colors group-hover:text-primary"
                      >
                        {s.title}
                      </Heading>
                      <p className="mt-2.5 text-sm leading-relaxed text-text-secondary md:text-base">
                        {s.description}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={26}
                      className="shrink-0 translate-y-1 text-text-muted transition-all group-hover:-translate-y-0 group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </Link>
                </Reveal>
              ))}
            </ul>

            {/* 기본 포함 사항 6개 — 조용한 2열 정의 행 */}
            <p className="mt-14 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
              모든 프로젝트 기본 포함
            </p>
            <dl className="mt-5 grid gap-x-10 md:grid-cols-2">
              {capabilities.map((c, i) => (
                <Reveal key={c.no} delay={i * 0.04} className="border-b border-line py-5">
                  <dt className="font-bold text-text-primary">{c.title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                    {c.description}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
