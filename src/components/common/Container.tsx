import { cn } from '@/lib/cn';
import type { HTMLAttributes } from 'react';

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'default' | 'narrow' | 'wide';
};

export function Container({ className, size = 'default', children, ...rest }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 md:px-8',
        size === 'default' && 'max-w-container',
        size === 'narrow' && 'max-w-3xl',
        size === 'wide' && 'max-w-[1440px]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
