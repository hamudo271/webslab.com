import { JsonLd } from './JsonLd';
import { faqPageJsonLd } from '@/lib/jsonld';

type Faq = { question: string; answer: string };

export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  return <JsonLd id="ld-faq" data={faqPageJsonLd(faqs)} />;
}
