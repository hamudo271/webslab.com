'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
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

  // Lock background scroll while the mobile menu is open.
  // The document scroller is <html>, so lock overflow there (not <body>).
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  // Inner pages start solid; home starts transparent
  const isSolid = !isHome || scrolled;

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
              aria-label="메뉴 열기"
              className={cn(
                'flex h-10 w-10 items-center justify-center lg:hidden',
                isSolid ? 'text-text-primary' : 'text-white',
              )}
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </Container>
    </header>

      {open && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-dark text-white lg:hidden" role="dialog" aria-modal="true">
          <Container>
            <div className="flex min-h-[100dvh] flex-col pb-16">
            <div className="flex h-16 items-center justify-between md:h-20">
              <Link href="/" className="flex items-center" aria-label={brand.name}>
                <Image
                  src="/images/logo.png"
                  alt={brand.name}
                  width={2043}
                  height={424}
                  className="h-7 w-auto brightness-0 invert md:h-8"
                />
              </Link>
              <button
                type="button"
                aria-label="메뉴 닫기"
                className="flex h-10 w-10 items-center justify-center"
                onClick={() => setOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-6" aria-label="Mobile">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-3xl font-bold tracking-tightest hover:text-primary-light"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <ButtonLink href="/contact" variant="primary" size="lg" className="mt-8 w-full">
                전문 설문지 접수
              </ButtonLink>
            </nav>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
