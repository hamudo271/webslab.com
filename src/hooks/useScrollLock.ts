'use client';

import { useEffect } from 'react';

/**
 * Locks background scroll while `locked` is true, restoring the previous value on release.
 * Targets <html> (document.documentElement) because that is the document scroller —
 * locking <body> does not stop the page from scrolling.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
    };
  }, [locked]);
}
