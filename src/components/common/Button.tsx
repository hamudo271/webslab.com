import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'dark' | 'white';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  outline: 'border border-line text-text-primary hover:border-primary hover:text-primary',
  ghost: 'text-text-primary hover:bg-surface-light',
  dark: 'bg-dark text-white hover:bg-dark/85',
  white: 'bg-white text-text-primary hover:bg-white/90',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-base',
};

function styleFor(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>;

type NativeButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: NativeButtonProps) {
  return (
    <button className={styleFor(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  external,
  children,
  ...rest
}: LinkButtonProps) {
  const classes = styleFor(variant, size, className);
  if (external) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link className={classes} href={href} {...rest}>
      {children}
    </Link>
  );
}
