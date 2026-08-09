'use client';

import { useEffect, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/common/Button';

const DISMISS_KEY = 'webslab_floatbar_dismissed';

export function FloatingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === 'true') return;
    setVisible(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:inset-x-auto md:bottom-6 md:right-6 md:px-0 md:pb-0">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-dark/95 px-4 py-3 text-white shadow-2xl backdrop-blur-sm md:gap-6 md:py-4 md:pl-6 md:pr-4">
          <p className="flex-1 text-xs leading-snug md:text-sm">
            <span className="font-semibold">프로젝트를 구상 중이신가요?</span>
            {/* 좁은 화면에서는 바가 두 줄로 두꺼워져 콘텐츠를 과하게 가린다 */}
            <span className="mt-0.5 hidden text-white/60 sm:block">
              기획 방향부터 함께 정리해드립니다.
            </span>
          </p>
          <ButtonLink
            href="/contact"
            variant="primary"
            size="sm"
            className="shrink-0 rounded-lg whitespace-nowrap"
          >
            상담 예약
            <ArrowRight size={14} />
          </ButtonLink>
          <button
            type="button"
            aria-label="닫기"
            onClick={dismiss}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      {/* 모바일에서 바가 페이지 마지막 콘텐츠를 가리지 않도록 확보하는 여백 */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
