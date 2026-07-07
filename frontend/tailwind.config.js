/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        em: {
          void: '#070b09',
          coal: '#0b120e',
          panel: '#0e1712',
          mint: '#7ff2a8',
          lime: '#35e17f',
          deep: '#12b866',
          orange: '#ff7a1a',
          amber: '#ffb020',
          sky: '#86c8ff',
          violet: '#b9a3ff',
          ink: '#e8f0ea',
          muted: '#8ea69a',
        },
        // backward-compat aliases used by Diagnostics/History/Settings pages
        emma: { orange: '#ff7a1a', amber: '#ffb020' },
        steel: {
          950: '#070b09',
          900: '#0b120e',
          850: '#0e1712',
          800: '#14201a',
          700: 'rgba(127,242,168,0.08)',
          600: 'rgba(127,242,168,0.14)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glass: '0 12px 40px -8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        glow: '0 0 28px rgba(53,225,127,0.35)',
        glowOrange: '0 0 28px rgba(255,122,26,0.4)',
      },
      backdropBlur: { xs: '2px' },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sheen: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        riseIn: 'riseIn 0.5s cubic-bezier(0.2,0.7,0.2,1) both',
        scan: 'scan 4s linear infinite',
      },
    },
  },
  plugins: [],
};
