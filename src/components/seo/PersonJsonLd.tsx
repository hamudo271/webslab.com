import { JsonLd } from './JsonLd';
import { personJsonLd } from '@/lib/jsonld';
import type { Author } from '@/data/authors';

export function PersonJsonLd({ author }: { author: Author }) {
  return <JsonLd id={`ld-person-${author.id}`} data={personJsonLd(author)} />;
}
