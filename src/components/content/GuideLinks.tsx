import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import type { GuideLink } from '@/lib/seo-policy';

type Props = {
  title: string;
  links: GuideLink[];
};

export function GuideLinks({ title, links }: Props) {
  return (
    <section className="border-y border-line bg-surface-light py-8">
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          <nav aria-label={title} className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary"
              >
                {link.label}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
