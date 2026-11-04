// 리뉴얼 문의 3종 → 알림 메일(제목·본문). 순수 함수 — api/contact가 Resend로 보낸다.

import { brand } from '@/config/brand';
import type { InquiryInput } from '@/lib/validators/inquiry';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const KIND_LABEL: Record<InquiryInput['kind'], string> = {
  project: '견적 문의',
  quick: '간편 상담',
  maintenance: '유지보수 신청',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type InquiryMail = { subject: string; html: string; replyTo?: string };

export function renderInquiryMail(
  d: InquiryInput,
  attachments: { name: string; size: number }[] = [],
  meta: { page?: string } = {},
): InquiryMail {
  let rows: [string, string][];
  let message = '';
  let subject: string;
  let replyTo: string | undefined;

  switch (d.kind) {
    case 'project':
      rows = [
        ['프로젝트', d.projectType],
        ['회사명', d.company],
        ['담당자', d.name],
        ['연락처', d.phone],
        ['이메일', d.email],
        ['기존 홈페이지', d.currentSite],
        ['참고 사이트', d.refUrls.join('\n')],
        ['예산', d.budget],
        ['마감 예정일', d.deadline],
      ];
      message = d.message;
      subject = `[${brand.name} ${KIND_LABEL.project}] ${d.projectType} — ${d.company} ${d.name}`;
      replyTo = d.email;
      break;
    case 'quick':
      rows = [
        ['이름', d.name],
        ['연락처', d.phone],
        ['상담 분야', d.inquiryType],
      ];
      subject = `[${brand.name} ${KIND_LABEL.quick}] ${d.inquiryType || '상담'} — ${d.name} ${d.phone}`;
      break;
    case 'maintenance':
      rows = [
        ['사이트 주소', d.url],
        ['맡기실 방식', d.mode],
        ['필요한 작업', d.work.join(', ')],
        ['이름 또는 회사명', d.name],
        ['회신 연락처', d.reach],
      ];
      message = d.message;
      subject = `[${brand.name} ${KIND_LABEL.maintenance}] ${d.name} — ${d.url}`;
      replyTo = EMAIL_RE.test(d.reach) ? d.reach : undefined;
      break;
  }

  if (attachments.length) {
    rows.push(['첨부파일', attachments.map((a) => `${a.name} (${formatBytes(a.size)})`).join('\n')]);
  }
  if (meta.page) rows.push(['보낸 페이지', meta.page]);

  const rowHtml = rows
    .filter(([, v]) => v && v.trim() !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:#4E5968;background:#F2F4F6;border:1px solid #E5E8EB;white-space:nowrap;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #E5E8EB;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html><html lang="ko"><body style="font-family:'Pretendard',Arial,sans-serif;color:#191F28;line-height:1.6;">
<h2 style="color:#3182F6;letter-spacing:-0.03em;margin:0 0 16px;">[${escapeHtml(brand.nameKo)}] 새 ${KIND_LABEL[d.kind]}이 도착했습니다</h2>
<table style="border-collapse:collapse;width:100%;font-size:14px;">${rowHtml}</table>
${
  message
    ? `<h3 style="margin-top:24px;letter-spacing:-0.03em;">문의 내용</h3><p style="white-space:pre-wrap;background:#F2F4F6;padding:16px;border:1px solid #E5E8EB;border-radius:8px;">${escapeHtml(message)}</p>`
    : ''
}
<p style="color:#8B95A1;font-size:12px;margin-top:32px;">— ${escapeHtml(brand.name)} · ${escapeHtml(brand.domain)}</p>
</body></html>`;

  return { subject, html, replyTo };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
