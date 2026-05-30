import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FaqAccordion } from './FaqAccordion';

const sample = [
  { question: '리뉴얼 시기는?', answer: '3~5년 주기를 권장합니다.' },
  { question: '비용은?', answer: '3천만 ~ 1억원.' },
];

describe('FaqAccordion', () => {
  it('renders all questions visible, answers hidden initially', () => {
    render(<FaqAccordion faqs={sample} />);
    expect(screen.getByText('리뉴얼 시기는?')).toBeInTheDocument();
    expect(screen.queryByText('3~5년 주기를 권장합니다.')).not.toBeVisible();
  });

  it('expands answer when question is clicked', () => {
    render(<FaqAccordion faqs={sample} />);
    fireEvent.click(screen.getByText('리뉴얼 시기는?'));
    expect(screen.getByText('3~5년 주기를 권장합니다.')).toBeVisible();
  });
});
