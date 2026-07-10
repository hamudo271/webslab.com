'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight } from 'lucide-react';
import { heroSlides } from '@/data/heroSlides';
import { Container } from '@/components/common/Container';

export function HeroSlider() {
  const swiperRef = useRef<SwiperType | null>(null);
  // 진행 바는 매 프레임 갱신되므로 React 상태 대신 ref로 직접 조작(리렌더·트랜지션 경합 방지).
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);

  function togglePause() {
    if (!swiperRef.current) return;
    if (paused) {
      swiperRef.current.autoplay.start();
      setPaused(false);
    } else {
      swiperRef.current.autoplay.stop();
      setPaused(true);
    }
  }

  return (
    <section className="relative h-[88vh] min-h-[600px] max-h-[900px] w-full overflow-hidden bg-dark">
      <Swiper
        modules={[EffectFade, Autoplay, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev' }}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        onSlideChange={(s) => setActive(s.realIndex + 1)}
        onAutoplayTimeLeft={(_s, _ms, percentage) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${1 - percentage})`;
          }
        }}
        className="h-full w-full"
      >
        {heroSlides.map((slide, idx) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                // 뒷 슬라이드도 즉시 받아둬야 전환 시 배경이 늦게 뜨지 않음
                loading={idx === 0 ? undefined : 'eager'}
                sizes="100vw"
                className="object-cover object-[80%_50%] md:object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/30 to-transparent" />
              <Container className="absolute inset-0 z-10 flex items-center pb-12 md:pb-16">
                <div className="max-w-3xl text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
                    {slide.eyebrow}
                  </p>
                  <h2 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tightest md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h2>
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
                    {slide.description}
                  </p>
                  {slide.cta && (
                    <Link
                      href={slide.cta.href}
                      className="mt-8 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-primary-light hover:text-text-primary"
                    >
                      {slide.cta.label}
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Container className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-24 md:pb-12">
        <div className="pointer-events-auto flex items-end justify-between gap-6 text-white">
          <div className="flex items-baseline gap-3 font-mono text-sm">
            <span className="text-2xl font-bold tabular-nums">{String(active).padStart(2, '0')}</span>
            <span className="text-white/40">/ {String(heroSlides.length).padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="이전 슬라이드"
              className="hero-prev flex h-10 w-10 items-center justify-center border border-white/30 transition-colors hover:bg-white/10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label={paused ? '재생' : '일시정지'}
              onClick={togglePause}
              className="flex h-10 w-10 items-center justify-center border border-white/30 transition-colors hover:bg-white/10"
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              type="button"
              aria-label="다음 슬라이드"
              className="hero-next flex h-10 w-10 items-center justify-center border border-white/30 transition-colors hover:bg-white/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="mt-4 h-0.5 w-full bg-white/15">
          <div
            ref={progressRef}
            className="h-full w-full origin-left bg-primary will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </Container>
    </section>
  );
}
