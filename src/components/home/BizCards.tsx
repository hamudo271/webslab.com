'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bizCards } from '@/data/bizCards';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';

export function BizCards() {
  return (
    <Section variant="light" spacing="default">
      <Container>
        <h2
          aria-hidden="true"
          className="pointer-events-none mb-2 select-none text-[14vw] font-bold leading-[0.85] tracking-tightest text-text-primary/[0.06] md:text-[12vw] lg:text-[180px]"
        >
          BENEFITS
        </h2>
        <div className="-mt-[10vw] flex flex-col gap-8 md:-mt-[8vw] md:flex-row md:items-end md:justify-between lg:-mt-32">
          <div className="max-w-2xl">
            <SectionEyebrow>BENEFITS</SectionEyebrow>
            <Heading as="h2" size="h1" className="mt-4">
              기업 홈페이지를 위한 모든 것
            </Heading>
            <p className="mt-6 text-text-secondary md:text-lg">
              기획부터 오픈 후 운영까지, 웹슬랩이 제공하는 혜택을 확인하세요.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="이전"
              className="biz-prev flex h-12 w-12 items-center justify-center border border-line text-text-primary transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="다음"
              className="biz-next flex h-12 w-12 items-center justify-center border border-line text-text-primary transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-12">
          <Swiper
            modules={[Navigation]}
            navigation={{ nextEl: '.biz-next', prevEl: '.biz-prev' }}
            spaceBetween={24}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
            }}
          >
            {bizCards.map((card) => (
              <SwiperSlide key={card.no}>
                <article className="flex h-full flex-col gap-6 border border-line bg-white p-8 transition-colors hover:border-primary">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-widest text-primary">
                      {card.no}
                    </span>
                    <card.icon size={28} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tightest text-text-primary">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {card.description}
                    </p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </Section>
  );
}
