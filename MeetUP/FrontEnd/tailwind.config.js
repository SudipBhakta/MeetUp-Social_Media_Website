/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    // Custom plugin to hide scrollbar
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          'scrollbar-width': 'none', /* Firefox */
          '-ms-overflow-style': 'none', /* IE and Edge */
        },
        '.scrollbar-none::-webkit-scrollbar': {
          display: 'none', /* Chrome, Safari, Opera */
        },
      }, ['responsive', 'hover']);
    }
  ],
};
