import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { pricingTiers } from '@/data/pricing';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { Badge } from '@/components/common/Badge';
import { ButtonLink } from '@/components/common/Button';

export function Pricing() {
  return (
    <Section variant="surface" spacing="default">
      <Container>
        <SectionEyebrow>PRICING</SectionEyebrow>
        <Heading as="h2" size="h1" className="mt-4">
          제작 비용 안내
        </Heading>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
          범위에 따라 달라지지만, 어디까지 포함되는지는 미리 공개합니다. 아래 구성에 없는
          요건이라도 상담에서 함께 정리해 드립니다.
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.key}
              className={cn(
                'flex flex-col border bg-white p-8 transition-colors',
                tier.featured ? 'border-primary' : 'border-line',
              )}
            >
              <div className="flex items-center justify-between">
                <Badge variant={tier.featured ? 'primary' : 'outline'} size="sm">
                  {tier.badge}
                </Badge>
                {/* '가장 많이 선택' 같은 표현은 집계 데이터가 없으면 근거 없는 주장이 된다.
                    추천은 websLAB의 의견이므로 그렇게만 적는다. */}
                {tier.featured && (
                  <span className="text-xs font-medium text-primary">추천 구성</span>
                )}
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tightest text-text-primary">
                {tier.name}
              </h3>
              <p className="mt-1 text-sm text-text-muted">{tier.target}</p>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {tier.description}
              </p>

              <dl className="mt-8 border-t border-line">
                {tier.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                  >
                    <dt className="shrink-0 text-xs text-text-muted">{row.label}</dt>
                    <dd className="text-right text-sm font-medium text-text-primary">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* 단가가 확정되지 않은 구간은 임의 금액 대신 '견적 문의'로 노출한다. */}
              <div className="mt-8">
                {tier.startingPrice ? (
                  <p className="text-3xl font-bold tracking-tightest text-text-primary">
                    {tier.startingPrice}
                    <span className="ml-1 text-base font-medium text-text-secondary">~</span>
                  </p>
                ) : (
                  <p className="text-3xl font-bold tracking-tightest text-text-primary">
                    견적 문의
                  </p>
                )}
                <p className="mt-2 text-xs text-text-muted">{tier.priceNote}</p>
              </div>

              <ButtonLink
                href="/contact"
                variant={tier.featured ? 'primary' : 'outline'}
                size="sm"
                className="mt-6 w-full"
              >
                이 구성으로 문의
                <ArrowRight size={14} />
              </ButtonLink>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
