export type ColumnValidationPost = {
  slug: string;
  primaryKeyword: string;
  body: string;
  relatedSlugs: string[];
  serviceHref: string;
};

const PLACEHOLDER_PATTERN = /본문 작성 예정|TODO|대표자명|홍길동/;

function visibleText(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

export function validateColumnPosts(posts: ColumnValidationPost[]): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const keywords = new Set<string>();
  const knownSlugs = new Set(posts.map((post) => post.slug));

  for (const post of posts) {
    if (slugs.has(post.slug)) errors.push(`duplicate slug: ${post.slug}`);
    if (keywords.has(post.primaryKeyword)) {
      errors.push(`duplicate keyword: ${post.primaryKeyword}`);
    }
    if (visibleText(post.body).length < 900) errors.push(`thin body: ${post.slug}`);
    if (PLACEHOLDER_PATTERN.test(JSON.stringify(post))) errors.push(`placeholder: ${post.slug}`);
    if (post.relatedSlugs.length < 2 || post.relatedSlugs.length > 3) {
      errors.push(`related count: ${post.slug}`);
    }
    for (const related of post.relatedSlugs) {
      if (!knownSlugs.has(related) || related === post.slug) {
        errors.push(`invalid related slug: ${post.slug}:${related}`);
      }
    }
    if (!post.serviceHref.startsWith('/')) errors.push(`invalid service href: ${post.slug}`);

    slugs.add(post.slug);
    keywords.add(post.primaryKeyword);
  }

  return errors;
}
