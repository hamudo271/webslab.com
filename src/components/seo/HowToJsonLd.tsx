import { JsonLd } from './JsonLd';
import { howToJsonLd } from '@/lib/jsonld';

type HowToStep = { name: string; text: string };
type Props = { name: string; description: string; steps: HowToStep[] };

export function HowToJsonLd(props: Props) {
  return <JsonLd id="ld-howto" data={howToJsonLd(props)} />;
}
