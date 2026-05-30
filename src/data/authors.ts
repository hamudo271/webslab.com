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
  name: '대표자', // Replace with real name when finalized in brand.legal.representativeName
  nameKo: '대표자',
  role: '대표',
  bio: '기업 홈페이지 제작·리뉴얼 전문가.',
  profileUrl: 'https://webslab.co.kr/about',
  sameAs: [], // Add LinkedIn / blog URLs when ready
};

export const authors: Record<string, Author> = {
  representative,
};

export function getAuthor(id: string): Author {
  const a = authors[id];
  if (!a) throw new Error(`Author not found: ${id}`);
  return a;
}
