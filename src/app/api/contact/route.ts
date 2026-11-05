import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  checkAttachments,
  inquiryFromFormData,
  inquirySchema,
  KINDS_WITH_ATTACHMENTS,
} from '@/lib/validators/inquiry';
import { renderInquiryMail } from '@/lib/inquiry-mail';
import { brand } from '@/config/brand';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 문의 수신 → Resend 메일. 리뉴얼 사이트 폼 4종(견적·간편·유지보수·채용 지원, public/site/ws-forms.js)이
// multipart/form-data로 보낸다 — 견적·채용은 첨부파일 가능.

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
    KINDS_WITH_ATTACHMENTS.has(data.kind)
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
    if (!(req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
      return NextResponse.json({ error: '지원하지 않는 요청 형식입니다.' }, { status: 415 });
    }
    return await handleInquiry(req);
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
