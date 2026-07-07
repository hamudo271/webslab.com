// 한글 제목 → URL-safe 슬러그 자동 변환 (국어 로마자 표기 근사)
// 정확한 언어학적 표기가 아니라 "안정적·읽기 쉬운·중복 없는" 슬러그 생성이 목적.

const CHO = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const JUNG = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const JONG = ['', 'k', 'k', 'ks', 'n', 'nj', 'nh', 't', 'l', 'lk', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'p', 'ps', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 'h'];

// 완성형 한글 음절 하나를 로마자로
function romanizeSyllable(code: number): string {
  const s = code - 0xac00;
  const cho = Math.floor(s / 588);
  const jung = Math.floor((s % 588) / 28);
  const jong = s % 28;
  return CHO[cho] + JUNG[jung] + JONG[jong];
}

export function romanizeHangul(str = ''): string {
  let out = '';
  for (const ch of String(str)) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 0xac00 && code <= 0xd7a3) out += romanizeSyllable(code) + ' ';
    else out += ch;
  }
  return out;
}

// 제목 → 기본 슬러그 (한글 로마자화 후 소문자·하이픈 정규화)
export function baseSlug(title = ''): string {
  const romanized = romanizeHangul(title);
  const slug = romanized
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-') // 영숫자 외 → 하이픈
    .replace(/^-+|-+$/g, '') // 양끝 하이픈 제거
    .slice(0, 80)
    .replace(/-+$/g, '');
  return slug || 'post';
}
