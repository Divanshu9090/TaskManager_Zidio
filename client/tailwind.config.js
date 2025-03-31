/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#3e4096",
        custompurple: "rgba(165, 166, 227,0.5)",
      },borderRadius: {
        custom: '20px',
      },
    },
  },
  plugins: [],
};
