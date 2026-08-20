'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { portfolios } from '@/data/portfolios';
import { Container } from '@/components/common/Container';

const ROTATE_MS = 6000;

/**
 * 1막 — 다크 무대.
 * 좌측은 스튜디오 선언, 우측은 실제 작업물이 원근감 있게 떠 있는 무대.
 * WebGL 없이 CSS perspective + transform만 사용한다(과거 LCP 이슈 재발 방지).
 * 첫 커버 한 장만 priority — HeroSlider 시절의 LCP 규칙을 그대로 계승.
 */

/** 무대 위 자리. 0 = 정면(주인공), 뒤로 갈수록 물러나며 흐려진다. */
const SLOTS = [
  { x: 0, y: 0, rotateY: -12, rotateX: 3, scale: 1, opacity: 1, blur: 0, z: 30 },
  { x: 64, y: 48, rotateY: -17, rotateX: 4, scale: 0.93, opacity: 0.5, blur: 2, z: 20 },
  { x: 128, y: 96, rotateY: -22, rotateX: 5, scale: 0.86, opacity: 0.25, blur: 4, z: 10 },
  // 순환에서 빠져나가는 자리 — 위로 사라진다
  { x: -48, y: -64, rotateY: -6, rotateX: 2, scale: 0.9, opacity: 0, blur: 6, z: 0 },
];

export function HeroStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const count = portfolios.length;

  // 스크롤 시차 — 무대가 텍스트보다 느리게 밀려 올라가며 깊이가 생긴다
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // 자동 순환. 모션 최소화 사용자는 자동 재생 없이 수동 컨트롤만 쓴다.
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setInterval(() => setActive((v) => (v + 1) % count), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, reduceMotion, count]);

  const current = portfolios[active];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-dark-stage text-white"
    >
      {/* 무대 조명 — 코발트 글로우 + 희미한 블루프린트 그리드 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 65% at 70% 45%, #000 30%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 65% at 70% 45%, #000 30%, transparent 100%)',
          }}
        />
        <div className="absolute right-[-10%] top-[10%] h-[620px] w-[620px] rounded-full bg-electric/25 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[10%] h-[380px] w-[380px] rounded-full bg-electric/10 blur-[120px]" />
      </div>

      {/* 큰 모니터에서 콘텐츠가 화면 절반을 못 채워 텅 비어 보이던 문제:
          ① 헤드라인을 전폭으로 빼서 96px까지 키우고 ② 무대 열을 7/12로 넓히고
          ③ 남던 하단을 실제 고객사 스트립으로 채워 첫 화면의 밀도를 올린다. */}
      {/* 높이는 뷰포트가 아니라 콘텐츠 기준으로 고정 — 세로가 긴 모니터에서
          100svh로 배경만 늘어나던 문제(사용자 피드백). 어떤 화면에서도 같은 높이. */}
      <Container className="relative z-10 pb-12 pt-28 md:pt-32">
        {/* 선언 — 전폭 */}
        <motion.div style={reduceMotion ? undefined : { y: copyY }}>
          <h2 className="text-[44px] font-extrabold leading-[1.05] tracking-[-0.045em] md:text-7xl xl:text-[96px]">
            기업 홈페이지를
            <br />
            <span className="text-electric-bright">기술</span>로 완성합니다
          </h2>
        </motion.div>

        <div className="mt-10 grid items-start gap-12 md:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          {/* 서포트 + CTA */}
          <motion.div style={reduceMotion ? undefined : { y: copyY }} className="lg:pt-2">
            <p className="max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              기획·디자인·개발·운영까지 한 팀이 직접 — 기업 홈페이지를 만드는 기술 중심 디지털
              스튜디오입니다.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-electric px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-electric-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-bright focus-visible:ring-offset-2 focus-visible:ring-offset-dark-stage"
              >
                프로젝트 문의
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-stage"
              >
                포트폴리오 보기
              </Link>
            </div>
          </motion.div>

          {/* 무대 — 작업물이 주인공. xl에서는 컨테이너 밖으로 살짝 흘려 더 크게 잡는다. */}
          <motion.div
            style={reduceMotion ? undefined : { y: stageY }}
            className="relative mx-auto w-full max-w-[640px] lg:max-w-none xl:-mr-14"
          >
            {/* 16:10 — 4:3보다 낮아 데스크톱 1000px 높이에서도 하단 스트립까지 첫 화면에 들어온다 */}
            <div className="relative aspect-[16/10]" style={{ perspective: '1400px' }}>
              {portfolios.map((p, i) => {
                const slot = SLOTS[(i - active + count) % count] ?? SLOTS[SLOTS.length - 1];
                const isFront = slot === SLOTS[0];
                return (
                  <motion.div
                    key={p.slug}
                    animate={{
                      x: slot.x,
                      y: slot.y,
                      rotateY: slot.rotateY,
                      rotateX: slot.rotateX,
                      scale: slot.scale,
                      opacity: slot.opacity,
                      filter: `blur(${slot.blur}px)`,
                    }}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT_EXPO }
                    }
                    style={{ zIndex: slot.z, transformStyle: 'preserve-3d' }}
                    className={
                      isFront
                        ? 'absolute inset-0'
                        : 'absolute inset-0 hidden lg:block'
                    }
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-dark-section shadow-[0_24px_80px_-24px_rgba(0,0,0,0.7)]">
                      <Image
                        src={p.cover}
                        alt={p.title}
                        fill
                        priority={i === 0}
                        loading={i === 0 ? undefined : 'lazy'}
                        fetchPriority={i === 0 ? 'high' : 'low'}
                        sizes="(min-width: 1024px) 44vw, 92vw"
                        className="object-cover"
                      />
                      {/* 무대 반사광 — 정면 카드에만 */}
                      {isFront && (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-electric/15"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* 활성 케이스 라벨 */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <Link
                href={`/portfolio/${current.slug}`}
                className="group min-w-0"
              >
                <p className="truncate text-sm font-semibold text-white group-hover:text-electric-bright">
                  {current.title}
                </p>
                <p className="mt-0.5 text-xs text-white/50">
                  {current.client} · {current.year}
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  aria-label="이전 케이스"
                  onClick={() => setActive((v) => (v - 1 + count) % count)}
                  className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label={paused ? '자동 재생' : '일시정지'}
                  onClick={() => setPaused((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {paused ? <Play size={14} /> : <Pause size={14} />}
                </button>
                <button
                  type="button"
                  aria-label="다음 케이스"
                  onClick={() => setActive((v) => (v + 1) % count)}
                  className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* 카운터 + 진행선 */}
            <div className="mt-4 flex items-center gap-4">
              <span className="font-mono text-sm tabular-nums text-white/70">
                {String(active + 1).padStart(2, '0')}
                <span className="text-white/30"> / {String(count).padStart(2, '0')}</span>
              </span>
              <div className="h-px flex-1 bg-white/15">
                {!paused && !reduceMotion && (
                  <motion.div
                    key={active}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                    className="h-full origin-left bg-electric-bright"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 하단 고객사 스트립 — 남던 여백을 실제 증거로 채운다. 이름은 portfolios의 실데이터. */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 md:mt-16 md:flex-row md:items-center md:justify-between">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
            함께한 브랜드
          </p>
          <ul className="flex list-none flex-wrap gap-x-8 gap-y-2 pl-0 md:justify-end">
            {portfolios.map((p) => (
              <li key={p.slug} className="text-sm font-medium text-white/60">
                {p.client}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
