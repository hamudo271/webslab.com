import type { ReactNode } from 'react';

export function LegalDoc({ children }: { children: ReactNode }) {
  return (
    <article className="prose-styled space-y-8 text-text-secondary">
      <style>{`
        .prose-styled h2 { font-size: 1.25rem; font-weight: 700; color: #191919; margin-top: 2rem; letter-spacing: -0.02em; }
        .prose-styled h3 { font-size: 1.05rem; font-weight: 600; color: #191919; margin-top: 1.25rem; }
        .prose-styled p { line-height: 1.75; }
        .prose-styled ul { padding-left: 1.25rem; list-style: disc; }
        .prose-styled li { line-height: 1.75; }
        .prose-styled ol { padding-left: 1.25rem; list-style: decimal; }
      `}</style>
      {children}
    </article>
  );
}

export function LegalBanner() {
  return (
    <div className="mb-12 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <strong>최종 검토 전 · DRAFT</strong> — 본 문서는 표준 템플릿을 기반으로 한 초안입니다.
      서비스 오픈 전 법률 검토를 받아 갱신해 주세요.
    </div>
  );
}
