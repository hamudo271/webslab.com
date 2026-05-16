import { cn } from '@/lib/cn';
import type { ElementType, HTMLAttributes } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: ElementType;
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4';
};

const sizeStyles = {
  display: 'text-5xl md:text-7xl lg:text-[88px] leading-[1.1]',
  h1: 'text-4xl md:text-5xl lg:text-6xl leading-[1.15]',
  h2: 'text-3xl md:text-4xl lg:text-5xl leading-[1.2]',
  h3: 'text-2xl md:text-3xl leading-[1.3]',
  h4: 'text-xl md:text-2xl leading-[1.4]',
};

export function Heading({ as: Comp = 'h2', size = 'h2', className, children, ...rest }: HeadingProps) {
  return (
    <Comp
      className={cn('font-pretendard font-bold tracking-tightest text-balance', sizeStyles[size], className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}
