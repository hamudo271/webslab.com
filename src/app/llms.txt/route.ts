import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { brand } from '@/config/brand';
import { columnPosts } from '@/data/columnPosts';
import { portfolios } from '@/data/portfolios';

export function GET() {
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const lines: string[] = [];

  lines.push(`# ${brand.name}`);
  lines.push('');
  lines.push(`> ${brand.tagline}`);
  lines.push('');
  lines.push(`${brand.description}`);
  lines.push('');
  lines.push('## Main pages');
  lines.push('');
  lines.push(`- [홈](${base}/): 회사 소개와 주요 서비스`);
  lines.push(`- [회사소개](${base}/about): 팀과 철학`);
  lines.push(`- [서비스](${base}/service): 기업 홈페이지 신규 제작·리뉴얼 서비스`);
  lines.push(`- [프로그램 개발](${base}/program): 업무 자동화·맞춤 프로그램 개발`);
  lines.push(`- [포트폴리오](${base}/portfolio): 진행 사례`);
  lines.push(`- [전문 칼럼](${base}/column): 기업 홈페이지 인사이트`);
  lines.push(`- [유지보수 신청](${base}/maintenance): 점검·보안 패치·백업·콘텐츠 수정 신청`);
  lines.push(`- [유지보수 비용 안내](${base}/maintenance/pricing): 건별·월 구독 방식과 견적 기준`);
  lines.push(`- [자주묻는질문](${base}/faq): 비용·기간·제작 범위·운영 문답`);
  lines.push(`- [공지사항](${base}/notice): 운영 안내와 새 소식`);
  lines.push(`- [문의](${base}/contact): 프로젝트 문의 폼`);
  lines.push('');
  lines.push('## Column posts');
  lines.push('');
  for (const p of columnPosts) {
    lines.push(`- [${p.title}](${base}/column/${p.slug}): ${p.excerpt}`);
  }
  lines.push('');
  lines.push('## Case studies');
  lines.push('');
  for (const c of portfolios) {
    lines.push(`- [${c.title}](${base}/portfolio/${c.slug})`);
  }
  lines.push('');

  return new NextResponse(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
