'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Users } from 'lucide-react';

const DISMISS_KEY = 'webslab_floatbar_dismissed';
const MONTHLY_CAP = 6;

function projectsBooked(): number {
  // Deterministic synthetic counter that ramps from 1 → MONTHLY_CAP over the month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const booked = Math.ceil((dayOfMonth / daysInMonth) * MONTHLY_CAP);
  return Math.min(MONTHLY_CAP - 1, Math.max(1, booked));
}

function viewersNow(): number {
  // Pseudo-live viewer count: stable for a 5-min window so it doesn't jitter on each render
  const now = new Date();
  const bucket = Math.floor(now.getTime() / (5 * 60_000));
  // Deterministic but varied: 2-9 viewers
  const seed = (bucket * 2654435761) % 8;
  return 2 + Math.abs(seed);
}

export function FloatingBar() {
  const [visible, setVisible] = useState(false);
  const [booked, setBooked] = useState<number>(2);
  const [viewers, setViewers] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
    if (!dismissed) setVisible(true);
    setBooked(projectsBooked());
    setViewers(viewersNow());
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:left-auto md:right-6 md:max-w-xl md:pb-6 md:pr-0">
        <div className="flex items-center gap-2 rounded-2xl bg-primary px-3 py-2.5 text-white shadow-2xl md:gap-4 md:px-6 md:py-4">
          <div className="flex-1 text-xs leading-tight md:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                <span className="font-bold">{booked}</span>건
                <span className="hidden opacity-80 sm:inline"> ({booked}/{MONTHLY_CAP}건)</span>
              </span>
              <span className="hidden text-white/40 md:inline">·</span>
              <span className="hidden items-center gap-1 text-white/80 md:inline-flex">
                <Users size={12} strokeWidth={2} />
                <span className="tabular-nums">{viewers}</span>명이 함께 보고 있습니다
              </span>
            </div>
            <span className="block text-[10px] text-white/70 sm:hidden">
              이번 달 {MONTHLY_CAP}건 한정
            </span>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-white/90 md:px-5 md:py-2 md:text-sm"
          >
            1:1 맞춤 상담 예약
            <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            aria-label="닫기"
            onClick={dismiss}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/70 hover:text-white md:h-8 md:w-8"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      {/* Spacer so page content can scroll past the bar on mobile */}
      <div className="h-24 md:hidden" aria-hidden="true" />
    </>
  );
}
