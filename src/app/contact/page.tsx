import { Mail, Phone, Download } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/common/Container';
import { ContactForm } from '@/components/contact/ContactForm';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { brand } from '@/config/brand';
import { contactStats, contactSteps } from '@/data/contact';

export const metadata = buildMetadata({
  title: '프로젝트 견적 문의',
  description:
    '홈페이지 제작·리뉴얼·유지보수 견적을 문의하세요. 1영업일 내에 맞춤 제안과 견적서를 회신드립니다.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[{ name: '홈', path: '/' }, { name: '문의', path: '/contact' }]}
      />

      {/* 히어로 — 센터 정렬 */}
      <section className="pt-32 pb-10 text-center md:pt-44 md:pb-14">
        <Container>
          <p className="text-sm font-semibold text-primary md:text-base">
            웹사이트 제작, 복잡하게 고민하지 마세요
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tightest text-text-primary md:text-5xl">
            프로젝트 견적 문의
          </h1>
        </Container>
      </section>

      {/* 지표 바 — 실제 실적 4가지 */}
      <section className="pb-16 md:pb-20">
        <Container>
          <dl className="mx-auto grid max-w-4xl grid-cols-2 gap-y-10 md:grid-cols-4">
            {contactStats.map((stat, i) => (
              <div
                key={stat.label}
                className={
                  i > 0
                    ? 'text-center md:border-l md:border-line'
                    : 'text-center'
                }
              >
                <dt className="text-sm text-text-muted">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-bold tracking-tightest text-text-primary md:text-4xl">
                  {stat.value}
                  {stat.suffix && (
                    <span className="ml-1 text-lg font-semibold text-text-secondary">
                      {stat.suffix}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 사이드바 + 폼 */}
      <section className="pb-24 md:pb-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:gap-16">
            <aside>
              <div className="rounded-xl bg-surface-light p-8">
                <p className="text-sm font-bold text-text-primary">메일 상담</p>
                <a
                  href={`mailto:${brand.email}`}
                  className="mt-1.5 flex items-center gap-2 text-lg font-bold text-primary hover:underline"
                >
                  <Mail size={18} />
                  {brand.email}
                </a>

                <p className="mt-6 text-sm font-bold text-text-primary">전화 · 카카오</p>
                <a
                  href={`tel:${brand.phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-1.5 flex items-center gap-2 text-lg font-bold text-text-primary hover:text-primary"
                >
                  <Phone size={18} />
                  {brand.phone}
                </a>

                <hr className="my-8 border-line" />

                <p className="text-sm font-bold text-text-primary">
                  견적 문의는 이렇게 진행돼요
                </p>
                <ol className="mt-4 space-y-4">
                  {contactSteps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dark text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-text-secondary">{step}</span>
                    </li>
                  ))}
                </ol>

                <hr className="my-8 border-line" />

                <p className="text-sm leading-relaxed text-text-secondary">
                  아직 검토 단계시라면, 회사소개서를
                  <br />
                  먼저 받아보세요.
                </p>
                <a
                  href="/files/websLAB-brochure.pdf"
                  download="websLAB-회사소개서.pdf"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-dark py-3.5 text-sm font-bold text-white transition-colors hover:bg-dark/85"
                >
                  <Download size={16} />
                  회사소개서 다운로드
                </a>
              </div>
            </aside>

            <div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
