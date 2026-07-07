import type { Metadata } from 'next';

// 관리자 영역 공통: 검색엔진 색인 금지
export const metadata: Metadata = {
  title: '관리자 | websLAB',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F6F7F9]">{children}</div>;
}
