import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "#03030D",
        "bg-deep": "#06061A",
        "bg-surface": "#0A0A24",
        "bg-overlay": "#10102E",
        "red-900": "#1A0206",
        "red-800": "#3D0512",
        "red-700": "#6B0A1F",
        "red-600": "#9B1239",
        "red-500": "#DC143C",
        "red-400": "#E84368",
        "red-300": "#F47A96",
        "red-200": "#F9B3C4",
        "red-100": "#FDEDF1",
        "navy-900": "#020418",
        "navy-800": "#060B2C",
        "navy-700": "#0D1547",
        "navy-600": "#1A2466",
        "navy-500": "#1E3A8A",
        "navy-400": "#2563EB",
        "navy-300": "#3B82F6",
        "navy-200": "#93C5FD",
        "navy-100": "#DBEAFE",
        "white-pure": "#FFFFFF",
        "white-100": "#F8F8FF",
      },
      boxShadow: {
        "shadow-card": "0 4px 24px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.06) inset",
        "shadow-button": "0 0 20px rgba(220,20,60,0.35), 0 4px 12px rgba(0,0,0,0.40)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
