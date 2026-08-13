import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import type { Portfolio } from '@/data/portfolios';
import { INDUSTRY_LABELS } from '@/data/industries';

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const hasFullShot = Boolean(portfolio.fullShot);

  return (
    <Link href={`/portfolio/${portfolio.slug}`} className="group block">
      {/*
        세로 긴 풀페이지 스크린샷을 3:4 창에 넣고, hover하면 위에서 아래로 훑는다.
        translateY 대신 object-position을 top→bottom으로 전환한다. 퍼센트가 '넘치는 만큼'을
        기준으로 계산되므로 캡처 길이가 2191px든 2600px든 정확히 맨 아래에서 멈춘다.
      */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-light">
        {hasFullShot ? (
          <Image
            src={portfolio.fullShot as string}
            alt={`${portfolio.title} 전체 페이지 미리보기`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-[object-position] duration-[2500ms] ease-in-out group-hover:object-bottom motion-reduce:transition-none"
          />
        ) : (
          <Image
            src={portfolio.cover}
            alt={portfolio.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
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
