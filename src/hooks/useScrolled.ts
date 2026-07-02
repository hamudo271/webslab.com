'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether the page has scrolled past `threshold` px.
 * Re-evaluates on route change so the header resets to its top state on navigation.
 */
export function useScrolled(threshold = 8) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const last = useRef(false);

  useEffect(() => {
    function onScroll() {
      const next = window.scrollY > threshold;
      if (next !== last.current) {
        last.current = next;
        setScrolled(next);
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname, threshold]);

  return scrolled;
}
