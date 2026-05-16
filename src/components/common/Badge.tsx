import { cn } from '@/lib/cn';
import type { HTMLAttributes } from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'outline' | 'primary' | 'dark';
  size?: 'sm' | 'md';
};

export function Badge({
  variant = 'default',
  size = 'sm',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        variant === 'default' && 'bg-surface-light text-text-secondary',
        variant === 'outline' && 'border border-line text-text-secondary',
        variant === 'primary' && 'bg-primary/10 text-primary',
        variant === 'dark' && 'bg-white/10 text-white',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
