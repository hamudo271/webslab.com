type Props = { children: React.ReactNode };

export function Tldr({ children }: Props) {
  return (
    <aside
      role="note"
      aria-label="요약"
      className="my-8 rounded-lg border-l-4 border-primary bg-surface-light p-6"
    >
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
        TL;DR
      </h2>
      <div className="text-sm leading-relaxed text-text-secondary">{children}</div>
    </aside>
  );
}
