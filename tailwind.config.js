/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "surface-bright": "#1a1f1a",
        "primary": "#10b981", // Emerald 500
        "primary-container": "#064e3b", // Emerald 900
        "secondary": "#f59e0b", // Amber 500
        "secondary-container": "#78350f", // Amber 900
        "tertiary": "#ea580c", // Orange 600 (Copper feel)
        "tertiary-container": "#7c2d12", // Orange 900
        "background": "#050705",
        "surface": "#0d110d",
        "surface-variant": "#1a1f1a",
        "on-background": "#e2e8f0",
        "on-surface": "#f1f5f9",
        "outline": "#3d4a3d",
        "accent-gold": "#d97706",
        "emerald-deep": "#064e3b",
        "copper-rich": "#b45309"
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Plus Jakarta Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "var(--radius)",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};
