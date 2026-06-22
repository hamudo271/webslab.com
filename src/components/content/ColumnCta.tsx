'use client';

import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/common/Button';
import { trackPillarToContact } from '@/lib/analytics-events';

type Props = {
  title: string;
  description: string;
  serviceHref: string;
  serviceLabel: string;
  fromPath: string;
};

export function ColumnCta({
  title,
  description,
  serviceHref,
  serviceLabel,
  fromPath,
}: Props) {
  return (
    <aside className="mt-12 border border-line bg-surface-light p-6 md:p-8">
      <h2 className="text-2xl font-bold tracking-tightest text-text-primary">{title}</h2>
      <p className="mt-3 leading-relaxed text-text-secondary">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={serviceHref} variant="outline">
          {serviceLabel}
        </ButtonLink>
        <ButtonLink
          href="/contact"
          variant="primary"
          onClick={() => trackPillarToContact({ fromPath })}
        >
          프로젝트 문의
          <ArrowRight size={16} />
        </ButtonLink>
      </div>
    </aside>
  );
}
