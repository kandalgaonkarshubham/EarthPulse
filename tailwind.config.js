/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',
        secondary: '#d8d8d8'
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
    }
  },
  plugins: [require("tailwindcss-animate")],
};
