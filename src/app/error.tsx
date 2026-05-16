'use client';

import { useEffect } from 'react';
import { Container } from '@/components/common/Container';
import { Heading } from '@/components/common/Heading';
import { Button, ButtonLink } from '@/components/common/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-screen items-center pt-20">
      <div className="py-24 text-center">
        <Heading as="h1" size="h1">문제가 발생했습니다</Heading>
        <p className="mt-4 text-text-secondary">
          잠시 후 다시 시도해 주세요. 문제가 계속되면 문의해 주세요.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset} variant="primary">다시 시도</Button>
          <ButtonLink href="/" variant="outline">홈으로</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
