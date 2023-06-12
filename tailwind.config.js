/** @type {import('tailwindcss').Config} */
module.exports = {
  //important: true,
  content: ["./public/**/*.{ejs}", "./views/**/*.{ejs,js}"],
  theme: {
    colors: {
      header: "#1A0F14",
      headerTitle: "#E2E8F0",
      white: "#FFFFFF",
      black: "#000000",
      background1: "#8C8C8C",
      test: "#A29984",
      button1: "#003D32",
      button2: "#BDBBB7",
      button1Hover: "#002921",
    },
    extend: {
      fontFamily: {
        robo: ["Roboto Mono", "sans-serif"],
        palanquin: ["Palanquin"],
        palanquinHeavy: ["PalanquinHeavy"],
      },
    },
  },
  plugins: [],
};
