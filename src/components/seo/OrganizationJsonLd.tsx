import { JsonLd } from './JsonLd';
import { organizationJsonLd } from '@/lib/jsonld';

export function OrganizationJsonLd() {
  return <JsonLd id="ld-organization" data={organizationJsonLd()} />;
}
