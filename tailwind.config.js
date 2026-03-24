/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // App Core Colors
        "background": "#050705",
        "surface": "#0d110d",
        "surface-bright": "#1a1f1a",
        "surface-variant": "#1a1f1a",
        "outline": "#3d4a3d",
        "on-background": "#e2e8f0",
        "on-surface": "#f1f5f9",

        // Semantic Colors used in Popover/Modal
        "primary": "#10b981",    // Green (Emerald 500)
        "secondary": "#f59e0b",  // Yellow/Amber (Amber 500)
        "critical": "#ef4444",   // Red (Critical alerts)
        
        // Accents & Containers
        "primary-container": "#064e3b",
        "secondary-container": "#78350f",
        "tertiary": "#ea580c",   // Orange/Copper
        "tertiary-container": "#7c2d12",
        "accent-gold": "#d97706",
        "emerald-deep": "#064e3b",
        "copper-rich": "#b45309"
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Plus Jakarta Sans", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "v0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(16, 185, 129, 0.4)',
        'glow-secondary': '0 0 15px rgba(245, 158, 11, 0.4)',
        'glow-critical': '0 0 15px rgba(239, 68, 68, 0.4)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
