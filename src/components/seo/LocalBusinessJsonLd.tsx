import { JsonLd } from './JsonLd';
import { localBusinessJsonLd } from '@/lib/jsonld';

export function LocalBusinessJsonLd() {
  return <JsonLd id="ld-localbusiness" data={localBusinessJsonLd()} />;
}
