import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { INDEXNOW_KEY, indexNowPayload } from './indexnow';

describe('IndexNow', () => {
  it('키 파일이 public에 있고 내용이 키와 같다', () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{32}$/);
    const file = path.join(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`);
    expect(fs.readFileSync(file, 'utf8')).toBe(INDEXNOW_KEY);
  });

  it('주소는 절대 주소로, 중복 없이', () => {
    const p = indexNowPayload(['/column/a', '/column', '/column'], 'https://webslab.co.kr');
    expect(p.host).toBe('webslab.co.kr');
    expect(p.keyLocation).toBe(`https://webslab.co.kr/${INDEXNOW_KEY}.txt`);
    expect(p.urlList).toEqual(['https://webslab.co.kr/column/a', 'https://webslab.co.kr/column']);
  });
});
