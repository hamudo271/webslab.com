import Link from 'next/link';
import { columnPosts } from '@/data/columnPosts';

export function RelatedPosts({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map((s) => columnPosts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) return null;

  return (
    <section className="my-12 border-t border-line pt-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tightest">관련 글</h2>
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/column/${p.slug}`}
              className="block rounded-lg border border-line p-5 transition hover:border-primary"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {p.category}
              </span>
              <h3 className="mt-2 text-base font-semibold text-text-primary">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{p.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
