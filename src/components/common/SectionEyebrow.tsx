import { cn } from '@/lib/cn';
import type { HTMLAttributes } from 'react';

type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: 'light' | 'dark';
};

export function SectionEyebrow({ variant = 'light', className, children, ...rest }: EyebrowProps) {
  return (
    <p
      className={cn(
        'inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em]',
        variant === 'light' && 'text-primary',
        variant === 'dark' && 'text-primary-light',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}
