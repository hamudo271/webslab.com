'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { trackWhitepaperDownload } from '@/lib/analytics-events';
import {
  brochureSchema,
  BROCHURE_FILE,
  BROCHURE_FILENAME,
  type BrochureInput,
} from '@/lib/validators/brochure';

type Status = 'idle' | 'submitting' | 'done';

/**
 * 회사소개서를 받아가는 대신 연락처를 남기는 폼.
 * 아직 문의할 준비가 안 된 방문자를 잡는 게 목적이라 필드는 최소로 두고,
 * 알림 메일이 실패해도 다운로드는 그대로 진행시킨다(사용자를 볼모로 잡지 않는다).
 */
export function BrochureForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrochureInput>({
    resolver: zodResolver(brochureSchema),
    defaultValues: { privacyConsent: false as unknown as true },
  });

  function startDownload() {
    const a = document.createElement('a');
    a.href = BROCHURE_FILE;
    a.download = BROCHURE_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function onSubmit(values: BrochureInput) {
    setStatus('submitting');
    try {
      await fetch('/api/brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
    } catch (e) {
      // 알림 실패가 다운로드를 막지 않는다
      console.error('[brochure]', e);
    }
    trackWhitepaperDownload({ slug: 'company-brochure' });
    startDownload();
    setStatus('done');
  }

  if (status === 'done') {
    return (
      <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-5 text-left">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
        <div>
          <p className="font-bold text-text-primary">다운로드가 시작되었습니다</p>
          <p className="mt-1 text-sm text-text-secondary">
            받지 못하셨다면{' '}
            <a href={BROCHURE_FILE} download={BROCHURE_FILENAME} className="text-primary underline">
              여기를 눌러
            </a>{' '}
            다시 받으실 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-left" noValidate>
      {/* 허니팟 — 사람에게는 보이지 않는다 */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register('website')}
      />

      <div className={cn('grid gap-3', !compact && 'sm:grid-cols-2')}>
        <div>
          <input
            type="text"
            placeholder="성함 *"
            aria-label="성함"
            className={inputCls}
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="회사명"
            aria-label="회사명"
            className={inputCls}
            {...register('company')}
          />
        </div>
      </div>

      <div>
        <input
          type="email"
          placeholder="이메일 *"
          aria-label="이메일"
          className={inputCls}
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
          {...register('privacyConsent')}
        />
        <span className="text-xs leading-relaxed text-text-secondary">
          <span className="font-semibold text-primary">[필수]</span> 소개서 발송 및 상담 목적의
          개인정보 수집·이용에 동의합니다.{' '}
          <a
            href="/privacy-policy"
            target="_blank"
            className="underline"
            onClick={(e) => e.stopPropagation()}
          >
            자세히 보기
          </a>
        </span>
      </label>
      {errors.privacyConsent && (
        <p className="text-xs text-red-600">{errors.privacyConsent.message}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-dark py-3.5 text-sm font-bold text-white transition-colors hover:bg-dark/85 disabled:opacity-60"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={16} className="animate-spin" /> 준비 중…
          </>
        ) : (
          <>
            <Download size={16} /> 회사소개서 받기
          </>
        )}
      </button>
    </form>
  );
}
