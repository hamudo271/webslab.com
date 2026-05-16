import { JsonLd } from './JsonLd';
import { websiteJsonLd } from '@/lib/jsonld';

export function WebSiteJsonLd() {
  return <JsonLd id="ld-website" data={websiteJsonLd()} />;
}
