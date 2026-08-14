import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { brochureSchema, type BrochureInput } from '@/lib/validators/brochure';
import { brand } from '@/config/brand';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderLeadHtml(d: BrochureInput): string {
  const rows: [string, string | undefined][] = [
    ['이름', d.name],
    ['회사', d.company],
    ['이메일', d.email],
  ];

  const rowHtml = rows
    .filter(([, v]) => !!v && v !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:#5A5757;background:#F6F6F6;border:1px solid #D9D9D9;">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #D9D9D9;">${escapeHtml(v as string)}</td></tr>`,
    )
    .join('');

  return `<!DOCTYPE html><html lang="ko"><body style="font-family:'Pretendard',Arial,sans-serif;color:#191919;line-height:1.6;">
<h2 style="color:#1D74FF;letter-spacing:-0.04em;">[${escapeHtml(brand.name)}] 회사소개서를 받아간 방문자가 있습니다</h2>
<p style="color:#5A5757;font-size:14px;">아직 문의를 남기지는 않았지만 소개서를 요청한 잠재 고객입니다.</p>
<table style="border-collapse:collapse;width:100%;font-size:14px;">${rowHtml}</table>
<p style="color:#939393;font-size:12px;margin-top:32px;">— ${escapeHtml(brand.name)} · ${escapeHtml(brand.domain)}</p>
</body></html>`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    // 허니팟: 봇이면 조용히 성공 처리(공격자에게 판별 정보를 주지 않는다)
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true });
    }

    const parsed = brochureSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: '입력값을 다시 확인해 주세요.', details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;

    if (process.env.CONTACT_DRY_RUN === 'true') {
      console.log('[brochure:dry-run]', JSON.stringify(data, null, 2));
      return NextResponse.json({ ok: true, dryRun: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    // 메일 발송이 막혀도 방문자의 다운로드는 막지 않는다 — 리드 알림 실패로 사용자 경험을
    // 깨뜨리는 건 손해가 더 크다. 알림만 로그로 남기고 통과시킨다.
    if (!apiKey) {
      console.error('[brochure] RESEND_API_KEY missing — 리드 알림 미발송', data.email);
      return NextResponse.json({ ok: true, notified: false });
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';
    const toEmail = process.env.CONTACT_TO_EMAIL ?? brand.email;

    const { error } = await resend.emails.send({
      from: `${brand.name} <${fromEmail}>`,
      to: [toEmail],
      replyTo: data.email,
      subject: `[${brand.name} 소개서] ${data.company ? `${data.company} · ` : ''}${data.name}`,
      html: renderLeadHtml(data),
    });

    if (error) {
      console.error('[brochure:resend]', error);
      return NextResponse.json({ ok: true, notified: false });
    }

    return NextResponse.json({ ok: true, notified: true });
  } catch (err) {
    console.error('[brochure]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
