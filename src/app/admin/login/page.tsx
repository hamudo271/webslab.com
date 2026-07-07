'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/cn';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? '로그인에 실패했습니다.');
        return;
      }
      router.replace('/admin/posts');
      router.refresh();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold tracking-tightest text-text-primary">websLAB 관리자</h1>
        <p className="mt-1 text-sm text-text-muted">비밀번호를 입력해 주세요.</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoFocus
          className="mt-6 w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className={cn(
            'mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-colors',
            'hover:bg-primary/90 disabled:opacity-50',
          )}
        >
          {loading ? '확인 중…' : '로그인'}
        </button>
      </form>
    </div>
  );
}
