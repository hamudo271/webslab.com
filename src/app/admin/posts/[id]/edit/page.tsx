import { notFound } from 'next/navigation';
import { PostForm } from '@/components/admin/PostForm';

export default function AdminEditPostPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id, 10);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return <PostForm postId={id} />;
}
