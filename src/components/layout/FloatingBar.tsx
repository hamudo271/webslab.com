'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';

const DISMISS_KEY = 'webslab_floatbar_dismissed';

/**
 * 플로팅 독 — 글래스 필(반투명 알약) 형태.
 * 이전 다크 슬래브는 다크 섹션(히어로·클로징·푸터) 위에서 배경에 묻혔다.
 * 밝은 글래스 + 헤어라인 + 큰 그림자는 다크 위에서 또렷하고 라이트 위에서도 분리된다.
 * 문구는 리스크 리버설 오퍼 한 줄만 — 질문 문장은 정보가 없어서 제거.
 */
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
      {/* 하단 정중앙 독. 센터링 translate는 바깥 래퍼에 둔다 —
          안쪽 필의 float-in 키프레임이 transform을 덮어써 점프하는 것을 방지. */}
      <div className="fixed inset-x-3 bottom-0 z-40 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:inset-x-auto md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:pb-0">
        <div className="animate-float-in motion-reduce:animate-none flex items-center gap-3 rounded-full border border-line bg-white/85 py-2 pl-4 pr-2 text-text-primary shadow-lift backdrop-blur-md md:gap-4 md:py-2.5 md:pl-5">
          {/* 라이브 신호 — 전기 펄스 점 */}
          <span aria-hidden="true" className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric/60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-electric" />
          </span>

          {/* 좁은 화면에서는 문장이 말줄임되므로 모바일 전용 축약 카피를 쓴다(같은 약속) */}
          <p className="min-w-0 flex-1 truncate text-[13px] font-medium md:text-sm">
            <span className="md:hidden">계약 전 시안 제공</span>
            <span className="hidden md:inline">계약 전, 메인 시안을 먼저 보여드립니다</span>
          </p>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-electric px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-electric-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-bright focus-visible:ring-offset-2 md:px-5 md:text-sm"
          >
            프로젝트 문의
            <ArrowRight size={14} />
          </Link>

          <button
            type="button"
            aria-label="닫기"
            onClick={dismiss}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-light hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      {/* 모바일에서 독이 페이지 마지막 콘텐츠를 가리지 않도록 확보하는 여백 */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
