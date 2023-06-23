/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      animation: {
        fade: "fadeOut 0.2s ease-in 3",
        openmenu: "openmenu 0.2s ease-in",
        closemenu: "closemenu 0.2s ease-in",
        showArrow: "showArrow 0.2s ease-in 3",
      },
      fontFamily: {
        overpass: "var(--font-overpass)",
        sans: "var(--font-dmMono)",
        sspro: "var(--font-sspro)",
      },
      fontSize: {
        xs: ["0.6rem", "1.35rem"],
      },
      // that is actual animation
      keyframes: (theme) => ({
        fadeOut: {
          "0%": { color: theme("colors.transparent") },
          "100%": { color: theme("colors.red.300") },
        },
      }),

      openmenu: {
        // initial position
        "0%": { opacity: 0 },
        // final position
        "100%": { opacity: 1 },
      },
    },
  },
  plugins: [],
};
