import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D74FF',
          light: '#AEC1F5',
        },
        dark: {
          DEFAULT: '#191919',
          section: '#141C30',
        },
        text: {
          primary: '#191919',
          secondary: '#5A5757',
          muted: '#939393',
        },
        surface: {
          light: '#F6F6F6',
        },
        line: '#D9D9D9',
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        container: '1280px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
