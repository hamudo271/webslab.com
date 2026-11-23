// 공지사항 — 이 파일만 고치면 /notice 목록과 /notice/<번호> 본문, 사이트맵·llms.txt가 함께 바뀐다.
// 정직성 원칙: 사이트에 이미 적힌 사실(문의 방법·회신 시간·무료 시안·하자보수·서비스 범위·실제 사례)만 쓴다.
// 휴무·이벤트·가격처럼 확인되지 않은 내용은 넣지 않는다.

import { brand } from '@/config/brand';

const MAIL = `<a href="mailto:${brand.email}">${brand.email}</a>`;

export type Notice = {
  /** 글 번호 — 겹치지 않게, 새 글일수록 큰 수. 주소(/notice/<no>)가 되므로 한번 쓴 번호는 바꾸지 않는다. */
  no: number;
  /** true면 목록 맨 위에 '공지'로 고정 */
  pinned?: boolean;
  /** 올린 날 'YYYY-MM-DD' */
  date: string;
  title: string;
  /** 문단 배열. 문단 안에는 <strong>, <a href="..."> 정도만 쓴다. */
  body: string[];
};

export const notices: Notice[] = [
  {
    no: 13,
    date: '2026-11-23',
    title: '가이드센터 칼럼 확대 안내 — 업종별·리뉴얼·유지보수·제작 준비 가이드',
    body: [
      '<a href="/column">가이드센터</a>에 이번 달에만 새 가이드 55편을 더해, 2026년 11월 23일 기준 70편이 넘는 글을 보실 수 있습니다. 홈페이지를 처음 만드는 분부터 리뉴얼과 운영을 맡은 담당자까지, 상담 전에 궁금한 내용을 미리 확인하실 수 있도록 정리했습니다.',
      '<strong>업종별 가이드</strong> — <a href="/column/oriental-clinic-website">한의원</a>, <a href="/column/law-firm-website">법률사무소</a>, <a href="/column/tax-accounting-website">세무사</a>, <a href="/column/academy-website">학원</a>, <a href="/column/food-company-website">식품 회사</a>, <a href="/column/startup-website">스타트업</a>, <a href="/column/franchise-website">프랜차이즈</a>처럼 업종마다 필요한 페이지와 확인해야 할 표시·광고 기준을 다뤘습니다.',
      '<strong>리뉴얼·유지보수</strong> — <a href="/column/website-renewal-process">리뉴얼 절차</a>, <a href="/column/website-rfp-writing">제안요청서 쓰는 법</a>, <a href="/column/website-content-migration">데이터 이전</a>, <a href="/column/website-maintenance-cost">유지보수 비용</a>, <a href="/column/website-backup-recovery">백업</a>, <a href="/column/website-down-emergency">접속 오류 대응</a>을 순서대로 읽으실 수 있습니다.',
      '<strong>제작 준비</strong> — <a href="/column/website-creation-guide">웹사이트 제작 가이드</a>, <a href="/column/website-production-process">제작 과정</a>, <a href="/column/website-design-draft">디자인 시안 보는 법</a>, <a href="/column/website-copywriting">원고 작성</a>, <a href="/column/website-image-license">이미지 저작권</a>, <a href="/column/website-menu-structure">메뉴 구성</a>을 새로 실었습니다.',
      '새 글은 <a href="/rss.xml">RSS</a>로도 받아 보실 수 있습니다.',
    ],
  },
  {
    no: 12,
    date: '2026-11-23',
    title: '자주묻는질문을 44개로 늘렸습니다',
    body: [
      '상담 전에 많이 묻는 질문을 6개에서 44개로 늘리고, <strong>비용·일정·상담·제작·검색·운영</strong> 여섯 분류로 나눴습니다.',
      '견적만 받아 봐도 되는지, 디자인 시안은 몇 번까지 수정할 수 있는지, 원고와 사진이 없어도 제작할 수 있는지, 검색 상위 노출을 약속할 수 있는지, 다른 업체에서 만든 사이트의 유지보수를 맡길 수 있는지 같은 질문에 답해 두었습니다.',
      '<a href="/faq">자주묻는질문</a> 페이지의 검색창에 단어를 넣으면 관련 질문만 골라 볼 수 있습니다. 원하는 답이 없으면 <a href="/contact">문의하기</a>로 남겨 주세요. 1영업일 안에 회신드립니다.',
    ],
  },
  {
    no: 11,
    date: '2026-11-23',
    title: '제작 사례 7건 추가 안내',
    body: [
      '<a href="/portfolio">제작사례</a> 메뉴에 사례 7건을 새로 올렸습니다. 지금 실제로 운영 중인 사이트 15곳의 화면을 PC와 모바일로 확인하실 수 있습니다.',
      '<strong>신규 제작</strong> — 예약 동선을 한곳에 모은 <a href="/portfolio/haeun-nuri">해운누리한의원</a>, 스크롤로 메시지를 여는 <a href="/portfolio/dr-planners">닥터플래너스</a>, 뷰파인더 화면으로 스튜디오를 보여 주는 <a href="/portfolio/neo-v">NEO.V</a>.',
      '<strong>리뉴얼</strong> — 제품과 브랜드 이야기를 함께 담은 <a href="/portfolio/hwangchil-korea">황칠코리아</a>, 제품·임대사업·투자정보를 정리한 <a href="/portfolio/samryoong">삼륭물산</a>, 인터뷰 기록을 한곳에 모은 <a href="/portfolio/success-inside">성공인사이드</a>.',
      '<strong>협업</strong> — 정가표와 상담 동선을 앞세운 <a href="/portfolio/kordc">한국배관협회</a>는 웹스랩이 협업으로 참여한 사이트입니다.',
    ],
  },
  {
    no: 10,
    date: '2026-11-23',
    title: '유지보수 신청·비용 안내 페이지 이용 안내',
    body: [
      '오픈 이후의 관리를 맡기실 수 있도록 <a href="/maintenance">유지보수 신청</a>과 <a href="/maintenance/pricing">비용 안내</a> 페이지를 운영하고 있습니다.',
      '맡기실 수 있는 일은 정기 점검·보안 패치, 월간 백업, 콘텐츠 수정, 성능 개선, 기능 개선·추가입니다. 필요할 때 한 번씩 맡기는 <strong>건별</strong> 방식과 매달 꾸준히 관리하는 <strong>월 단위 구독</strong> 가운데 고르실 수 있습니다.',
      '비용은 정해진 요금표 없이 사이트 규모, 요청의 양과 빈도, 작업의 종류를 보고 항목별로 견적을 드립니다. 견적에 동의하신 뒤에 작업을 시작하며, 진행 중에 작업이 늘어나면 비용을 먼저 안내드립니다.',
      '신청은 사이트 주소와 필요한 작업만 남기시면 됩니다. 사이트를 살펴본 뒤 1영업일 안에 작업 범위와 견적을 회신드립니다.',
    ],
  },
  {
    no: 9,
    date: '2026-11-23',
    title: '채용 안내 — 웹 디자이너·퍼블리셔·개발자·기획 4개 분야',
    body: [
      '웹스랩과 함께할 분을 찾습니다. 모집 분야는 <strong>웹 디자이너, 웹 퍼블리셔·프론트엔드, 백엔드·풀스택 개발자, 웹 기획·PM</strong> 네 가지입니다.',
      '지원은 <a href="/careers">채용</a> 페이지의 지원서로 받습니다. 지원 분야와 이름, 연락처만 필수이고, 이력서와 포트폴리오는 있는 만큼 보내 주시면 됩니다(파일 최대 3개, 파일당 10MB).',
      '절차는 지원서 접수 → 서류 검토 → 면접 → 합류 순서입니다. 자격 요건과 근무 형태·조건은 지원서를 검토한 뒤 면접에서 자세히 안내드립니다.',
      `채용 문의는 ${MAIL}로 보내 주세요.`,
    ],
  },
  {
    no: 8,
    date: '2026-11-23',
    title: '프로그램 개발·업무 자동화 서비스 안내',
    body: [
      '웹스랩은 홈페이지 제작과 함께 <a href="/program">프로그램 개발·업무 자동화</a>도 진행합니다. 엑셀·웹·메신저·문서에서 반복되는 업무를 맞춤 프로그램으로 바꿔 드립니다.',
      '<strong>엑셀 업무 자동화</strong> — 재고·정산·리포트처럼 반복되는 엑셀 작업을 자동으로 집계하고 만듭니다. <strong>데이터 수집</strong> — 여러 사이트에 흩어진 정보를 자동으로 모아 엑셀이나 DB로 정리합니다.',
      '<strong>메신저·메일 자동화</strong> — 발송과 알림을 정해진 규칙대로 처리합니다. <strong>사내 관리 프로그램</strong> — 재고·인력·일정처럼 업무에 맞는 관리 도구를 맞춤 제작합니다.',
      '어떤 업무가 자동화에 맞는지 모르셔도 괜찮습니다. 지금 반복하고 있는 일을 <a href="/contact">문의하기</a>에 적어 주시면 가능한 범위를 정리해 회신드립니다. 자동화를 검토하는 순서는 <a href="/column/business-automation-program">업무 자동화 프로그램 개발 가이드</a>에서 먼저 보실 수 있습니다.',
    ],
  },
  {
    no: 7,
    date: '2026-11-23',
    title: '원고·사진이 없어도 시작할 수 있습니다 — 홈페이지 준비자료 안내',
    body: [
      '홈페이지를 만들 때 자료를 전부 갖추고 시작하실 필요는 없습니다. 있는 것만 보내 주시면 나머지는 질문지와 웹스랩의 작업으로 채웁니다.',
      '<strong>원고가 없다면</strong> 질문지에 답만 해 주세요. 답을 바탕으로 웹스랩이 문장을 정리해 원고를 만듭니다. <strong>사진이 없다면</strong> 정품 이미지 라이선스(30만 컷 이상)에서 업종에 맞는 사진을 골라 쓰며, 추가 비용이 없습니다.',
      '<strong>로고가 없다면</strong> 회사 이름으로 먼저 메인 시안을 잡아 보여드리고, <strong>메뉴 구조를 정하지 못했다면</strong> 상담 뒤 웹스랩이 사이트맵과 페이지 구조를 설계해 제안드립니다. <strong>도메인과 호스팅이 없어도</strong> 운영 환경을 웹스랩이 직접 세팅해 납품합니다.',
      '<a href="/service">서비스 안내</a>의 홈페이지 준비자료에서 지금 가지고 있는 자료를 골라 보시면, 직접 준비할 것과 웹스랩이 맡는 것을 바로 나눠 볼 수 있습니다. 준비 순서는 <a href="/column/website-preparation-checklist">홈페이지 제작 준비물 가이드</a>에도 정리해 두었습니다.',
    ],
  },
  {
    no: 6,
    date: '2026-11-23',
    title: '무료 제공 항목 10가지 안내',
    body: [
      '웹스랩은 제작과 사후 운영에 필요한 10가지를 무상으로 제공합니다. 견적서를 비교하실 때 아래 항목이 포함되어 있는지 함께 확인해 보세요.',
      '<strong>운영</strong> — 납품 후 1년 무상 하자보수, 콘텐츠를 직접 고치는 디자인모드, 트래픽과 문의를 한눈에 보는 관리자 통계·설정, 관리 방법을 담은 운영 매뉴얼 PDF.',
      '<strong>검색·분석</strong> — 구글 애널리틱스 세팅, 구글 서치콘솔 등록, 네이버 서치어드바이저 등록.',
      '<strong>품질</strong> — 정품 이미지 라이선스(30만 컷 이상), Chrome·Safari·Edge 크로스브라우징, 웹표준 준수.',
      '항목별 설명은 <a href="/service">서비스 안내</a>에서, 견적서를 비교하는 방법은 <a href="/column/website-quote-comparison">홈페이지 제작 견적서 가이드</a>에서 보실 수 있습니다.',
    ],
  },
  {
    no: 5,
    date: '2026-11-23',
    title: '회사소개서 내려받기 안내',
    body: [
      '웹스랩 회사소개서를 PDF로 받아 보실 수 있습니다. 모든 페이지 아래쪽의 <strong>회사소개서 다운로드</strong>를 누르시거나, <a href="/assets/webslab/files/webslab-company-profile.pdf">이 링크</a>에서 바로 받으실 수 있습니다(PDF · 15쪽 · 2.2MB).',
      '회사 안에서 검토하거나 보고하실 때 함께 쓰실 수 있습니다. 더 궁금한 내용은 <a href="/contact">문의하기</a>로 남겨 주세요.',
    ],
  },
  {
    no: 4,
    pinned: true,
    date: '2026-11-04',
    title: '프로젝트 문의·상담 안내',
    body: [
      '프로젝트 문의는 <a href="/contact">문의하기</a> 페이지의 견적 문의서로 남겨 주세요. 남겨 주신 내용을 확인한 뒤 <strong>1영업일 안에</strong> 회신드립니다.',
      `전화·카카오톡(${brand.phone})이나 메일(${MAIL})로도 문의하실 수 있습니다. 상담 시간은 <strong>평일 10시부터 18시까지</strong>이며 주말과 공휴일은 쉽니다.`,
      '아직 정리된 기획서가 없어도 괜찮습니다. 프로젝트 목적, 현재 사이트 유무, 참고 사이트, 희망 오픈일 정도만 알려 주시면 상담이 훨씬 빠르고 정확해집니다.',
    ],
  },
  {
    no: 3,
    date: '2026-11-04',
    title: '웹스랩 홈페이지 리뉴얼 안내',
    body: [
      '웹스랩 홈페이지가 새롭게 단장했습니다.',
      '메인 화면에서 실제 제작 사례를 브라우저 화면 그대로 넘겨 보실 수 있고, <a href="/service">서비스 안내</a>에서는 무료 제공 항목과 제작 절차를 한눈에 확인하실 수 있도록 구성을 바꿨습니다.',
      '고객지원 메뉴에서 공지사항과 <a href="/faq">자주묻는질문</a>, <a href="/column">가이드센터</a>도 함께 확인해 보세요.',
    ],
  },
  {
    no: 2,
    date: '2026-11-04',
    title: '계약 전 메인 시안 무료 제공 안내',
    body: [
      '웹스랩은 계약 전에 <strong>메인 페이지 시안을 무료로</strong> 먼저 보여드립니다.',
      '디자인 방향이 원하시는 모습과 맞는지 직접 확인하신 뒤 계약 여부를 정하실 수 있습니다. 로고가 아직 없다면 회사 이름으로 먼저 시안을 잡아 보여드립니다.',
      '시안 요청은 <a href="/contact">문의하기</a> 페이지에서 남겨 주세요.',
    ],
  },
  {
    no: 1,
    date: '2026-11-04',
    title: '납품 후 1년 무상 하자보수 안내',
    body: [
      '웹스랩이 제작한 홈페이지는 납품 후 <strong>1년 동안</strong>, 제작 범위 안에서 생긴 결함을 무상으로 수정해 드립니다.',
      '콘텐츠 수정이나 기능 추가처럼 결함이 아닌 작업은 필요할 때 선택하는 <a href="/maintenance">유지보수</a>로 진행합니다. 자세한 내용은 <a href="/faq">자주묻는질문</a>에서 확인하실 수 있습니다.',
    ],
  },
];
