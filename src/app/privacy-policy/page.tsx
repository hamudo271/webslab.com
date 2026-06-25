// TODO: 본 문서는 PIPA(개인정보 보호법) 표준 템플릿을 바탕으로 작성된 DRAFT 입니다.
// TODO: 서비스 오픈 전, 법무 검토를 받아 실제 운영에 맞게 수정해 주세요.

import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { LegalDoc, LegalBanner } from '@/components/common/LegalDoc';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { brand } from '@/config/brand';

export const metadata = buildMetadata({
  title: '개인정보 처리방침',
  description: '웹스랩의 개인정보 수집·이용·보관 정책.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[{ name: '홈', path: '/' }, { name: '개인정보 처리방침', path: '/privacy-policy' }]}
      />
      <section className="pt-32 pb-16 md:pt-44 md:pb-24">
        <Container size="narrow">
          <Heading as="h1" size="h1">개인정보 처리방침</Heading>
          <p className="mt-4 text-sm text-text-muted">시행일: 2025-01-01</p>

          <div className="mt-12">
            <LegalBanner />
            <LegalDoc>
              <p>
                {brand.nameKo}(이하 &quot;회사&quot;)은 정보주체의 자유와 권리를 보호하기 위해
                「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고
                안전하게 관리하고 있습니다.
              </p>

              <h2>1. 수집하는 개인정보 항목</h2>
              <ul>
                <li>필수: 이름, 이메일, 문의 내용</li>
                <li>선택: 회사명, 연락처, 예산 정보</li>
                <li>자동 수집: 접속 IP, 쿠키, 접속 일시, 이용 기록</li>
              </ul>

              <h2>2. 개인정보 수집 및 이용 목적</h2>
              <ul>
                <li>문의·상담 응대 및 견적 회신</li>
                <li>서비스 제공 및 계약 이행</li>
                <li>법령 또는 이용약관 위반 행위 대응</li>
              </ul>

              <h2>3. 개인정보 보유 및 이용 기간</h2>
              <p>
                회사는 법령에서 정한 보유 기간 또는 정보주체로부터 동의받은 보유 기간 동안
                개인정보를 보관하며, 보유 기간 종료 시 지체 없이 파기합니다.
              </p>
              <ul>
                <li>문의 응대 기록: 응대 종료 후 3년</li>
                <li>계약 관련 기록: 계약 종료 후 5년 (전자상거래법)</li>
                <li>접속 로그: 3개월 (통신비밀보호법)</li>
              </ul>

              <h2>4. 개인정보의 제3자 제공</h2>
              <p>
                회사는 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및
                제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>

              <h2>5. 정보주체의 권리</h2>
              <p>
                정보주체는 언제든지 개인정보 열람·정정·삭제·처리정지를 요구할 수 있습니다.
                요청은 아래 연락처로 접수해 주시기 바랍니다.
              </p>
              <ul>
                <li>이메일: {brand.email}</li>
                <li>전화: {brand.phone}</li>
              </ul>

              <h2>6. 개인정보 보호책임자</h2>
              <ul>
                <li>책임자: {brand.legal.representativeName}</li>
                <li>연락처: {brand.email}</li>
              </ul>

              <h2>7. 개인정보 처리방침의 변경</h2>
              <p>
                본 방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제,
                정정이 있는 경우에는 변경 사항의 시행 7일 전부터 본 사이트를 통해 고지할
                것입니다.
              </p>
            </LegalDoc>
          </div>
        </Container>
      </section>
    </>
  );
}
