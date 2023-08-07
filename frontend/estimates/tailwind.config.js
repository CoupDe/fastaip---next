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
        slideErrorPopupLeft:
          "slideErrorPopupLeft 0.2s , slideErrorPopupLeftPause 3s "
      },
      fontFamily: {
        overpass: "var(--font-overpass)",
        sans: "var(--font-dmMono)",
        sspro: "var(--font-sspro)",
      },
    
      // that is actual animation
      keyframes: (theme) => ({
        fadeOut: {
          "0%": { color: theme("colors.transparent") },
          "100%": { color: theme("colors.red.300") },
        },
        slideErrorPopupLeft: {
          "0%": {
            opacity: 0,
            "-webkit-transform": "translateX(100px)",
            transform: "translateX(100px)",
          },
          "100%": {
            opacity: 1,
            "-webkit-transform": "translateX(0)",
            transform: "translateX(0)",
          },
        },
        slideErrorPopupLeftPause: {
          "50%": {
            opacity: 1,
            "-webkit-transform": "translateX(0)",
            transform: "translateX(0)",
          },
          "100%": {
            opacity: 0,
            "-webkit-transform": "translateX(100px)",
            transform: "translateX(100px)",
          },
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
