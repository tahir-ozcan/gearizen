import defaultTheme from "tailwindcss/defaultTheme.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        md: "2.5rem",
        lg: "4rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        indigo: {
          50: "#f0f4ff",
          100: "#e0e7ff",
          200: "#c7d1ff",
          300: "#a3b0ff",
          400: "#8a97ff",
          500: "#6b7cff",
          600: "#4f5fd4",
          700: "#3947a5",
          800: "#2d3778",
          900: "#1e244d",
        },
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};
