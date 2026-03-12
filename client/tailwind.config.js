/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Light Theme Color Palette
        primary: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        accent: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        // Clean Light palette
        background: {
          DEFAULT: '#F8FAFC',
          light: '#F1F5F9',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
          lighter: '#F1F5F9',
        },
        card: {
          DEFAULT: '#FFFFFF',
          hover: '#F8FAFC',
        },
        border: {
          DEFAULT: '#E2E8F0',
          light: '#CBD5E1',
          subtle: '#F1F5F9',
        },
        // Text colors
        foreground: '#0F172A',
        'text': {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#64748B',
          muted: '#94A3B8',
        },
        'text-muted': '#94A3B8',
        'text-secondary': '#475569',
        'text-tertiary': '#64748B',
        // Status colors
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
          bg: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
          bg: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
          bg: '#FEF2F2',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
          bg: '#EFF6FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      // Modern shadows - soft and subtle for light theme
      boxShadow: {
        // Glow effects
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.1)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.2)',
        'glow-accent': '0 0 20px rgba(16, 185, 129, 0.15)',
        // Card shadows - layered soft shadows
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        'card-subtle': '0 1px 2px rgba(0, 0, 0, 0.02)',
        // Inner shadows
        'inner-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.02)',
        'inner-glow': 'inset 0 0 20px rgba(59, 130, 246, 0.02)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Animation utilities
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-sm': 'bounce 1s infinite',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Backdrop blur
      backdropBlur: {
        'xs': '2px',
      },
      // Transition timing
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Z-index scale
      zIndex: {
        '50': '50',
        '60': '60',
        '70': '70',
      },
    },
  },
  plugins: [],
}

