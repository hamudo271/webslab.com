import { JsonLd } from './JsonLd';
import { articleJsonLd } from '@/lib/jsonld';
import type { Author } from '@/data/authors';

type Props = {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  author: Author;
};

export function ArticleJsonLd(props: Props) {
  return <JsonLd id="ld-article" data={articleJsonLd(props)} />;
}
