import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import type { Portfolio } from '@/data/portfolios';
import { INDUSTRY_LABELS } from '@/data/industries';

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Link href={`/portfolio/${portfolio.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-light">
        <Image
          src={portfolio.cover}
          alt={portfolio.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>{INDUSTRY_LABELS[portfolio.industry]}</span>
            <span>·</span>
            <span>{portfolio.year}</span>
          </div>
          <h3 className="mt-2 text-lg font-bold tracking-tightest text-text-primary">
            {portfolio.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{portfolio.summary}</p>
        </div>
        <Badge variant="outline" size="sm" className="shrink-0">
          {portfolio.duration}
        </Badge>
      </div>
    </Link>
  );
}
