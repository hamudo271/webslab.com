'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { trackContactFormSubmit } from '@/lib/analytics-events';
import { contactSchema, type ContactInput } from '@/lib/validators/contact';
import { CATEGORY_OPTIONS, BUDGET_OPTIONS } from '@/data/contact';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: 'NEW_BUILD',
      privacyConsent: false as unknown as true,
    },
  });

  const category = watch('category');
  const budget = watch('budget');

  // Capture the phone field registration so we can auto-format while keeping RHF in sync.
  const phoneField = register('phone');

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
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-10 text-center">
        <CheckCircle2 size={36} className="mx-auto text-primary" />
        <h2 className="mt-4 text-2xl font-bold tracking-tightest">문의가 정상적으로 접수되었습니다</h2>
        <p className="mt-3 text-text-secondary">1영업일 내에 담당자가 회신 드리겠습니다.</p>
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          website
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      {/* 프로젝트 유형 — 버튼 선택 */}
      <Field label="프로젝트 유형" required error={errors.category?.message}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={category === opt.value}
              onClick={() => setValue('category', opt.value, { shouldValidate: true })}
              className={choiceStyles(category === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="회사명" error={errors.company?.message}>
          <input
            type="text"
            {...register('company')}
            className={inputStyles(!!errors.company)}
            placeholder="회사 또는 단체명을 입력해 주세요"
          />
        </Field>
        <Field label="담당자 성함 / 직책" required error={errors.name?.message}>
          <input
            type="text"
            {...register('name')}
            className={inputStyles(!!errors.name)}
            placeholder="예: 홍길동 / 마케팅팀장"
          />
        </Field>
        <Field label="연락처" error={errors.phone?.message}>
          <input
            type="tel"
            inputMode="numeric"
            {...phoneField}
            onChange={(e) => {
              // Auto-hyphenate as the user types: 01012345678 -> 010-1234-5678
              const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
              let formatted = digits;
              if (digits.length > 7) {
                formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
              } else if (digits.length > 3) {
                formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
              }
              e.target.value = formatted;
              phoneField.onChange(e);
            }}
            className={inputStyles(!!errors.phone)}
            placeholder="010-0000-0000"
          />
        </Field>
        <Field label="이메일" required error={errors.email?.message}>
          <input
            type="email"
            {...register('email')}
            className={inputStyles(!!errors.email)}
            placeholder="example@company.com"
          />
        </Field>
      </div>

      <Field label="문의 내용" required error={errors.message?.message}>
        <textarea
          {...register('message')}
          rows={6}
          className={inputStyles(!!errors.message)}
          placeholder={'기존 사이트 URL(보유 시) : \n참고 사이트 URL : \n문의 내용 : '}
        />
      </Field>

      {/* 예산 — 버튼 선택(선택 사항, 재클릭 시 해제) */}
      <Field label="예산" error={errors.budget?.message}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={budget === opt.value}
              onClick={() =>
                setValue('budget', budget === opt.value ? undefined : opt.value, {
                  shouldValidate: true,
                })
              }
              className={choiceStyles(budget === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      {/* 개인정보 동의 */}
      <label
        htmlFor="privacy"
        className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-surface-light px-5 py-4"
      >
        <input
          id="privacy"
          type="checkbox"
          {...register('privacyConsent')}
          className="h-4 w-4 shrink-0 accent-primary"
        />
        <span className="text-sm text-text-secondary">
          <span className="font-semibold text-primary">[필수]</span> 개인정보 수집·이용에
          동의합니다.{' '}
          <a
            href="/privacy-policy"
            className="underline"
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            자세히 보기
          </a>
        </span>
      </label>
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
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-lg font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' && <Loader2 size={20} className="animate-spin" />}
        {status === 'submitting' ? '전송 중...' : '문의하기'}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2.5 block text-[15px] font-bold text-text-primary">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function inputStyles(hasError: boolean): string {
  return cn(
    'w-full rounded-lg border bg-white px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30',
    hasError ? 'border-red-300' : 'border-line focus:border-primary',
  );
}

function choiceStyles(selected: boolean): string {
  return cn(
    'rounded-lg border px-3 py-3 text-sm font-semibold transition-colors',
    selected
      ? 'border-primary bg-primary text-white'
      : 'border-line bg-white text-text-secondary hover:border-primary/50 hover:text-text-primary',
  );
}
