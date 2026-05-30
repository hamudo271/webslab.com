import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RelatedPosts } from './RelatedPosts';

describe('RelatedPosts', () => {
  it('renders a card per slug with title and link', () => {
    // columnPosts must contain at least these slugs for the test to pass.
    render(<RelatedPosts slugs={['renewal-vs-rebuild', 'seo-checklist-for-b2b']} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/column/renewal-vs-rebuild');
    expect(links[1]).toHaveAttribute('href', '/column/seo-checklist-for-b2b');
  });

  it('silently skips unknown slugs', () => {
    render(<RelatedPosts slugs={['nope-does-not-exist']} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
