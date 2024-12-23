/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#2a2929'
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
