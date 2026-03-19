/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Futuristic dark palette
        'dark-bg': '#0a0e27',
        'dark-card': '#1a1f3a',
        'dark-border': '#2d3561',
        'neon-cyan': '#00d4ff',
        'neon-purple': '#8b5cf6',
        'neon-pink': '#ff006e',
        'neon-green': '#00ff88',
        'neon-blue': '#0099ff',
        'accent-orange': '#ff6b35',
        'accent-yellow': '#ffd60a',
        primary: '#000000',
        secondary: '#2a2929'
      },
      backgroundImage: {
        'gradient-futuristic': 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        'gradient-neon': 'linear-gradient(45deg, #00d4ff, #8b5cf6, #ff006e)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 0, 110, 0.5)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        Quicksand: ["Quicksand"],
        Syne: ["Syne"],
        Jetbrains: ["Jetbrains Mono"],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};
