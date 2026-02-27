/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ze: {
          body: '#09090f',
          surface: '#111118',
          elevated: '#1a1a24',
          hover: '#22222e',
          violet: '#7c3aed',
          indigo: '#4f46e5',
          blue: '#3b82f6',
          emerald: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.06)',
        default: 'rgba(255,255,255,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '60%, 100%': { left: '100%' },
        },
      },
    },
  },
  plugins: [],
};
