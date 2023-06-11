/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: true,
  theme: {
    extend: {
      colors: {
        primary: "#F5385D",
      },
      backgroundColor: {
        middleGreen: '#00cc00',
      },
    },
  },
  plugins: [],
};
