// TODO: 본 문서는 일반적인 IT/디자인 외주 계약 관행을 바탕으로 작성된 DRAFT 입니다.
// TODO: 서비스 오픈 전, 법무 검토를 받아 실제 사업에 맞게 수정해 주세요.

import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { LegalDoc, LegalBanner } from '@/components/common/LegalDoc';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { brand } from '@/config/brand';

export const metadata = buildMetadata({
  title: '이용약관',
  description: '웹슬랩 서비스 이용에 관한 약관.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[{ name: '홈', path: '/' }, { name: '이용약관', path: '/terms' }]}
      />
      <section className="pt-32 pb-16 md:pt-44 md:pb-24">
        <Container size="narrow">
          <Heading as="h1" size="h1">이용약관</Heading>
          <p className="mt-4 text-sm text-text-muted">시행일: 2025-01-01</p>

          <div className="mt-12">
            <LegalBanner />
            <LegalDoc>
              <h2>제1조 (목적)</h2>
              <p>
                본 약관은 {brand.nameKo}(이하 &quot;회사&quot;)이 운영하는 웹사이트 및 관련 서비스의
                이용 조건과 절차, 회사와 이용자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
              </p>

              <h2>제2조 (용어의 정의)</h2>
              <ul>
                <li>&quot;서비스&quot;란 회사가 제공하는 웹사이트 제작·운영·컨설팅 등 일체의 서비스를 말합니다.</li>
                <li>&quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 자를 말합니다.</li>
                <li>&quot;콘텐츠&quot;란 서비스를 통해 제공되는 글, 이미지, 영상 등의 정보를 말합니다.</li>
              </ul>

              <h2>제3조 (약관의 게시 및 개정)</h2>
              <p>
                회사는 본 약관을 웹사이트 화면에 게시하며, 필요 시 관련 법령을 위배하지 않는
                범위 내에서 본 약관을 개정할 수 있습니다.
              </p>

              <h2>제4조 (서비스의 제공)</h2>
              <ul>
                <li>홈페이지 신규 제작</li>
                <li>홈페이지 리뉴얼</li>
                <li>운영·유지보수</li>
                <li>관련 컨설팅</li>
              </ul>

              <h2>제5조 (서비스 이용계약)</h2>
              <p>
                서비스 이용계약은 별도의 견적 협의 및 계약서 체결을 통해 성립합니다.
                계약 조건, 비용, 일정 등 세부 사항은 개별 계약서에 따릅니다.
              </p>

              <h2>제6조 (이용자의 의무)</h2>
              <ul>
                <li>회사의 업무에 방해가 되는 행위를 하지 않을 것</li>
                <li>제공된 콘텐츠를 무단으로 복제·배포하지 않을 것</li>
                <li>계약 이행에 필요한 자료를 성실히 제공할 것</li>
              </ul>

              <h2>제7조 (지적재산권)</h2>
              <p>
                서비스 결과물에 대한 저작권은 별도의 계약이 없는 한 회사에 귀속되며,
                이용자는 계약 범위 내에서 사용권을 갖습니다. 결과물 대금이 완납된 시점에
                권리가 양도되도록 별도로 합의할 수 있습니다.
              </p>

              <h2>제8조 (책임의 한계)</h2>
              <p>
                회사는 천재지변, 전쟁, 정전 등 불가항력적 사유로 서비스를 제공할 수 없는
                경우에는 책임을 지지 않습니다. 회사의 고의 또는 중대한 과실이 없는 한,
                간접·특별·결과적 손해에 대해서는 책임을 지지 않습니다.
              </p>

              <h2>제9조 (분쟁 해결)</h2>
              <p>
                서비스 이용과 관련하여 발생한 분쟁은 양측이 우선 협의로 해결하며,
                협의가 이루어지지 않을 경우 회사의 본점 소재지 관할 법원을 전속관할 법원으로 합니다.
              </p>
            </LegalDoc>
          </div>
        </Container>
      </section>
    </>
  );
}
