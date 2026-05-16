import type { LucideIcon } from 'lucide-react';
import {
  MessageCircle,
  Search,
  Map,
  Palette,
  Smartphone,
  Sparkles,
  TrendingUp,
  Settings,
  ShieldCheck,
  Wrench,
  RefreshCw,
} from 'lucide-react';

export type BizCard = {
  no: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const bizCards: BizCard[] = [
  {
    no: '01',
    icon: MessageCircle,
    title: '무료 사전 상담',
    description: '프로젝트 목적·예산·일정을 함께 짚고, 귀사 상황에 맞는 최적 방향을 제시합니다.',
  },
  {
    no: '02',
    icon: Search,
    title: '경쟁사 분석',
    description: '업종 레퍼런스와 경쟁사 벤치마킹을 통해 차별화 포인트를 도출합니다.',
  },
  {
    no: '03',
    icon: Map,
    title: '사이트맵 설계',
    description: 'SEO와 전환을 함께 고려한 정보 구조를 설계해 드립니다.',
  },
  {
    no: '04',
    icon: Palette,
    title: '전용 시안 제작',
    description: '계약 전, 귀사 전용 메인 시안을 먼저 제작해 드립니다. 보고 결정하세요.',
  },
  {
    no: '05',
    icon: Smartphone,
    title: '반응형 구현',
    description: 'PC·태블릿·모바일, 하나의 디자인으로 모든 화면에 완벽 대응합니다.',
  },
  {
    no: '06',
    icon: Sparkles,
    title: '맞춤 디자인',
    description: '템플릿 조립이 아닌, 브랜드에 맞춘 100% 커스텀 디자인을 제공합니다.',
  },
  {
    no: '07',
    icon: TrendingUp,
    title: 'SEO 최적화',
    description: '검색 노출에 유리한 구조·속도·메타 세팅을 기본 제공합니다.',
  },
  {
    no: '08',
    icon: Settings,
    title: '맞춤형 CMS',
    description: '고객사가 직접 콘텐츠를 수정·관리할 수 있는 관리자 페이지를 구축합니다.',
  },
  {
    no: '09',
    icon: ShieldCheck,
    title: '오픈 후 안정화',
    description: '오픈 직후 2주간 이슈 대응 및 안정화를 무상으로 지원합니다.',
  },
  {
    no: '10',
    icon: Wrench,
    title: '1년간 무상 유지보수',
    description: '운영·백업·보안 업데이트와 작은 수정까지, 월 단위로 안심 운영합니다.',
  },
  {
    no: '11',
    icon: RefreshCw,
    title: '콘텐츠 업데이트',
    description: '배너·포트폴리오·공지 등 신규 콘텐츠를 지속적으로 반영해 드립니다.',
  },
];
