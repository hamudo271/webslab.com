import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { ButtonLink } from '@/components/common/Button';

export default function NotFound() {
  return (
    <Container className="flex min-h-screen items-center pt-20">
      <div className="py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <Heading as="h1" size="h1" className="mt-4">
          페이지를 찾을 수 없습니다
        </Heading>
        <p className="mt-4 text-text-secondary">
          요청하신 페이지가 이동되었거나 더 이상 존재하지 않습니다.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/" variant="primary">홈으로 돌아가기</ButtonLink>
          <ButtonLink href="/contact" variant="outline">문의하기</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
