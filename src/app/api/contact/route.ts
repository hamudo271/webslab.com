import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  contactSchema,
  CATEGORY_LABELS,
  BUDGET_LABELS,
  type ContactInput,
} from '@/lib/validators/contact';
import { checkAttachments, inquiryFromFormData, inquirySchema } from '@/lib/validators/inquiry';
import { renderInquiryMail } from '@/lib/inquiry-mail';
import { brand } from '@/config/brand';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 문의 수신 → Resend 메일
//  - multipart/form-data: 리뉴얼 사이트 문의 3종(견적·간편·유지보수, public/site/ws-forms.js) — 첨부파일 가능
//  - application/json: 이전 React 문의 폼(contactSchema) 호환

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderContactHtml(d: ContactInput): string {
  const rows: [string, string | undefined][] = [
    ['이름', d.name],
    ['회사', d.company],
    ['이메일', d.email],
    ['연락처', d.phone],
    ['문의 유형', CATEGORY_LABELS[d.category]],
    ['예산', d.budget ? BUDGET_LABELS[d.budget] : '미입력'],
  ];

  const rowHtml = rows
    .filter(([, v]) => !!v && v !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:#5A5757;background:#F6F6F6;border:1px solid #D9D9D9;">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #D9D9D9;">${escapeHtml(v as string)}</td></tr>`,
    )
    .join('');

  return `<!DOCTYPE html><html lang="ko"><body style="font-family:'Pretendard',Arial,sans-serif;color:#191919;line-height:1.6;">
<h2 style="color:#1D74FF;letter-spacing:-0.04em;">[${escapeHtml(brand.name)}] 새 문의가 도착했습니다</h2>
<table style="border-collapse:collapse;width:100%;font-size:14px;">${rowHtml}</table>
<h3 style="margin-top:24px;letter-spacing:-0.04em;">문의 내용</h3>
<p style="white-space:pre-wrap;background:#F6F6F6;padding:16px;border:1px solid #D9D9D9;">${escapeHtml(d.message)}</p>
<p style="color:#939393;font-size:12px;margin-top:32px;">— ${escapeHtml(brand.name)} · ${escapeHtml(brand.domain)}</p>
</body></html>`;
}

type Outgoing = {
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
};

async function send(mail: Outgoing, log: unknown): Promise<NextResponse> {
  if (process.env.CONTACT_DRY_RUN === 'true') {
    console.log('[contact:dry-run]', JSON.stringify({ subject: mail.subject, ...(log as object) }, null, 2));
    return NextResponse.json({ ok: true, dryRun: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY missing');
    return NextResponse.json({ error: '메일 전송이 설정되지 않았습니다.' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';
  const toEmail = process.env.CONTACT_TO_EMAIL ?? brand.email;

  const { error } = await resend.emails.send({
    from: `${brand.name} <${fromEmail}>`,
    to: [toEmail],
    ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
    subject: mail.subject,
    html: mail.html,
    ...(mail.attachments?.length ? { attachments: mail.attachments } : {}),
  });

  if (error) {
    console.error('[resend]', error);
    // 502는 Cloudflare가 자체 페이지로 마스킹하므로 500 사용(우리 JSON이 클라이언트까지 전달됨).
    // detail: Resend가 반환한 실제 사유(예: 도메인 미인증) — 원인 파악용.
    const e = error as { message?: string; name?: string; statusCode?: number };
    return NextResponse.json(
      { error: '메일 전송에 실패했습니다.', detail: e?.message, name: e?.name, code: e?.statusCode },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

async function handleInquiry(req: Request): Promise<NextResponse> {
  const form = await req.formData();

  // Honeypot: 사람 눈에 안 보이는 칸이 채워졌으면 봇 — 성공처럼 응답하고 버린다
  const hp = form.get('website');
  if (typeof hp === 'string' && hp.trim() !== '') return NextResponse.json({ ok: true });

  const parsed = inquirySchema.safeParse(inquiryFromFormData(form));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? '입력값을 다시 확인해 주세요.' },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const files =
    data.kind === 'project'
      ? form.getAll('attachments').filter((f): f is File => f instanceof File && f.size > 0)
      : [];
  const fileInfo = files.map((f) => ({ name: f.name, size: f.size }));
  const fileError = checkAttachments(fileInfo);
  if (fileError) return NextResponse.json({ error: fileError }, { status: 400 });

  const page = form.get('page');
  const mail = renderInquiryMail(data, fileInfo, { page: typeof page === 'string' ? page : undefined });
  const attachments = await Promise.all(
    files.map(async (f) => ({ filename: f.name, content: Buffer.from(await f.arrayBuffer()) })),
  );
  return send({ ...mail, attachments }, { data, files: fileInfo });
}

export async function POST(req: Request) {
  try {
    if ((req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
      return await handleInquiry(req);
    }

    const body = (await req.json()) as Record<string, unknown>;

    // Honeypot: bot likely if "website" has content
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: '입력값을 다시 확인해 주세요.', details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;

    return await send(
      {
        subject: `[${brand.name} 문의] ${CATEGORY_LABELS[data.category]} — ${data.name}`,
        html: renderContactHtml(data),
        replyTo: data.email,
      },
      { data },
    );
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
