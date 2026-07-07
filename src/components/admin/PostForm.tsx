'use client';

import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { POST_CATEGORIES, DEFAULT_POST_CATEGORY } from '@/data/postCategories';
import { AdminShell } from '@/components/admin/AdminShell';
import { Editor } from '@/components/admin/Editor';

const AUTOSAVE_MS = 5 * 60 * 1000; // 5분 자동 임시저장

type Status = 'DRAFT' | 'PUBLISHED';

type PostFormProps = {
  postId?: number; // 없으면 새 글
};

async function uploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? '이미지 업로드에 실패했습니다.');
  return { url: data.url };
}

export function PostForm({ postId: initialPostId }: PostFormProps) {
  const router = useRouter();
  const [postId, setPostId] = useState<number | undefined>(initialPostId);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>(DEFAULT_POST_CATEGORY);
  const [excerpt, setExcerpt] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>('DRAFT');
  const [loaded, setLoaded] = useState(!initialPostId);
  const [saving, setSaving] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');
  const dirtyRef = useRef(false);

  // 수정 모드: 기존 글 로드 후 에디터 마운트
  useEffect(() => {
    if (!initialPostId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/posts/${initialPostId}`, { cache: 'no-store' });
        const data = (await res.json()) as { post?: Record<string, unknown>; error?: string };
        if (!res.ok || !data.post) throw new Error(data.error);
        if (cancelled) return;
        const p = data.post;
        setTitle(String(p.title ?? ''));
        setSlug(String(p.slug ?? ''));
        setCategory(String(p.category ?? DEFAULT_POST_CATEGORY));
        setExcerpt(String(p.excerpt ?? ''));
        setThumbnailUrl(String(p.thumbnailUrl ?? ''));
        setContent(String(p.content ?? ''));
        setStatus(p.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT');
        setLoaded(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error && err.message ? err.message : '글을 불러오지 못했습니다.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialPostId]);

  // 최신 상태 스냅샷 (자동저장 인터벌이 참조)
  const snap = useRef({ postId, title, slug, category, excerpt, thumbnailUrl, content, status, loaded, saving });
  snap.current = { postId, title, slug, category, excerpt, thumbnailUrl, content, status, loaded, saving };

  const mark = <T,>(setter: (v: T) => void) => (v: T) => {
    dirtyRef.current = true;
    setFlash('');
    setter(v);
  };

  async function persist({ nextStatus, isAuto = false }: { nextStatus: Status; isAuto?: boolean }) {
    const s = snap.current;
    if (!s.title.trim()) {
      if (!isAuto) setError('제목을 입력해 주세요.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: s.title,
        slug: s.slug,
        content: s.content,
        excerpt: s.excerpt,
        thumbnailUrl: s.thumbnailUrl,
        category: s.category,
        status: nextStatus,
      };
      const res = await fetch(s.postId ? `/api/admin/posts/${s.postId}` : '/api/admin/posts', {
        method: s.postId ? 'PUT' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        post?: { id: number; slug: string; status: Status };
        error?: string;
      };
      if (!res.ok || !data.post) throw new Error(data.error);

      dirtyRef.current = false;
      setStatus(data.post.status);
      setSlug(data.post.slug);
      const now = new Date();
      const hh = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setFlash(
        isAuto
          ? `자동 저장됨 (${hh})`
          : data.post.status === 'PUBLISHED'
            ? '발행되었습니다.'
            : '임시저장되었습니다.',
      );

      if (!s.postId) {
        setPostId(data.post.id);
        router.replace(`/admin/posts/${data.post.id}/edit`);
      }
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : '저장에 실패했습니다.';
      if (isAuto) setFlash(`자동 저장 실패: ${msg}`);
      else setError(msg);
    } finally {
      setSaving(false);
    }
  }

  // 자동 임시저장 (5분) — dirty 이고 제목이 있을 때만, 현재 상태 유지
  useEffect(() => {
    const t = setInterval(() => {
      const s = snap.current;
      if (!s.loaded || s.saving || !dirtyRef.current || !s.title.trim()) return;
      persist({ nextStatus: s.status, isAuto: true });
    }, AUTOSAVE_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onThumb = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setThumbUploading(true);
      const { url } = await uploadImage(file);
      mark(setThumbnailUrl)(url);
    } catch (err) {
      alert(err instanceof Error && err.message ? err.message : '썸네일 업로드에 실패했습니다.');
    } finally {
      setThumbUploading(false);
    }
  };

  if (!loaded) {
    return (
      <AdminShell>
        <div className="flex items-center gap-2 py-16 text-text-muted">
          <Loader2 size={16} className="animate-spin" /> 불러오는 중…
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tightest">
          {postId ? '글 수정' : '새 글 쓰기'}
        </h1>
        <div className="flex items-center gap-3">
          {flash && <span className="text-sm text-text-muted">{flash}</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            type="button"
            disabled={saving}
            onClick={() => persist({ nextStatus: 'DRAFT' })}
            className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-light disabled:opacity-50"
          >
            임시저장
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => persist({ nextStatus: 'PUBLISHED' })}
            className={cn(
              'rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50',
            )}
          >
            {saving ? '저장 중…' : status === 'PUBLISHED' ? '수정 발행' : '발행하기'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* 본문 영역 */}
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => mark(setTitle)(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full rounded-xl border border-black/15 bg-white px-5 py-3.5 text-lg font-bold tracking-tightest outline-none focus:border-primary"
          />
          <Editor initialContent={content} onChange={mark(setContent)} uploadImage={uploadImage} />
        </div>

        {/* 사이드 설정 */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
              상태
            </label>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-bold',
                status === 'PUBLISHED'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700',
              )}
            >
              {status === 'PUBLISHED' ? '발행됨' : '임시저장'}
            </span>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
              카테고리
            </label>
            <select
              value={category}
              onChange={(e) => mark(setCategory)(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {POST_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
              썸네일
            </label>
            {thumbnailUrl ? (
              <div className="relative mb-2 aspect-[120/63] overflow-hidden rounded-lg bg-surface-light">
                <NextImage src={thumbnailUrl} alt="썸네일 미리보기" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <p className="mb-2 text-xs text-text-muted">미설정 시 목록에서 기본 배경이 보입니다.</p>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-black/15 px-3 py-2 text-sm text-text-secondary hover:bg-surface-light">
              {thumbUploading ? <Loader2 size={14} className="animate-spin" /> : null}
              {thumbUploading ? '업로드 중…' : thumbnailUrl ? '썸네일 변경' : '썸네일 업로드'}
              <input type="file" accept="image/*" className="hidden" onChange={onThumb} disabled={thumbUploading} />
            </label>
            {thumbnailUrl && (
              <button
                type="button"
                onClick={() => mark(setThumbnailUrl)('')}
                className="ml-2 text-xs text-text-muted underline hover:text-red-600"
              >
                제거
              </button>
            )}
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
              요약 (excerpt)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => mark(setExcerpt)(e.target.value)}
              rows={3}
              placeholder="목록·검색결과에 노출됩니다. 비우면 본문에서 자동 추출."
              className="w-full resize-none rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
              슬러그 (URL)
            </label>
            <input
              value={slug}
              onChange={(e) => mark(setSlug)(e.target.value)}
              placeholder="비우면 제목에서 자동 생성"
              className="w-full rounded-lg border border-black/15 px-3 py-2 font-mono text-sm outline-none focus:border-primary"
            />
            <p className="mt-1.5 break-all text-xs text-text-muted">/column/{slug || '(자동)'}</p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
