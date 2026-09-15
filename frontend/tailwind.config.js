/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bcd3ff",
          300: "#8fb6ff",
          400: "#5d8fff",
          500: "#3866f5",
          600: "#2547e8",
          700: "#1f38c9",
          800: "#1c2f9e",
          900: "#101a4d",
          950: "#0a1130",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(16, 26, 77, 0.06)",
        soft: "0 10px 30px rgba(16, 26, 77, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
