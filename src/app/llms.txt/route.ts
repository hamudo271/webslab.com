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
