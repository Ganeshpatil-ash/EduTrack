/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        canvas: { DEFAULT: '#FAFAFA', dark: '#0A0C10' },
        surface: { DEFAULT: '#FFFFFF', dark: '#12151B' },
        'surface-alt': { DEFAULT: '#F5F6F8', dark: '#181C24' },
        border: { DEFAULT: '#E6E8EC', dark: '#232732' },
        'border-strong': { DEFAULT: '#D7DAE0', dark: '#2E3340' },
        brand: {
          50: '#EEF1FF',
          100: '#DCE3FF',
          200: '#B9C7FF',
          300: '#97A8FF',
          400: '#7690FF',
          500: '#5B74FF',
          600: '#3D5AFE',
          700: '#2C42E0',
          800: '#2434B0',
          900: '#202E87',
        },
        accent: {
          50: '#FEF7E8',
          100: '#FCEBC2',
          300: '#FCD34D',
          500: '#F5A623',
          600: '#DB8A0A',
          700: '#B26E08',
        },
        success: { DEFAULT: '#16A34A', dark: '#22C55E', bg: '#ECFDF3', 'bg-dark': '#0F2A1C' },
        danger: { DEFAULT: '#E11D48', dark: '#FB7185', bg: '#FEF1F4', 'bg-dark': '#2C141C' },
        warning: { DEFAULT: '#F59E0B', dark: '#FBBF24', bg: '#FFFAEB', 'bg-dark': '#2A2310' },
        info: { DEFAULT: '#0EA5E9', dark: '#38BDF8', bg: '#EFF8FF', 'bg-dark': '#0F2230' },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(15 17 26 / 0.04), 0 1px 1px 0 rgb(15 17 26 / 0.03)',
        elevated: '0 4px 16px -4px rgb(15 17 26 / 0.10), 0 2px 6px -2px rgb(15 17 26 / 0.06)',
        'elevated-dark': '0 4px 20px -4px rgb(0 0 0 / 0.45), 0 2px 8px -2px rgb(0 0 0 / 0.35)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'slide-up': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
