export type Duration = '1~3개월' | '3~6개월' | '6~12개월' | '12개월 이상';
export type Industry = 'MANUFACTURING' | 'LOGISTICS' | 'IT_SOLUTION' | 'PUBLIC' | 'HEALTHCARE' | 'EDUCATION' | 'BRAND';

export type Portfolio = {
  slug: string;
  title: string;
  client: string;
  category: string;
  industry: Industry;
  /** 확인된 경우에만 적는다 — 없으면 표시하지 않는다 */
  duration?: Duration;
  services: string[];
  year: number;
  modifiedAt: string;
  summary: string;
  description: string;
  cover: string;
  /**
   * 사이트 전체를 위에서 아래까지 담은 세로 긴 스크린샷(720px 폭).
   * 카드에 hover하면 이 이미지가 위로 흘러 페이지 전체를 훑는다.
   * 실사이트가 없거나 캡처 전인 항목은 비워두면 cover가 정적으로 노출된다.
   */
  fullShot?: string;
  gallery: string[];
  url?: string;
  results?: { label: string; value: string }[];
};

const cover = (slug: string) => `/images/portfolio/${slug}.webp`;
const fullShot = (slug: string) => `/images/portfolio/${slug}-full.webp`;

export const portfolios: Portfolio[] = [
  {
    slug: 'roland-korea',
    title: '코스모스악기 · Roland Korea 브랜드 사이트',
    client: '코스모스악기',
    category: '신규 제작',
    industry: 'BRAND',
    duration: '6~12개월',
    services: ['UI/UX', '브랜드 사이트', 'CMS 구축', '미디어 큐레이션'],
    year: 2024,
    modifiedAt: '2026-11-04',
    summary: 'Roland 글로벌 브랜드의 한국 공식 사이트',
    description:
      'Roland 글로벌 브랜드의 한국 공식 사이트. 제품 카탈로그·영상·뉴스를 마케팅 팀이 직접 운영하도록 CMS 기반으로 신규 구축했습니다.',
    cover: cover('roland-korea'),
    fullShot: fullShot('roland-korea'),
    gallery: [],
    url: 'https://rolandkorea.com',
    results: [
      { label: '제품 카테고리', value: '9개' },
      { label: '콘텐츠 모듈', value: '3개' },
    ],
  },
  {
    slug: 'byeolha-studycafe',
    title: '별하 스터디카페 브랜드 사이트',
    client: '별하 스터디카페',
    category: '브랜드 사이트',
    industry: 'BRAND',
    duration: '1~3개월',
    services: ['UI/UX', '브랜드 사이트', '반응형 웹'],
    year: 2024,
    modifiedAt: '2026-11-04',
    summary: '프리미엄 스터디카페 브랜드 사이트',
    description:
      '학습 공간의 분위기와 이용 정보를 직관적으로 전달하는 브랜드 사이트. 지점·요금·예약 안내를 깔끔하게 정리해 방문 전 궁금증을 바로 해결하도록 구성했습니다.',
    cover: cover('byeolha-studycafe'),
    fullShot: fullShot('byeolha-studycafe'),
    gallery: [],
    url: 'https://project12.co.kr',
  },
  {
    slug: 'univerlab-media',
    title: '유니버랩 미디어 브랜드 사이트',
    client: '유니버랩 미디어',
    category: '브랜드 사이트',
    industry: 'BRAND',
    duration: '1~3개월',
    services: ['UI/UX', '브랜드 사이트', '반응형 웹', '콘텐츠 큐레이션'],
    year: 2025,
    modifiedAt: '2026-11-04',
    summary: '유튜브·숏폼 영상 마케팅 전문 브랜드 사이트',
    description:
      '유튜브·숏폼 영상의 기획·촬영·편집부터 채널 운영까지 올인원으로 제공하는 영상 마케팅 회사의 공식 브랜드 사이트. 실제 제작 사례를 전면에 배치해 전문성과 성과를 한눈에 전달하도록 구성했습니다.',
    cover: cover('univerlab-media'),
    fullShot: fullShot('univerlab-media'),
    gallery: [],
    url: 'https://univerlabmedia.co.kr',
    results: [
      { label: '서비스 범위', value: '기획·촬영·편집·운영' },
      { label: '콘텐츠 포맷', value: '유튜브·숏폼' },
    ],
  },
  {
    slug: 'blue-ocean-guardians',
    title: '대한잠수협회 공식 사이트',
    client: '대한잠수협회 (Blue Ocean Guardians)',
    category: '협회 공식 사이트',
    industry: 'BRAND',
    duration: '1~3개월',
    services: ['UI/UX', '브랜드 사이트', '반응형 웹'],
    year: 2025,
    modifiedAt: '2026-11-04',
    summary: '바다를 지키는 다이버들의 공식 협회 사이트',
    description:
      '대한잠수협회(Blue Ocean Guardians)의 공식 브랜드 사이트. 수중 활동의 몰입감을 살린 풀스크린 비주얼과 함께 협회 소개·활동·아카이브를 담아, 다이빙 커뮤니티와 후원자가 한눈에 협회를 이해하도록 구성했습니다.',
    cover: cover('blue-ocean-guardians'),
    fullShot: fullShot('blue-ocean-guardians'),
    gallery: [],
    url: 'https://blueoceanguardians.org',
    results: [
      { label: '구성', value: 'About · Services · Archive' },
      { label: '비주얼', value: '풀스크린 수중 히어로' },
    ],
  },
  {
    slug: 'dcd-company',
    title: 'DCD 마케팅·행사 대행사 공식 사이트',
    client: 'DCD',
    category: '신규 제작',
    industry: 'BRAND',
    duration: '1~3개월',
    services: ['UI/UX', '브랜드 사이트', '인터랙티브 웹', '반응형 웹'],
    year: 2026,
    modifiedAt: '2026-11-05',
    summary: '검색·광고·행사 마케팅 대행사 사이트',
    description:
      '청주에서 전국으로 활동하는 마케팅·행사 대행사 DCD의 공식 사이트. 스크롤에 따라 장면이 바뀌는 타이포그래피 연출로 ‘Decide · Creative · Direction’이라는 이름을 보여 주고, SEO·네이버 플레이스·영상·메타 광고·DB 마케팅·홈페이지·행사 일곱 가지 서비스를 한 목록에서 비교하도록 구성했습니다.',
    cover: cover('dcd-company'),
    fullShot: fullShot('dcd-company'),
    gallery: [],
    url: 'https://dcdcompany.com',
    results: [
      { label: '서비스 구성', value: '7개' },
      { label: '연출', value: '스크롤 장면 전환' },
    ],
  },
  {
    slug: 'thefirstmcn',
    title: '더퍼스트제너레이션 MCN 브랜드 사이트',
    client: '더퍼스트제너레이션',
    category: '신규 제작',
    industry: 'BRAND',
    duration: '1~3개월',
    services: ['UI/UX', '브랜드 사이트', '반응형 웹', '콘텐츠 큐레이션'],
    year: 2026,
    modifiedAt: '2026-11-05',
    summary: '광주 영상 제작·MCN 브랜드 사이트',
    description:
      '광주를 기반으로 유튜브 채널 운영 대행, 숏폼·기업 홍보영상 제작, 인플루언서 섭외를 하는 MCN 더퍼스트제너레이션의 공식 사이트. 운영 지표와 실제 제작 영상, 소속 크리에이터 채널을 전면에 배치해 상담 전에 실력을 먼저 확인하도록 구성했습니다.',
    cover: cover('thefirstmcn'),
    fullShot: fullShot('thefirstmcn'),
    gallery: [],
    url: 'https://thefirstmcn.com',
    results: [
      { label: '구성', value: '제작 사례 · 크리에이터 · 후기' },
      { label: '콘텐츠 포맷', value: '유튜브·숏폼' },
    ],
  },
  {
    slug: 'reyourclinic',
    title: '리유아의원 피부과 공식 사이트',
    client: '리유아의원',
    category: '신규 제작',
    industry: 'HEALTHCARE',
    duration: '1~3개월',
    services: ['UI/UX', '병원 사이트', '반응형 웹', '다국어'],
    year: 2026,
    modifiedAt: '2026-11-05',
    summary: '한남동 피부과 의원 공식 사이트',
    description:
      '서울 한남동의 피부과 의원 리유아의원(Re, your clinic)의 공식 사이트. ‘다시, 나를 찾는 공간’이라는 슬로건을 따뜻한 톤의 화면으로 풀고 시술 안내·공지·전후 사진·오시는 길을 담았습니다. 카카오톡 상담·네이버 예약·전화 상담을 화면 옆 빠른 메뉴로 모아 바로 예약으로 이어지게 했고, 한국어·영어로 볼 수 있게 구성했습니다.',
    cover: cover('reyourclinic'),
    fullShot: fullShot('reyourclinic'),
    gallery: [],
    url: 'https://reyourclinic.com',
    results: [
      { label: '예약 동선', value: '카카오톡 · 네이버 예약 · 전화' },
      { label: '언어', value: '한국어 · 영어' },
    ],
  },
  {
    slug: 'apkocdesign',
    title: '어피콕 디자인 상세페이지 에이전시 사이트',
    client: '어피콕 디자인',
    category: '신규 제작',
    industry: 'BRAND',
    duration: '1~3개월',
    services: ['UI/UX', '브랜드 사이트', '반응형 웹', '콘텐츠 큐레이션'],
    year: 2026,
    modifiedAt: '2026-11-05',
    summary: '성과형 상세페이지 에이전시 사이트',
    description:
      '상세페이지 기획·촬영·디자인을 하는 성과형 상세페이지 에이전시 어피콕 디자인(APKOC design)의 공식 사이트. 카테고리별 랭킹 화면과 실제 제작한 상세페이지, 프로젝트 성과를 차례로 보여 주고, 제작 상담 신청과 카카오톡 1:1 문의로 바로 이어지도록 구성했습니다.',
    cover: cover('apkocdesign'),
    fullShot: fullShot('apkocdesign'),
    gallery: [],
    url: 'https://apkocdesign.com',
    results: [
      { label: '구성', value: '랭킹 · 포트폴리오 · 후기' },
      { label: '문의 동선', value: '상담 신청 · 카카오톡' },
    ],
  },
  {
    slug: 'haeun-nuri',
    title: '해운누리한의원 공식 사이트',
    client: '해운누리한의원',
    category: '신규 제작',
    industry: 'HEALTHCARE',
    services: ['UI/UX', '병원 사이트', '반응형 웹'],
    year: 2026,
    modifiedAt: '2026-11-19',
    summary: '부산 해운대 한의원 공식 사이트',
    description:
      '부산 해운대 장산역 1번 출구 앞 해운누리한의원의 공식 사이트. 진료시간·오시는 길·의료진 소개와 입원실 안내, 약침·추나 같은 치료법과 일곱 가지 진료과목을 메뉴로 나눠 담았습니다. 네이버 예약·카카오톡 상담·전화 상담·오시는 길을 화면 옆 빠른 메뉴와 모바일 하단 바에 모아 예약으로 바로 이어지게 구성했습니다.',
    cover: cover('haeun-nuri'),
    fullShot: '/images/portfolio/haeun-nuri-full-v2.webp', // 실제 스크롤로 다시 찍은 판(2026-11-20) — 이름을 바꿔 캐시를 피한다
    gallery: [],
    url: 'https://haeun-nuri.com',
    results: [
      { label: '예약 동선', value: '네이버 예약 · 카카오톡 · 전화' },
      { label: '구성', value: '진료과목 7개 · 입원실 안내 · 의료진 소개' },
    ],
  },
  {
    slug: 'dr-planners',
    title: '닥터플래너스 병원 마케팅 플래닝 사이트',
    client: '닥터플래너스',
    category: '신규 제작',
    industry: 'BRAND',
    services: ['UI/UX', '브랜드 사이트', '인터랙티브 웹', '반응형 웹'],
    year: 2026,
    modifiedAt: '2026-11-19',
    summary: '병원 마케팅 플래닝 회사 공식 사이트',
    description:
      '병원 마케팅을 진단부터 실행까지 맡는 플래닝 회사 닥터플래너스(DR.PLANERS)의 공식 사이트. 스크롤에 따라 장면이 이어지는 첫 화면으로 ‘방향부터 결정합니다’라는 메시지를 전하고, 성장 플래닝·브랜딩·마케팅·홈페이지와 검색 노출 서비스를 차례로 소개합니다. 칼럼과 자주 묻는 질문을 담은 인사이트 메뉴를 두고, 어느 화면에서든 무료 병원 진단 신청으로 이어지게 구성했습니다.',
    cover: cover('dr-planners'),
    fullShot: '/images/portfolio/dr-planners-full-v2.webp', // 실제 스크롤로 다시 찍은 판(2026-11-20) — 이름을 바꿔 캐시를 피한다
    gallery: [],
    url: 'https://dr-planners.com',
    results: [
      { label: '구성', value: '서비스 4개 영역 · 인사이트' },
      { label: '문의 동선', value: '무료 병원 진단 · 상담하기' },
    ],
  },
  {
    slug: '612-academy',
    title: '612 어학원 공식 사이트',
    client: '612 어학원',
    category: '신규 제작',
    industry: 'EDUCATION',
    services: ['UI/UX', '브랜드 사이트', '반응형 웹'],
    year: 2026,
    modifiedAt: '2026-11-19',
    summary: 'OPIc·영어회화·중국어 어학원 공식 사이트',
    description:
      'OPIc·영어회화·TOEIC Speaking·중국어회화·SPA·TSC를 가르치는 612 어학원의 공식 사이트. 수업 장면 사진을 모자이크처럼 배치한 첫 화면에 이어 학원 소개, 영어·중국어 과정, 강사 소개, 수강 후기를 차례로 보여 줍니다. 수강신청 메뉴와 지점별 카카오톡 채널·전화문의·상담신청 버튼으로 바로 문의할 수 있게 구성했습니다.',
    cover: cover('612-academy'),
    fullShot: '/images/portfolio/612-academy-full-v2.webp', // 실제 스크롤로 다시 찍은 판(2026-11-20) — 이름을 바꿔 캐시를 피한다
    gallery: [],
    url: 'https://612.co.kr',
    results: [
      { label: '구성', value: '영어·중국어 과정 · 강사 소개 · 수강 후기' },
      { label: '문의 동선', value: '수강신청 · 카카오톡 · 상담신청' },
    ],
  },
  {
    slug: 'hwangchil-korea',
    title: '황칠코리아 기업 공식 사이트',
    client: '황칠코리아',
    category: '리뉴얼',
    industry: 'MANUFACTURING',
    services: ['UI/UX', '기업 사이트', '반응형 웹', '다국어'],
    year: 2026,
    modifiedAt: '2026-11-20',
    summary: '황칠 건강식품 기업 공식 사이트',
    description:
      '황칠 건강식품을 만드는 (주)황칠코리아의 공식 사이트. 기업 소개와 황칠재배단지 등 사업 영역, 황칠진액·차 같은 제품, 지속가능성, 홍보센터를 메뉴로 나누고, 첫 화면에서 제품 목록과 공식 스마트스토어·언론보도로 바로 이어지게 구성했습니다. 한국어·영어·중국어 세 가지 언어로 볼 수 있습니다.',
    cover: cover('hwangchil-korea'),
    fullShot: fullShot('hwangchil-korea'),
    gallery: [],
    url: 'https://dpkorea.com',
    results: [
      { label: '구성', value: '기업소개 · 사업영역 · 제품 · 홍보센터' },
      { label: '언어', value: '한국어 · 영어 · 중국어' },
    ],
  },
  {
    slug: 'samryoong',
    title: '삼륭물산 기업 공식 사이트',
    client: '삼륭물산',
    category: '리뉴얼',
    industry: 'MANUFACTURING',
    services: ['UI/UX', '기업 사이트', '반응형 웹', '다국어'],
    year: 2026,
    modifiedAt: '2026-11-20',
    summary: '액체 포장 용기 제조 기업 공식 사이트',
    description:
      '액체 포장 용기 카톤팩을 만드는 삼륭물산(주)의 공식 사이트. 회사소개, 카톤팩 제품과 공정도·공장 소개, 물류센터 임대사업, 기업개황과 공시를 담은 투자정보, 공지사항을 메뉴로 나눠 담았습니다. 한국어·영어·일본어 세 가지 언어로 볼 수 있고, 문의하기로 바로 연락할 수 있게 구성했습니다.',
    cover: cover('samryoong'),
    fullShot: fullShot('samryoong'),
    gallery: [],
    url: 'https://www.srpack.com',
    results: [
      { label: '구성', value: '제품 · 임대사업 · 투자정보' },
      { label: '언어', value: '한국어 · 영어 · 일본어' },
    ],
  },
  {
    slug: 'success-inside',
    title: '성공인사이드 인터뷰 미디어 사이트',
    client: '성공인사이드',
    category: '리뉴얼',
    industry: 'BRAND',
    services: ['UI/UX', '미디어 사이트', '반응형 웹', '콘텐츠 아카이브'],
    year: 2026,
    modifiedAt: '2026-11-20',
    summary: '사업가 인터뷰 미디어 사이트',
    description:
      '사업가의 하루를 기록하는 인터뷰 미디어 성공인사이드의 공식 사이트. 첫 화면에 인터뷰 수와 조회수 같은 채널 수치를 보여 주고, 많이 본 인터뷰와 업종별로 골라 볼 수 있는 인터뷰 아카이브, 교육 과정, 칼럼을 차례로 담았습니다. 어느 화면에서든 출연 신청으로 이어지게 구성했습니다.',
    cover: cover('success-inside'),
    fullShot: fullShot('success-inside'),
    gallery: [],
    url: 'https://successinside.kr',
    results: [
      { label: '구성', value: '인터뷰 아카이브 · 교육과정 · 칼럼' },
      { label: '문의 동선', value: '출연 신청' },
    ],
  },
  {
    slug: 'kordc',
    title: '한국배관협회 공식 사이트',
    client: '한국배관협회',
    // 웹스랩 단독 제작이 아니라 협업으로 참여한 사례(사용자 확인 2026-11-20) — 단독 제작처럼 쓰지 않는다
    category: '협업',
    industry: 'BRAND',
    services: ['서비스 사이트', '반응형 웹'],
    year: 2026,
    modifiedAt: '2026-11-20',
    summary: '배관 수리 서비스 협회 공식 사이트',
    description:
      '변기·싱크대·하수구 막힘과 누수 탐지 같은 배관 수리를 정가 기준으로 안내하는 한국배관협회의 공식 사이트. 첫 화면에서 작업별 표준 정가와 고객 후기, 시공 전후 사진, 진행 절차, 자주 묻는 질문을 차례로 보여 주고, 상담센터 전화와 무료 상담 신청·실시간 상담 버튼으로 바로 문의할 수 있게 구성된 사이트입니다. 웹스랩이 협업으로 참여했습니다.',
    cover: cover('kordc'),
    fullShot: fullShot('kordc'),
    gallery: [],
    url: 'https://kordc.org',
    results: [
      { label: '구성', value: '표준 정가표 · 시공 사례 · FAQ' },
      { label: '문의 동선', value: '상담센터 전화 · 무료 상담 신청 · 실시간 상담' },
    ],
  },
];
