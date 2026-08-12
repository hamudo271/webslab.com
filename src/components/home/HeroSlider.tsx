'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight } from 'lucide-react';
import { heroSlides, heroMeta } from '@/data/heroSlides';
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
                // 첫 슬라이드만 preload. 나머지를 eager로 두면 4장이 동시에 <link preload>되어
                // LCP 이미지와 대역폭·이미지 최적화 CPU를 다툼(측정 LCP 7s의 주원인).
                // fade 슬라이드는 모두 뷰포트 안이라 lazy여도 곧바로 받되, 우선순위만 뒤로 밀린다.
                loading={idx === 0 ? undefined : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'low'}
                sizes="100vw"
                className="object-cover object-[80%_50%] md:object-center"
              />
              {/* 가로 스크림. 중간 지점(via)까지가 텍스트가 놓이는 영역이라, 밝은 슬라이드에서
                  본문이 묻히지 않도록 충분히 덮는다. 우측은 투명하게 두어 목업을 살린다. */}
              <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/45 to-transparent" />
              {/* 세로 스크림. 슬라이드마다 목업 합성 이미지의 밝기가 달라 가로 스크림만으로는
                  밝은 슬라이드에서 헤드라인·하단 컨트롤이 묻힌다.
                  모바일은 텍스트가 목업 위에 그대로 겹치므로 훨씬 두껍게 덮는다. */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/65 to-dark/30 md:from-dark/40 md:via-transparent md:to-transparent" />
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

                  {/* 케이스 메타. 값은 portfolios.ts에서 끌어오므로 별도 관리 지점이 없다.
                      모바일은 히어로가 이미 빽빽해 숨기고, md 이상에서만 노출. */}
                  {heroMeta(slide.portfolioSlug).length > 0 && (
                    <dl className="mt-10 hidden gap-x-10 gap-y-4 border-t border-white/20 pt-6 md:grid md:max-w-lg md:grid-cols-3">
                      {heroMeta(slide.portfolioSlug).map((row) => (
                        <div key={row.label}>
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                            {row.label}
                          </dt>
                          <dd className="mt-1.5 text-sm font-medium text-white">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
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
