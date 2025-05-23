module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this according to your file types
  ],
  darkMode: "media", // eller 'media' eller 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Neue Haas Grotesk Display Pro", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
