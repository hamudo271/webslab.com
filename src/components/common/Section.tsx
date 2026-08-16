import { cn } from '@/lib/cn';
import type { HTMLAttributes } from 'react';

type SectionProps = HTMLAttributes<HTMLElement> & {
  variant?: 'light' | 'dark' | 'darker' | 'surface';
  /** breath: 막이 바뀌는 자리(2막 오프닝 등)에서 크게 숨을 쉬는 여백 */
  spacing?: 'default' | 'compact' | 'loose' | 'breath' | 'none';
};

export function Section({
  className,
  variant = 'light',
  spacing = 'default',
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        variant === 'light' && 'bg-white text-text-primary',
        variant === 'surface' && 'bg-surface-light text-text-primary',
        variant === 'dark' && 'bg-dark-section text-white',
        variant === 'darker' && 'bg-dark text-white',
        spacing === 'default' && 'py-20 md:py-28',
        spacing === 'compact' && 'py-12 md:py-16',
        spacing === 'loose' && 'py-24 md:py-36',
        spacing === 'breath' && 'py-28 md:py-44',
        spacing === 'none' && 'py-0',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
