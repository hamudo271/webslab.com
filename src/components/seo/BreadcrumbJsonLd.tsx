import { JsonLd } from './JsonLd';
import { breadcrumbJsonLd } from '@/lib/jsonld';

type Crumb = { name: string; path: string };

export function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  return <JsonLd id="ld-breadcrumb" data={breadcrumbJsonLd(crumbs)} />;
}
