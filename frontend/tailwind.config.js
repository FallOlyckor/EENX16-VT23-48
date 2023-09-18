/** @type {import('tailwindcss').Config} */
/// <reference types="nativewind/types" />

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  variants: {
    extend: {
      backgroundOpacity: ["active"],
    },
  },
  theme: {
    extend: {
      colors: {
        primary: "#6CB6D6",
        primaryBg: "rgba(108, 182, 214, 0.2)",
        overlay: "rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
