import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
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
      boxShadow: {
        "elevation-sm": "0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.06)",
        elevation: "0 1px 3px 0 rgba(0,0,0,0.07), 0 4px 6px -1px rgba(0,0,0,0.06)",
        "elevation-lg": "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.05)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "Consolas", "monospace"],
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
        khmer: ["var(--font-khmer)", "Kantumruy Pro", "sans-serif"],
        battambang: ["var(--font-battambang)", "Battambang", "serif"],
        moul: ["var(--font-moul)", "Moul", "serif"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        brand: {
          "50": "#eef2ff",
          "100": "#e0e7ff",
          "200": "#c7d2fe",
          "300": "#a5b4fc",
          "400": "#818cf8",
          "500": "#6366f1",
          "600": "#4f46e5",
          "700": "#4338ca",
          "800": "#3730a3",
          "900": "#312e81",
          "950": "#1e1b4b",
        },
        "royal-blue": {
          DEFAULT: "#2D71F8",
          50: "#E6EFFE",
          100: "#C3DCFD",
          200: "#8BB8FB",
          300: "#5495F9",
          400: "#2D71F8",
          500: "#0B57E6",
          600: "#0945B8",
          700: "#07338A",
          800: "#05215C",
          900: "#020F2E",
        },
        "elf-green": {
          DEFAULT: "#1C8370",
          50: "#E6F5F3",
          100: "#C2E7E0",
          200: "#8BCCBF",
          300: "#54B09E",
          400: "#1C8370",
          500: "#16685A",
          600: "#104D44",
          700: "#0B332E",
          800: "#061918",
          900: "#020604",
        },
        navy: {
          DEFAULT: "#1B2A4A",
          light: "#2A3F6B",
          dark: "#111D33",
        },
        cream: "#F8F8F6",
        "coral-red": {
          DEFAULT: "#FC4A4A",
          50: "#FFF0F0",
          100: "#FFDCDC",
          200: "#FFB9B9",
          300: "#FF9696",
          400: "#FC4A4A",
          500: "#FB1414",
          600: "#D00A0A",
          700: "#9B0808",
          800: "#660505",
          900: "#310303",
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        safe: "env(safe-area-inset-bottom)",
      },
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-right": "env(safe-area-inset-right)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindcssTypography,
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        ".touch-pan-y": { "touch-action": "pan-y" },
        ".touch-pan-x": { "touch-action": "pan-x" },
        ".touch-manipulation": { "touch-action": "manipulation" },
        ".touch-none": { "touch-action": "none" },
      });
    },
  ],
};

export default config;
