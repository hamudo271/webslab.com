export type Author = {
  id: string;
  name: string;
  nameKo: string;
  role: string;
  bio: string;
  profileUrl: string;
  sameAs: string[];
};

export const representative: Author = {
  id: 'representative',
  name: '조현도',
  nameKo: '조현도',
  role: 'websLAB 대표',
  bio: '기업 홈페이지 신규 제작과 리뉴얼 프로젝트를 기획부터 운영까지 담당합니다. UI/UX, 데이터 이전, SEO 보존, CMS 운영 구조를 함께 설계합니다.',
  profileUrl: 'https://webslab.co.kr/about',
  sameAs: [],
};

export const authors: Record<string, Author> = {
  representative,
};

export function getAuthor(id: string): Author {
  const a = authors[id];
  if (!a) throw new Error(`Author not found: ${id}`);
  return a;
}
