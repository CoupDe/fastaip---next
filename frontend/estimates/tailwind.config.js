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
        sans: ["var(--font-dmMono)", ...fontFamily.sans],
        sspro: ["var(--font-sspro)"],
      },
      fontSize: {
        xs: ["0.6rem", "20px"],
      },
      // that is actual animation
      keyframes: (theme) => ({
        fadeOut: {
          "0%": { color: theme("colors.transparent") },
          "100%": { color: theme("colors.red.300") },
        },
      }),
      keyframes: {
        openmenu: {
          // initial position
          "0%": { opacity: 0 },
          // final position
          "100%": { opacity: 1 },
        },
        closemenu: {
          // initial position
          "0%": { left: "0px" },
          // final position
          "100%": { left: "-224px" },
        },
      },
      keyframes: {
        showArrow: {
          "0%": { translateX: "30px" },
          "100%": { translateX: "20px 4rem 150px" },
        },
      },
    },
  },
  plugins: [],
};
