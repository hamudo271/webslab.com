'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { brand } from '@/config/brand';
import { mainNav } from '@/data/navItems';
import { Container } from '@/components/common/Container';
import { ButtonLink } from '@/components/common/Button';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastScrollState = useRef(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      const next = window.scrollY > 8;
      if (next !== lastScrollState.current) {
        lastScrollState.current = next;
        setScrolled(next);
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  // Lock background scroll while the menu is open.
  // The document scroller is <html>, so lock overflow there (not <body>).
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Inner pages start solid; home starts transparent.
  // While the fullscreen menu is open the header floats over the dark
  // overlay, so it goes transparent with white items regardless of scroll.
  const isSolid = (!isHome || scrolled) && !open;

  return (
    <>
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isSolid ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="flex items-center" aria-label={brand.name}>
            <Image
              src="/images/logo.png"
              alt={brand.name}
              width={2043}
              height={424}
              priority
              className={cn(
                'h-7 w-auto transition-[filter] duration-300 md:h-8',
                isSolid ? '' : 'brightness-0 invert',
              )}
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isSolid ? 'text-text-primary' : 'text-white',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink
              href="/contact"
              variant={isSolid ? 'primary' : 'white'}
              size="sm"
              className="hidden md:inline-flex"
            >
              전문 설문지 접수
            </ButtonLink>
            <button
              type="button"
              aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={open}
              className={cn(
                'flex h-10 w-10 items-center justify-center',
                isSolid ? 'text-text-primary' : 'text-white',
              )}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-4 w-6" aria-hidden="true">
                <span
                  className={cn(
                    'absolute left-0 top-0 h-0.5 w-6 bg-current transition-all duration-300',
                    open && 'top-1/2 -translate-y-1/2 rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-current transition-all duration-300',
                    open && 'w-6 opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-0.5 w-6 bg-current transition-all duration-300',
                    open && 'bottom-[calc(50%-1px)] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </Container>
    </header>

      {/* Fullscreen menu overlay — always mounted so open/close both animate.
          Sits below the header (z-50) so the morphing hamburger stays visible. */}
      <div
        className={cn(
          'fixed inset-0 z-[45] overflow-y-auto bg-dark text-white transition-opacity duration-300',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <Container>
          <div className="flex min-h-[100dvh] flex-col pb-16 pt-28 md:pt-32">
            <nav className="flex flex-col gap-6" aria-label="Mobile">
              {mainNav.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  className={cn(
                    'text-3xl font-bold tracking-tightest transition-all duration-300 hover:text-primary-light',
                    open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                  )}
                  style={{ transitionDelay: open ? `${100 + i * 50}ms` : '0ms' }}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <ButtonLink
                href="/contact"
                variant="primary"
                size="lg"
                tabIndex={open ? 0 : -1}
                className={cn(
                  'mt-8 w-full transition-all duration-300 md:w-auto md:self-start md:px-16',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                )}
                style={{ transitionDelay: open ? `${100 + mainNav.length * 50}ms` : '0ms' }}
              >
                전문 설문지 접수
              </ButtonLink>
            </nav>
          </div>
        </Container>
      </div>
    </>
  );
}
