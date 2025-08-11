import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 专业配色方案：黑、白、浅蓝、黄、绿
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(220, 100%, 50%)", // 专业蓝色
          foreground: "hsl(0, 0%, 100%)",
          50: "hsl(220, 100%, 97%)",
          100: "hsl(220, 100%, 95%)",
          200: "hsl(220, 100%, 90%)",
          300: "hsl(220, 100%, 80%)",
          400: "hsl(220, 100%, 65%)",
          500: "hsl(220, 100%, 50%)",
          600: "hsl(220, 100%, 45%)",
          700: "hsl(220, 100%, 40%)",
          800: "hsl(220, 100%, 35%)",
          900: "hsl(220, 100%, 25%)",
        },
        secondary: {
          DEFAULT: "hsl(210, 20%, 96%)", // 浅灰色
          foreground: "hsl(210, 20%, 20%)",
        },
        accent: {
          DEFAULT: "hsl(45, 100%, 60%)", // 专业黄色
          foreground: "hsl(45, 100%, 10%)",
        },
        success: {
          DEFAULT: "hsl(142, 76%, 36%)", // 专业绿色
          foreground: "hsl(0, 0%, 100%)",
        },
        warning: {
          DEFAULT: "hsl(38, 92%, 50%)", // 警告橙色
          foreground: "hsl(0, 0%, 100%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(210, 20%, 96%)",
          foreground: "hsl(210, 20%, 45%)",
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(210, 20%, 20%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(210, 20%, 20%)",
        },
        // 专业灰度系统
        gray: {
          50: "hsl(210, 20%, 98%)",
          100: "hsl(210, 20%, 96%)",
          200: "hsl(210, 16%, 93%)",
          300: "hsl(210, 14%, 89%)",
          400: "hsl(210, 14%, 83%)",
          500: "hsl(210, 11%, 71%)",
          600: "hsl(210, 7%, 56%)",
          700: "hsl(210, 9%, 31%)",
          800: "hsl(210, 10%, 23%)",
          900: "hsl(210, 11%, 15%)",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
