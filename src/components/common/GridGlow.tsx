import { cn } from '@/lib/cn';

/**
 * Decorative dark-section background — a faint blueprint grid (masked to fade)
 * plus soft primary-blue glows for depth. CSS only, no images. Drop it as the
 * first child of a `relative` dark Section and give the content `relative z-10`.
 */
export function GridGlow({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 75% at 25% 12%, #000 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 75% at 25% 12%, #000 35%, transparent 100%)',
        }}
      />
      <div className="absolute -right-32 -top-40 h-[540px] w-[540px] rounded-full bg-primary/20 blur-[130px]" />
      <div className="absolute -bottom-48 left-1/4 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[130px]" />
    </div>
  );
}
