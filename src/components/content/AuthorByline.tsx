import Link from 'next/link';
import type { Author } from '@/data/authors';

type Props = { author: Author; publishedAt: string; modifiedAt?: string };

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function AuthorByline({ author, publishedAt, modifiedAt }: Props) {
  const showModified = modifiedAt && modifiedAt !== publishedAt;

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line py-6 text-sm text-text-secondary">
      <div>
        <Link href={author.profileUrl} className="font-medium text-text-primary hover:text-primary">
          {author.name}
        </Link>
        <span className="ml-2 text-text-muted">{author.role}</span>
      </div>
      <span className="text-text-muted">·</span>
      <time dateTime={publishedAt}>게시 {formatDate(publishedAt)}</time>
      {showModified && (
        <>
          <span className="text-text-muted">·</span>
          <time dateTime={modifiedAt}>수정 {formatDate(modifiedAt)}</time>
        </>
      )}
    </div>
  );
}
