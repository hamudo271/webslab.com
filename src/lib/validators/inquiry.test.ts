import { describe, expect, it } from 'vitest';
import { checkAttachments, inquiryFromFormData, inquirySchema } from './inquiry';
import { renderInquiryMail } from '@/lib/inquiry-mail';

function form(entries: [string, string][]) {
  const fd = new FormData();
  for (const [k, v] of entries) fd.append(k, v);
  return fd;
}

describe('문의 스키마', () => {
  it('견적 문의 — 필수만 채워도 통과하고 선택 칸은 빈 값이 된다', () => {
    const parsed = inquirySchema.safeParse(
      inquiryFromFormData(
        form([
          ['kind', 'project'],
          ['projectType', '리뉴얼'],
          ['company', '웹스랩'],
          ['name', '홍길동 팀장'],
          ['phone', '010-1234-5678'],
          ['email', 'hong@example.com'],
          ['message', '리뉴얼 견적 부탁드립니다'],
          ['refUrls', 'https://a.com'],
          ['refUrls', ' '],
          ['privacyConsent', 'true'],
        ]),
      ),
    );
    expect(parsed.success).toBe(true);
    if (parsed.success && parsed.data.kind === 'project') {
      expect(parsed.data.refUrls).toEqual(['https://a.com']);
      expect(parsed.data.budget).toBe('');
    }
  });

  it('동의하지 않으면 거부한다', () => {
    const parsed = inquirySchema.safeParse(
      inquiryFromFormData(form([['kind', 'quick'], ['name', '김'], ['phone', '010-1111-2222']])),
    );
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.issues[0].message).toContain('동의');
  });

  it('간편 상담 — 이름·연락처·동의', () => {
    const ok = inquirySchema.safeParse(
      inquiryFromFormData(
        form([
          ['kind', 'quick'],
          ['name', '김철수'],
          ['phone', '01012345678'],
          ['inquiryType', '유지보수'],
          ['privacyConsent', 'true'],
        ]),
      ),
    );
    expect(ok.success).toBe(true);
  });

  it('유지보수 — 작업은 여러 개, 메일 연락처면 회신 주소로 쓴다', () => {
    const parsed = inquirySchema.safeParse(
      inquiryFromFormData(
        form([
          ['kind', 'maintenance'],
          ['url', 'www.example.co.kr'],
          ['mode', '월 단위 구독'],
          ['work', '월간 백업'],
          ['work', '콘텐츠 수정'],
          ['name', '예시상사'],
          ['reach', 'admin@example.co.kr'],
          ['privacyConsent', 'true'],
        ]),
      ),
    );
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const mail = renderInquiryMail(parsed.data);
    expect(mail.subject).toContain('유지보수 신청');
    expect(mail.replyTo).toBe('admin@example.co.kr');
    expect(mail.html).toContain('월간 백업, 콘텐츠 수정');
  });

  it('알 수 없는 kind는 거부한다', () => {
    expect(inquirySchema.safeParse({ kind: 'other', privacyConsent: true }).success).toBe(false);
  });
});

describe('알림 메일', () => {
  it('입력값을 이스케이프하고 첨부 목록을 적는다', () => {
    const mail = renderInquiryMail(
      {
        kind: 'project',
        projectType: '신규 제작',
        company: '<회사>',
        name: '홍',
        phone: '010-1234-5678',
        email: 'a@b.co',
        currentSite: '',
        refUrls: [],
        budget: '',
        deadline: '',
        message: '<script>x</script>',
        privacyConsent: true,
      },
      [{ name: '제안요청서.pdf', size: 2 * 1024 * 1024 }],
    );
    expect(mail.html).not.toContain('<script>x</script>');
    expect(mail.html).toContain('&lt;회사&gt;');
    expect(mail.html).toContain('제안요청서.pdf (2.0 MB)');
    expect(mail.replyTo).toBe('a@b.co');
  });
});

describe('첨부파일 제한', () => {
  const MB = 1024 * 1024;
  it('허용 형식·용량이면 통과', () => {
    expect(checkAttachments([{ name: 'rfp.hwp', size: 3 * MB }, { name: 'logo.PNG', size: MB }])).toBeNull();
  });
  it('실행 파일 등은 거부', () => {
    expect(checkAttachments([{ name: 'setup.exe', size: 10 }])).toContain('지원하지 않는');
  });
  it('개수·파일당·합계 용량 제한', () => {
    const f = { name: 'a.pdf', size: MB };
    expect(checkAttachments([f, f, f, f])).toContain('최대 3개');
    expect(checkAttachments([{ name: 'big.pdf', size: 11 * MB }])).toContain('10MB');
    expect(
      checkAttachments([
        { name: 'a.pdf', size: 9 * MB },
        { name: 'b.pdf', size: 9 * MB },
        { name: 'c.pdf', size: 9 * MB },
      ]),
    ).toContain('25MB');
  });
});
