import Link from 'next/link';
import { Eye, FileText, CheckCircle2, PenLine, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/db';
import { analytics } from '@/config/analytics';
import { cn } from '@/lib/cn';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

function formatDate(d: Date | null) {
  if (!d) return '—';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/** 외부 분석 도구 — env 연결 상태와 대시보드 바로가기 */
const TRACKERS: { name: string; enabled: boolean; note: string; href: string }[] = [
  {
    name: 'Google Analytics 4',
    enabled: analytics.ga4.enabled,
    note: '방문·유입·전환의 기준 데이터',
    href: 'https://analytics.google.com',
  },
  {
    name: '네이버 애널리틱스',
    enabled: analytics.naver.enabled,
    note: '네이버 검색 유입 분석',
    href: 'https://analytics.naver.com',
  },
  {
    name: 'Microsoft Clarity',
    enabled: analytics.clarity.enabled,
    note: '히트맵 · 세션 녹화(무료)',
    href: 'https://clarity.microsoft.com',
  },
  {
    name: 'Meta 픽셀',
    enabled: analytics.metaPixel.enabled,
    note: '메타 광고 전환 · 리타겟팅',
    href: 'https://business.facebook.com/events_manager2',
  },
  {
    name: '카카오 픽셀',
    enabled: analytics.kakaoPixel.enabled,
    note: '카카오모먼트 광고 전환',
    href: 'https://business.kakao.com',
  },
];

export default async function AdminStatsPage() {
  let error: string | null = null;
  let totals = { all: 0, published: 0, draft: 0, views: 0 };
  let topPosts: {
    id: number;
    title: string;
    slug: string;
    category: string;
    status: string;
    publishedAt: Date | null;
    viewCount: number;
  }[] = [];
  let byCategory: { category: string; count: number; views: number }[] = [];

  try {
    const [all, published, viewAgg, top, groups] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.aggregate({ _sum: { viewCount: true } }),
      prisma.post.findMany({
        orderBy: { viewCount: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          status: true,
          publishedAt: true,
          viewCount: true,
        },
      }),
      prisma.post.groupBy({
        by: ['category'],
        _count: { _all: true },
        _sum: { viewCount: true },
        orderBy: { _sum: { viewCount: 'desc' } },
      }),
    ]);
    totals = {
      all,
      published,
      draft: all - published,
      views: viewAgg._sum.viewCount ?? 0,
    };
    topPosts = top;
    byCategory = groups.map((g) => ({
      category: g.category,
      count: g._count._all,
      views: g._sum.viewCount ?? 0,
    }));
  } catch (err) {
    console.error('[admin:stats]', err);
    error = '통계를 불러오지 못했습니다. 데이터베이스 연결을 확인해 주세요.';
  }

  const summary = [
    { label: '전체 글', value: totals.all, icon: FileText },
    { label: '발행됨', value: totals.published, icon: CheckCircle2 },
    { label: '임시저장', value: totals.draft, icon: PenLine },
    { label: '누적 조회수', value: totals.views, icon: Eye },
  ];

  return (
    <AdminShell>
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-extrabold tracking-tightest">통계</h1>
        <p className="text-xs text-text-muted">
          조회수는 CMS로 발행한 글 기준(정적 12편은 집계 대상 아님)
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          {/* 요약 카드 */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {summary.map((s) => (
              <div key={s.label} className="rounded-lg border border-black/10 bg-white p-4">
                <div className="flex items-center gap-2 text-text-muted">
                  <s.icon size={14} />
                  <span className="text-xs font-medium">{s.label}</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums tracking-tightest">
                  {s.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* 조회수 TOP 10 */}
          <h2 className="mt-10 text-sm font-bold text-text-primary">조회수 TOP 10</h2>
          {topPosts.length === 0 ? (
            <p className="mt-3 rounded-md border border-black/10 bg-white p-6 text-sm text-text-muted">
              아직 집계할 글이 없습니다. 새 글을 발행하면 조회수가 쌓입니다.
            </p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-lg border border-black/10 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-xs text-text-muted">
                    <th className="px-4 py-2.5 font-medium">제목</th>
                    <th className="px-4 py-2.5 font-medium">카테고리</th>
                    <th className="px-4 py-2.5 font-medium">상태</th>
                    <th className="px-4 py-2.5 font-medium">발행일</th>
                    <th className="px-4 py-2.5 text-right font-medium">조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map((p) => (
                    <tr key={p.id} className="border-b border-black/5 last:border-0">
                      <td className="max-w-[320px] truncate px-4 py-2.5">
                        <Link
                          href={`/admin/posts/${p.id}/edit`}
                          className="font-medium hover:text-primary"
                        >
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-text-secondary">{p.category}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={cn(
                            'rounded px-1.5 py-0.5 text-xs font-semibold',
                            p.status === 'PUBLISHED'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-black/5 text-text-muted',
                          )}
                        >
                          {p.status === 'PUBLISHED' ? '발행' : '임시'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-text-secondary">
                        {formatDate(p.publishedAt)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums">
                        {p.viewCount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 카테고리별 */}
          {byCategory.length > 0 && (
            <>
              <h2 className="mt-10 text-sm font-bold text-text-primary">카테고리별</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {byCategory.map((c) => (
                  <div key={c.category} className="rounded-lg border border-black/10 bg-white p-4">
                    <p className="text-xs font-medium text-text-muted">{c.category}</p>
                    <p className="mt-1 text-sm">
                      <span className="font-bold">{c.count}</span>
                      <span className="text-text-muted">편 · </span>
                      <span className="font-bold">{c.views.toLocaleString()}</span>
                      <span className="text-text-muted"> 조회</span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* 외부 분석 도구 상태 */}
      <h2 className="mt-10 text-sm font-bold text-text-primary">외부 분석 도구</h2>
      <p className="mt-1 text-xs text-text-muted">
        방문자·유입·전환 통계는 아래 도구에서 확인합니다. Railway 환경변수에 ID를 넣으면
        자동으로 연결됩니다.
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {TRACKERS.map((t) => (
          <a
            key={t.name}
            href={t.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start justify-between gap-3 rounded-lg border border-black/10 bg-white p-4 transition-colors hover:border-primary/40"
          >
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                {t.name}
                <ExternalLink size={12} className="text-text-muted group-hover:text-primary" />
              </p>
              <p className="mt-1 text-xs text-text-muted">{t.note}</p>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold',
                t.enabled ? 'bg-green-100 text-green-700' : 'bg-black/5 text-text-muted',
              )}
            >
              {t.enabled ? '연결됨' : '미연결'}
            </span>
          </a>
        ))}
      </div>
    </AdminShell>
  );
}
