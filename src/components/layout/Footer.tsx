import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/config/brand';
import { footerNav, channelLinks } from '@/data/footerLinks';
import { Container } from '@/components/common/Container';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark text-white">
      <Container>
        {/* 대형 CTA 블록은 제거 — 홈 3막(CtaBanner)·케이스 하단 CTA와 역할이 겹쳐
            같은 다크 지면에 문의 버튼이 연달아 두 번 나왔다. 푸터는 정보만 담는다. */}
        <div className="grid gap-10 py-16 md:py-20 lg:grid-cols-[1.5fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label={brand.name}>
              <Image
                src="/images/logo.png"
                alt={brand.name}
                width={2043}
                height={424}
                sizes="180px"
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

            {channelLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {channelLinks.map((ch) => (
                  <a
                    key={ch.label}
                    href={ch.href}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {ch.label}
                  </a>
                ))}
              </div>
            )}
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
