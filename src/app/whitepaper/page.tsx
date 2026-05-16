import Image from 'next/image';
import { Download } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { Badge } from '@/components/common/Badge';
import { ButtonLink } from '@/components/common/Button';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { whitepapers } from '@/data/whitepapers';

export const metadata = buildMetadata({
  title: '개발 백서',
  description: '기업 홈페이지 제작·기술·SEO에 대한 깊이 있는 자료를 무료로 다운로드 하세요.',
  path: '/whitepaper',
});

export default function WhitepaperPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[{ name: '홈', path: '/' }, { name: '개발 백서', path: '/whitepaper' }]}
      />
      <PageHero
        eyebrow="WHITEPAPER"
        title="실무자를 위한 백서·가이드"
        description="기업 홈페이지 구매부터 운영까지, 결정에 필요한 자료를 무료로 받아보세요."
      />

      <Section variant="light" spacing="default">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {whitepapers.map((wp) => (
              <article
                key={wp.slug}
                className="flex flex-col gap-6 border border-line bg-white p-6 transition-colors hover:border-primary"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-light">
                  <Image
                    src={wp.cover}
                    alt={wp.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <Badge variant="outline" size="sm" className="self-start">
                    {wp.category}
                  </Badge>
                  <h3 className="mt-4 text-xl font-bold tracking-tightest text-text-primary">
                    {wp.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-text-secondary">{wp.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-text-muted">
                    <span>{wp.pages} 페이지</span>
                    <span>무료 PDF</span>
                  </div>
                </div>
                <ButtonLink href="/contact" variant="primary" size="sm">
                  <Download size={14} />
                  다운로드 신청
                </ButtonLink>
              </article>
            ))}
          </div>

          <div className="mt-16 border-t border-line pt-10 text-center text-sm text-text-muted">
            더 많은 자료가 순차적으로 업데이트됩니다.
          </div>
        </Container>
      </Section>
    </>
  );
}
