'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Reuse the 18 branded column OG cards as on-brand grid tiles (no extra assets).
const COLUMN_SLUGS = [
  'corporate-website-cost',
  'website-agency-selection',
  'website-production-timeline',
  'website-quote-comparison',
  'renewal-vs-rebuild',
  'website-renewal-cost',
  'website-renewal-seo',
  'b2b-website-structure',
  'manufacturing-website-pages',
  'logistics-multilingual-website',
  'corporate-website-cms',
  'corporate-website-seo-checklist',
  'responsive-website',
  'website-maintenance',
  'hospital-website',
  'wordpress-vs-custom',
  'website-renewal-timing',
  'government-website-accessibility',
];

const tile = (slug: string) => `/images/og/column/${slug}.png`;

// 5 rows, each a rotated 7-card window so rows look varied while reusing the same files.
const ROWS = Array.from({ length: 5 }, (_, r) => {
  const start = (r * 4) % COLUMN_SLUGS.length;
  const rotated = [...COLUMN_SLUGS.slice(start), ...COLUMN_SLUGS.slice(0, start)];
  return rotated.slice(0, 7);
});

// Per-row parallax magnitude: outer rows move most, center row least (symmetric).
const ROW_SHIFT_X = [340, 320, 300, 320, 340];
const ROW_SHIFT_Y = [40, 30, 20, 30, 40];

export function PortfolioParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Pointer parallax only on fine pointers (desktop) without reduced-motion.
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;
    let running = false;

    const apply = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const dx = -(ROW_SHIFT_X[i] * current.x) - (ROW_SHIFT_Y[i] * current.y);
        row.style.transform = `translate3d(${dx.toFixed(2)}px, 0, 0)`;
      });
      if (
        Math.abs(target.x - current.x) > 0.0005 ||
        Math.abs(target.y - current.y) > 0.0005
      ) {
        raf = requestAnimationFrame(apply);
      } else {
        running = false;
      }
    };

    const ensureRunning = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(apply);
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      ensureRunning();
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      ensureRunning();
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="portfolio-parallax-title"
      className="relative h-[560px] w-full overflow-hidden bg-dark-section md:h-[680px]"
    >
      {/* Oversized grid, rotated and clipped by the section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] flex-col gap-4"
      >
        {ROWS.map((row, i) => (
          <div
            key={i}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className="will-change-transform"
          >
            {/* Inner track auto-scrolls (marquee); duplicated content makes the loop seamless */}
            <div
              className="flex w-max gap-4 animate-marquee motion-reduce:animate-none"
              style={{
                animationDuration: `${52 + i * 6}s`,
                animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
              }}
            >
              {[...row, ...row].map((slug, j) => (
                <div
                  key={`${slug}-${j}`}
                  className="h-[150px] w-[286px] shrink-0 overflow-hidden rounded-lg bg-dark md:h-[170px] md:w-[324px]"
                  style={{
                    backgroundImage: `url(${tile(slug)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Vignette overlay keeps foreground text readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,28,48,0.78),rgba(20,28,48,0.5))]"
      />

      {/* Foreground content */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-white">
        <h2
          id="portfolio-parallax-title"
          className="text-3xl font-bold tracking-tightest md:text-5xl lg:text-6xl"
        >
          websLAB이 함께 합니다.
        </h2>
        <p className="mt-5 max-w-xl text-base text-white/80 md:text-lg">
          websLAB의 전문성과 창의성을 포트폴리오에서 확인해보세요.
        </p>
        <Link
          href="/portfolio"
          className="pointer-events-auto mt-9 inline-flex items-center gap-2 rounded-full border border-white/40 px-9 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:border-white hover:bg-white hover:text-text-primary"
        >
          VIEW MORE
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
