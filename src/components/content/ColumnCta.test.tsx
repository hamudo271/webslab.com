import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ColumnCta } from './ColumnCta';

describe('ColumnCta', () => {
  it('links to the contextual service and project contact', () => {
    render(
      <ColumnCta
        title="기업 홈페이지 제작을 검토하고 있나요?"
        description="필요한 범위를 함께 정리합니다."
        serviceHref="/service"
        serviceLabel="기업 홈페이지 제작 서비스"
        fromPath="/column/corporate-website-cost"
      />,
    );

    expect(screen.getByRole('link', { name: '기업 홈페이지 제작 서비스' })).toHaveAttribute(
      'href',
      '/service',
    );
    expect(screen.getByRole('link', { name: '프로젝트 문의' })).toHaveAttribute(
      'href',
      '/contact',
    );
  });
});
