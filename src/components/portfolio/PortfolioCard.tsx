import Image from 'next/image';
import Link from 'next/link';
import type { Portfolio } from '@/data/portfolios';
import { INDUSTRY_LABELS } from '@/data/industries';

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const hasFullShot = Boolean(portfolio.fullShot);

  return (
    <Link href={`/portfolio/${portfolio.slug}`} className="group block">
      {/*
        세로 긴 풀페이지 스크린샷을 3:4 창에 넣고, hover하면 위에서 아래로 훑는다(1.5s).
        translateY 대신 object-position을 top→bottom으로 전환한다. 퍼센트가 '넘치는 만큼'을
        기준으로 계산되므로 캡처 길이가 제각각이어도 정확히 맨 아래에서 멈춘다.
      */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] border border-line bg-surface-light shadow-card transition-shadow duration-500 group-hover:shadow-lift">
        {hasFullShot ? (
          <Image
            src={portfolio.fullShot as string}
            alt={`${portfolio.title} 전체 페이지 미리보기`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-[object-position] duration-[1500ms] ease-in-out group-hover:object-bottom motion-reduce:transition-none"
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

      <h3 className="mt-5 text-lg font-bold tracking-tightest text-text-primary">
        {portfolio.title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-surface-light px-4 py-1.5 text-[13px] font-medium text-text-secondary">
          {INDUSTRY_LABELS[portfolio.industry]}
        </span>
        <span className="rounded-full bg-surface-light px-4 py-1.5 text-[13px] font-medium text-text-secondary">
          {portfolio.category}
        </span>
      </div>
    </Link>
  );
}
