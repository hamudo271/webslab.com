import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { SectionEyebrow } from '@/components/common/SectionEyebrow';
import { ContactForm } from '@/components/contact/ContactForm';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { brand } from '@/config/brand';

export const metadata = buildMetadata({
  title: '문의·상담',
  description: '프로젝트 의뢰, 견적 문의, 일반 상담 등 무엇이든 편하게 남겨주세요.',
  path: '/contact',
});

const infos = [
  { icon: Mail, label: '이메일', value: brand.email, href: `mailto:${brand.email}` },
  { icon: Phone, label: '전화', value: brand.phone, href: `tel:${brand.phone.replace(/[^0-9+]/g, '')}` },
  { icon: MapPin, label: '주소', value: brand.address.streetAddress },
  { icon: Clock, label: '운영 시간', value: `${brand.hours.weekdays} · ${brand.hours.note}` },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[{ name: '홈', path: '/' }, { name: '문의', path: '/contact' }]}
      />

      <section className="pt-32 pb-12 md:pt-44 md:pb-16">
        <Container>
          <SectionEyebrow>CONTACT</SectionEyebrow>
          <Heading as="h1" size="display" className="mt-6 max-w-3xl">
            프로젝트에 대해 이야기해요
          </Heading>
          <p className="mt-8 max-w-2xl text-lg text-text-secondary md:text-xl">
            아래 양식을 작성해 주시면 영업일 기준 1-2일 내에 담당자가 연락 드립니다.
          </p>
        </Container>
      </section>

      <Section variant="light" spacing="none">
        <Container>
          <div className="grid gap-12 border-t border-line pt-16 lg:grid-cols-[1fr_2fr] lg:gap-20 pb-24">
            <aside className="space-y-8">
              {infos.map((info) => (
                <div key={info.label} className="flex gap-4">
                  <info.icon size={20} className="mt-1 shrink-0 text-primary" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a href={info.href} className="mt-1 block text-text-primary hover:text-primary">
                        {info.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-text-primary">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </aside>

            <div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
