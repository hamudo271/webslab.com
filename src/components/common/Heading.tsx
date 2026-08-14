import { cn } from '@/lib/cn';
import type { ElementType, HTMLAttributes } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: ElementType;
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4';
};

/**
 * 크기별 광학 보정. 자간·굵기를 한 값으로 통일하면 큰 제목은 헐거워 보이고
 * 작은 제목은 글자가 서로 붙어 답답해진다. 커질수록 자간을 좁히고 굵기를 올린다.
 * (Pretendard Variable 45~920을 쓰고 있어 700 외의 굵기도 그대로 쓸 수 있다.)
 */
const sizeStyles = {
  display: 'text-5xl md:text-7xl lg:text-[88px] leading-[1.06] tracking-[-0.045em] font-extrabold',
  h1: 'text-4xl md:text-5xl lg:text-6xl leading-[1.12] tracking-[-0.04em] font-extrabold',
  h2: 'text-3xl md:text-4xl lg:text-5xl leading-[1.18] tracking-[-0.035em]',
  h3: 'text-2xl md:text-3xl leading-[1.3] tracking-[-0.025em]',
  h4: 'text-xl md:text-2xl leading-[1.4] tracking-[-0.02em]',
};

export function Heading({ as: Comp = 'h2', size = 'h2', className, children, ...rest }: HeadingProps) {
  return (
    <Comp
      className={cn('font-pretendard font-bold text-balance', sizeStyles[size], className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}
