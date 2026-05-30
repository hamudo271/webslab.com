import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthorByline } from './AuthorByline';
import { representative } from '@/data/authors';

describe('AuthorByline', () => {
  it('renders author name and role', () => {
    render(<AuthorByline author={representative} publishedAt="2026-06-01" />);
    expect(screen.getByText(representative.name)).toBeInTheDocument();
    expect(screen.getByText(representative.role)).toBeInTheDocument();
  });

  it('renders formatted Korean date', () => {
    render(<AuthorByline author={representative} publishedAt="2026-06-01" />);
    expect(screen.getByText(/2026\.06\.01/)).toBeInTheDocument();
  });
});
