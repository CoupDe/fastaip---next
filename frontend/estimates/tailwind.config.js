/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        fade: "fadeOut 0.2s ease-in 3",
      },

      // that is actual animation
      keyframes: (theme) => ({
        fadeOut: {
          "0%": { color: theme("colors.transparent") },
          "100%": { color: theme("colors.red.300") },
        },
      }),
    },
  },
  plugins: [],
};
