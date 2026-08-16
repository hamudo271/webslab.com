import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D74FF',
          light: '#AEC1F5',
        },
        // 전기적 코발트 포인트. primary(브랜드 남색 계열)는 유지하고,
        // 다크 무대의 조명·강조 한 곳에만 쓰는 고전압 포인트로 분리한다.
        // bright는 다크 배경 위 대형 텍스트용(대비 3:1 이상 확보).
        electric: {
          DEFAULT: '#2945FF',
          bright: '#5B78FF',
        },
        dark: {
          DEFAULT: '#191919',
          section: '#141C30',
          // 히어로 무대 전용 — section보다 한 단계 깊어 조명이 살 공간을 만든다
          stage: '#0B1322',
        },
        // 중성색은 순수 회색 대신 브랜드 네이비(#141C30) 쪽으로 미세하게 치우쳐 있다.
        // 순수 회색은 네이비·블루와 나란히 놓이면 탁하게 겉돌고, 고른 색조는 화면 전체를
        // 한 벌처럼 묶어준다. muted는 접근성(AA 4.5:1)도 함께 맞춘 값.
        text: {
          primary: '#151A23',
          secondary: '#49536A',
          muted: '#6E7688',
        },
        surface: {
          light: '#F5F7FA',
        },
        line: '#E3E7EF',
      },
      boxShadow: {
        // 그림자도 순수 검정 대신 네이비를 깔아 색이 튀지 않게 한다.
        card: '0 1px 2px rgba(20,28,48,0.04), 0 10px 28px -14px rgba(20,28,48,0.16)',
        lift: '0 2px 6px rgba(20,28,48,0.06), 0 24px 48px -20px rgba(20,28,48,0.22)',
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      transitionTimingFunction: {
        // 모든 authored 모션의 공용 곡선 — 빠르게 나와서 길게 감속(expo-out)
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        container: '1280px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        marquee: 'marquee 60s linear infinite',
      },
    },
  },
  plugins: [typography],
};

export default config;
