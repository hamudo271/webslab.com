import Image from 'next/image';
import Link from 'next/link';
import { getColumnFeed } from '@/lib/column-feed';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/common/Badge';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// 홈 — 최신 칼럼 3개 자동 노출 (정적 + DB 병합 피드)
export async function LatestColumns() {
  const posts = (await getColumnFeed()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <Section variant="light" spacing="default">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">COLUMN</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tightest text-text-primary">
              최신 칼럼
            </h2>
          </div>
          <Link
            href="/column"
            className="text-sm font-medium text-text-secondary hover:text-primary"
          >
            전체 보기 →
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/column/${post.slug}`} className="block">
                <div className="relative aspect-[120/63] overflow-hidden rounded-lg bg-dark">
                  {post.cover ? (
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-dark-section">
                      <span className="text-lg font-extrabold tracking-tightest text-white/30">
                        websLAB
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-text-muted">
                  <Badge variant="outline" size="sm">{post.category}</Badge>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <h3 className="mt-2 line-clamp-2 text-lg font-bold tracking-tightest text-text-primary group-hover:text-primary">
                  {post.title}
                </h3>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
