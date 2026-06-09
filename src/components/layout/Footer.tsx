import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/config/brand';
import { footerNav } from '@/data/footerLinks';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { ButtonLink } from '@/components/common/Button';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark text-white">
      <Container>
        <div className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_auto] lg:items-end">
          <Heading as="h2" size="h1" className="max-w-2xl text-balance">
            {brand.name}과 함께 여러분의 프로젝트를 진행해보세요
          </Heading>
          <div className="flex flex-col gap-3 lg:items-end">
            <ButtonLink href="/contact" variant="primary" size="lg">
              프로젝트 의뢰
              <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink
              href="/files/websLAB-brochure.pdf"
              external
              variant="ghost"
              size="md"
              className="text-white hover:bg-white/10"
              download="websLAB-회사소개서.pdf"
            >
              회사소개서 다운로드
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/10 py-16 lg:grid-cols-[1.5fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label={brand.name}>
              <Image
                src="/images/logo.png"
                alt={brand.name}
                width={2043}
                height={424}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {brand.description}
            </p>
            <div className="mt-6 space-y-1 text-sm text-white/60">
              <p>
                상호: {brand.nameKo} | 대표: {brand.legal.representativeName}
              </p>
              <p>사업자등록번호: {brand.legal.businessNumber}</p>
              <p>{brand.address.streetAddress}</p>
              <p>
                <a href={`mailto:${brand.email}`} className="hover:text-white">
                  {brand.email}
                </a>{' '}
                · {brand.phone}
              </p>
              <p className="text-white/40">{brand.hours.weekdays} · {brand.hours.note}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-white/80 hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-xs text-white/40">
          © {year} {brand.nameKo}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
