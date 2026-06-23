/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0A7E8C",
          mid: "#0D9BAC",
          light: "#E6F4F6",
          dark: "#065f6b",
        },
        orange: {
          DEFAULT: "#F5820D",
          light: "#FEF0E3",
          dark: "#c46a0b",
        },
        navy: {
          DEFAULT: "#1A2B35",
          mid: "#2D4657",
        },
        purple: {
          logo: "#6B3FA0",
        },
        brand: {
          bg: "#F7FAFC",
          success: "#2E8B57",
          "success-light": "#EAF5EE",
          "gray-text": "#6B7C8A",
          "gray-border": "#E2EBF0",
        },
      },
      fontFamily: {
        heading: ["var(--font-nunito)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        btn: "12px",
        badge: "30px",
      },
      animation: {
        "float-1": "float 3s ease-in-out infinite",
        "float-2": "float 3.5s ease-in-out infinite 0.5s",
        "float-3": "float 4s ease-in-out infinite 1s",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blob": "blob 7s infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "count": "countUp 2s ease-out forwards",
        "slide-in": "slideIn 0.3s ease-out forwards",
        "glow": "glow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(5deg)" },
        },
        blob: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-50px) scale(1.1)" },
          "66%": { transform: "translate(-20px,20px) scale(0.9)" },
          "100%": { transform: "translate(0,0) scale(1)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.5)" },
          "50%": { boxShadow: "0 0 0 16px rgba(37,211,102,0)" },
        },
      },
    },
  },
  plugins: [],
};
module.exports = config;
