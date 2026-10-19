import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#070D19',
          900: '#070D19',
          800: '#0A1D38',
          700: '#0D2547',
          600: '#112d56',
          500: '#163666',
        },
        brand: {
          DEFAULT: '#FF6B00',
          light: '#FF8A33',
          dark: '#E55F00',
          50: 'rgba(255,107,0,0.08)',
          100: 'rgba(255,107,0,0.15)',
          200: 'rgba(255,107,0,0.25)',
        },
        electric: {
          DEFAULT: '#398BFF',
          dark: '#1a6ee8',
          light: '#62a5ff',
        },
        surface: {
          light: '#F5F7FB',
          card: '#FFFFFF',
        },
        muted: '#66758B',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-brand': '0 0 40px rgba(255,107,0,0.2)',
        'glow-blue': '0 0 60px rgba(57,139,255,0.25)',
        'card': '0 4px 20px rgba(6,19,38,0.08)',
        'card-hover': '0 12px 40px rgba(6,19,38,0.15)',
        'premium': '0 20px 60px rgba(6,19,38,0.12)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 75% 0%, rgba(57,139,255,0.35) 0%, transparent 60%), radial-gradient(ellipse at 15% 100%, rgba(255,107,0,0.1) 0%, transparent 50%), linear-gradient(165deg, #061326 0%, #0A1D38 55%, #0D2547 100%)',
        'section-dark': 'radial-gradient(ellipse at 90% 0%, rgba(57,139,255,0.25) 0%, transparent 60%), linear-gradient(180deg, #061326 0%, #0A1D38 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-right': 'slideRight 0.5s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
