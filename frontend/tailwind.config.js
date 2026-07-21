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
          dark: "#0D0E15",
          card: "#161824",
          surface: "#1F2336",
          cyan: "#00F2FE",
          green: "#00FF87",
          purple: "#9D00FF",
          red: "#FF2A6D",
          yellow: "#FFD000",
          text: "#E0E6ED",
          muted: "#6C7A89",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cyber: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 242, 254, 0.4)',
        'glow-green': '0 0 15px rgba(0, 255, 135, 0.4)',
        'glow-red': '0 0 15px rgba(255, 42, 109, 0.4)',
        'glow-purple': '0 0 15px rgba(157, 0, 255, 0.4)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        }
      }
    },
  },
  plugins: [],
}
