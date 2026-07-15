'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

// 관리자 공통 셸 — 상단 바(내비 + 로그아웃) + 본문 컨테이너
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const navItems = [
    { href: '/admin/posts', label: '글 목록' },
    { href: '/admin/posts/new', label: '새 글 쓰기' },
    { href: '/admin/stats', label: '통계' },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-black/10 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
          <Link href="/admin/posts" className="text-sm font-extrabold tracking-tightest">
            websLAB <span className="text-primary">관리자</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-black/5',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/column"
              target="_blank"
              className="rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-black/5"
            >
              사이트 보기 ↗
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm text-text-secondary hover:bg-black/5"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
