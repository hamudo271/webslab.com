import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { LEGACY_REDIRECTS } from './legacy-redirects.mjs';
import { columnPosts } from '@/data/columnPosts';

// 리뉴얼 페이지 경로는 동기화 파일 이름에서 (home → /, maintenance--pricing → /maintenance/pricing)
const sitePaths = fs
  .readdirSync(path.join(process.cwd(), 'src/site/pages'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''))
  .map((n) => (n === 'home' ? '/' : `/${n.replaceAll('--', '/')}`));
const pagePaths = new Set([...sitePaths, ...columnPosts.map((p) => `/column/${p.slug}`)]);

describe('예전 주소 301', () => {
  it.each(LEGACY_REDIRECTS)('$source → $destination 대상이 실제로 있다', ({ source, destination }) => {
    expect(source).not.toBe(destination);
    expect(pagePaths.has(source), '살아 있는 페이지를 돌리면 안 된다').toBe(false);
    if (destination.startsWith('/assets/')) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', destination))).toBe(true);
    } else {
      expect(pagePaths.has(destination)).toBe(true);
    }
  });
});
