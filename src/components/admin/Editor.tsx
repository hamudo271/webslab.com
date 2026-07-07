'use client';

import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Link2,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/cn';

type BtnProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

function Btn({ onClick, active, disabled, title, children }: BtnProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // 선택 영역 유지
      onClick={onClick}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition-colors disabled:opacity-40',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-black/10 bg-white text-text-secondary hover:bg-surface-light',
      )}
    >
      {children}
    </button>
  );
}

type EditorProps = {
  initialContent?: string;
  onChange?: (html: string) => void;
  uploadImage: (file: File) => Promise<{ url: string }>;
};

// 본문 리치 에디터 (Tiptap). initialContent는 마운트 시 1회 반영 → 부모는 로드 후 마운트할 것.
export function Editor({ initialContent = '', onChange, uploadImage }: EditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false, // SSR 하이드레이션 불일치 방지
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
        },
      }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg' } }),
      Placeholder.configure({ placeholder: '본문을 입력하세요…' }),
    ],
    content: initialContent,
    editorProps: {
      // 공개 페이지(prose prose-neutral)와 동일한 본문 스타일로 편집
      attributes: { class: 'prose prose-neutral min-h-[340px] max-w-none px-5 py-4 focus:outline-none' },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  if (!editor) {
    return <div className="h-[420px] animate-pulse rounded-xl border border-black/15 bg-surface-light" />;
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('링크 URL', prev || 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setUploading(true);
      const { url } = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err instanceof Error && err.message ? err.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-black/15 bg-white">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-black/10 bg-surface-light/60 p-2">
        <Btn title="제목 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Btn>
        <Btn title="제목 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Btn>
        <span className="mx-1 h-5 w-px bg-black/10" />
        <Btn title="굵게" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></Btn>
        <Btn title="기울임" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></Btn>
        <span className="mx-1 h-5 w-px bg-black/10" />
        <Btn title="글머리 목록" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></Btn>
        <Btn title="번호 목록" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></Btn>
        <Btn title="인용" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></Btn>
        <span className="mx-1 h-5 w-px bg-black/10" />
        <Btn title="링크" active={editor.isActive('link')} onClick={setLink}><Link2 size={16} /></Btn>
        <Btn title="이미지 삽입" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
        </Btn>
        <span className="mx-1 h-5 w-px bg-black/10" />
        <Btn title="실행취소" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={16} /></Btn>
        <Btn title="다시실행" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={16} /></Btn>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
