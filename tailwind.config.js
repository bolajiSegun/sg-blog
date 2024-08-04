/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pri: "#8f04fc",
        "pri-hover": "#9104fcc5",
        "text-dark": "#242424",
        "text-light": "#6B6B6B",
        skeleton: "#ebe4e0",
      },
    },
  },
  plugins: [],
};
