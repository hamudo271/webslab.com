import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GuideLinks } from './GuideLinks';

describe('GuideLinks', () => {
  it('renders descriptive crawlable links', () => {
    render(
      <GuideLinks
        title="관련 가이드"
        links={[{ href: '/column/corporate-website-cost', label: '기업 홈페이지 제작 비용' }]}
      />,
    );

    expect(screen.getByRole('link', { name: '기업 홈페이지 제작 비용' })).toHaveAttribute(
      'href',
      '/column/corporate-website-cost',
    );
  });
});
