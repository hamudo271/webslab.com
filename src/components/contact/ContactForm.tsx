'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { trackContactFormSubmit } from '@/lib/analytics-events';
import {
  contactSchema,
  CATEGORY_LABELS,
  BUDGET_LABELS,
  type ContactInput,
} from '@/lib/validators/contact';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: 'NEW_BUILD',
      privacyConsent: false as unknown as true,
    },
  });

  async function onSubmit(values: ContactInput) {
    setStatus('submitting');
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setServerError(data.error ?? '메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        setStatus('error');
        return;
      }
      trackContactFormSubmit({ category: values.category });
      reset();
      setStatus('success');
    } catch (e) {
      console.error(e);
      setServerError('네트워크 오류가 발생했습니다.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-md border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-primary" />
        <h2 className="mt-4 text-2xl font-bold tracking-tightest">문의가 정상적으로 접수되었습니다</h2>
        <p className="mt-3 text-text-secondary">
          영업일 기준 1-2일 내에 담당자가 연락 드리겠습니다.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-medium text-primary hover:underline"
        >
          다시 작성하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          website
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="이름 *" error={errors.name?.message}>
          <input
            type="text"
            {...register('name')}
            className={inputStyles(!!errors.name)}
            placeholder="홍길동"
          />
        </Field>
        <Field label="회사명" error={errors.company?.message}>
          <input
            type="text"
            {...register('company')}
            className={inputStyles(!!errors.company)}
            placeholder="(주)예시 컴퍼니"
          />
        </Field>
        <Field label="이메일 *" error={errors.email?.message}>
          <input
            type="email"
            {...register('email')}
            className={inputStyles(!!errors.email)}
            placeholder="you@company.com"
          />
        </Field>
        <Field label="연락처" error={errors.phone?.message}>
          <input
            type="tel"
            {...register('phone')}
            className={inputStyles(!!errors.phone)}
            placeholder="010-0000-0000"
          />
        </Field>
        <Field label="문의 유형 *" error={errors.category?.message}>
          <select {...register('category')} className={inputStyles(!!errors.category)}>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="예산" error={errors.budget?.message}>
          <select {...register('budget')} className={inputStyles(!!errors.budget)} defaultValue="">
            <option value="">선택 안 함</option>
            {Object.entries(BUDGET_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="문의 내용 *" error={errors.message?.message}>
        <textarea
          {...register('message')}
          rows={6}
          className={inputStyles(!!errors.message)}
          placeholder="프로젝트 목적, 일정, 참고 사이트 등을 자유롭게 작성해 주세요."
        />
      </Field>

      <div className="flex items-start gap-3 border-t border-line pt-6">
        <input
          id="privacy"
          type="checkbox"
          {...register('privacyConsent')}
          className="mt-1 h-4 w-4 accent-primary"
        />
        <label htmlFor="privacy" className="text-sm text-text-secondary">
          <a href="/privacy-policy" className="underline" target="_blank">
            개인정보 처리방침
          </a>
          을 확인하였고, 문의 응대를 위한 정보 수집·이용에 동의합니다.
        </label>
      </div>
      {errors.privacyConsent && (
        <p className="text-sm text-red-600">{errors.privacyConsent.message}</p>
      )}

      {serverError && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center bg-primary px-8 py-4 text-base font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {status === 'submitting' ? '전송 중...' : '문의 보내기'}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-primary">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function inputStyles(hasError: boolean): string {
  return cn(
    'w-full border bg-white px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30',
    hasError ? 'border-red-300' : 'border-line focus:border-primary',
  );
}
