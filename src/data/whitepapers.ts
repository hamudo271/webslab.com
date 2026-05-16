export type Whitepaper = {
  slug: string;
  title: string;
  description: string;
  pages: number;
  category: string;
  cover: string;
  fileUrl?: string;
};

const cover = (seed: string) => `https://picsum.photos/seed/wp-${seed}/900/1200`;

export const whitepapers: Whitepaper[] = [
  {
    slug: 'business-website-buyers-guide-2025',
    title: '2025 기업 홈페이지 구매자 가이드',
    description: '제작 견적·일정·계약 시 반드시 확인해야 할 30가지 항목을 정리한 실무 가이드.',
    pages: 38,
    category: '구매자 가이드',
    cover: cover('1'),
  },
  {
    slug: 'modern-stack-for-corporate-site',
    title: '기업 홈페이지를 위한 모던 기술 스택 백서',
    description: 'Next.js / Headless CMS / Edge Hosting 조합으로 빠르고 안전한 사이트를 만드는 방법.',
    pages: 26,
    category: '기술',
    cover: cover('2'),
  },
  {
    slug: 'kr-seo-playbook',
    title: '한국 시장을 위한 SEO 플레이북',
    description: '네이버·구글·다음에서 동시에 노출되는 사이트 구조와 콘텐츠 전략.',
    pages: 32,
    category: 'SEO',
    cover: cover('3'),
  },
];
