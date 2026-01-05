/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#020617', // Slate 950 - classic terminal dark
          dark: '#0f172a',  // Slate 900
          green: '#22c55e', // Standard Tailwind Green (Neon-ish)
          neon: '#00ff41',  // Hacker Green
          dim: '#14532d',   // Green 900
          alert: '#ef4444', // Red 500
          warning: '#eab308' // Yellow 500
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Exo 2"', 'sans-serif'], // Futuristic header font if avail
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'terminal-blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
