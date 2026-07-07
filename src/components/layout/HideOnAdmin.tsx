'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// /admin 하위에서는 사이트 크롬(헤더·푸터·플로팅바)을 렌더하지 않는다
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <>{children}</>;
}
