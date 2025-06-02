module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this according to your file types
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media", // eller 'media' eller 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Neue Haas Grotesk Display Pro", "sans-serif"],
      },
    },
    screens: {
      sm: "1100px",
      md: "1100px",
      lg: "1100px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
