import { JsonLd } from './JsonLd';
import { serviceJsonLd } from '@/lib/jsonld';

type Props = { name: string; description: string; serviceType: string; areaServed: string };

export function ServiceJsonLd(props: Props) {
  return <JsonLd id="ld-service" data={serviceJsonLd(props)} />;
}
