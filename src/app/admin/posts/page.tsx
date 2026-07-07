'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { AdminShell } from '@/components/admin/AdminShell';

type PostRow = {
  id: number;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  category: string;
  publishedAt: string | null;
  updatedAt: string;
  viewCount: number;
};

function formatDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function AdminPostsPage() {
  const [items, setItems] = useState<PostRow[] | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/posts', { cache: 'no-store' });
      const data = (await res.json()) as { items?: PostRow[]; error?: string };
      if (!res.ok) throw new Error(data.error);
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : '목록을 불러오지 못했습니다.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStatus(post: PostRow) {
    setBusyId(post.id);
    try {
      // 전체 필드가 필요하므로 단건 조회 후 상태만 바꿔 저장
      const one = await fetch(`/api/admin/posts/${post.id}`, { cache: 'no-store' });
      const { post: full, error: getErr } = (await one.json()) as {
        post?: Record<string, unknown>;
        error?: string;
      };
      if (!one.ok || !full) throw new Error(getErr);

      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: full.title,
          slug: full.slug,
          content: full.content,
          excerpt: full.excerpt ?? '',
          thumbnailUrl: full.thumbnailUrl ?? '',
          category: full.category,
          status: post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error);
      await load();
    } catch (err) {
      alert(err instanceof Error && err.message ? err.message : '상태 변경에 실패했습니다.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(post: PostRow) {
    if (!confirm(`"${post.title}" 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setBusyId(post.id);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error);
      await load();
    } catch (err) {
      alert(err instanceof Error && err.message ? err.message : '삭제에 실패했습니다.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tightest">글 목록</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90"
        >
          새 글 쓰기
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {items === null ? (
        <div className="flex items-center gap-2 py-16 text-text-muted">
          <Loader2 size={16} className="animate-spin" /> 불러오는 중…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 bg-white py-16 text-center text-sm text-text-muted">
          아직 작성한 글이 없습니다. 첫 글을 작성해 보세요.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3 font-semibold">제목</th>
                <th className="px-4 py-3 font-semibold">카테고리</th>
                <th className="px-4 py-3 font-semibold">상태</th>
                <th className="px-4 py-3 font-semibold">발행일</th>
                <th className="px-4 py-3 text-right font-semibold">조회수</th>
                <th className="px-4 py-3 text-right font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {items.map((post) => (
                <tr key={post.id} className="border-b border-black/5 last:border-0">
                  <td className="max-w-xs px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="line-clamp-1 font-medium text-text-primary hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <span className="mt-0.5 block truncate font-mono text-xs text-text-muted">
                      /column/{post.slug}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{post.category}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() => toggleStatus(post)}
                      title="클릭하여 발행/임시저장 전환"
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-bold transition-colors disabled:opacity-50',
                        post.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200',
                      )}
                    >
                      {post.status === 'PUBLISHED' ? '발행됨' : '임시저장'}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                    {post.viewCount.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-black/5"
                      title="수정"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() => remove(post)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="삭제"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
