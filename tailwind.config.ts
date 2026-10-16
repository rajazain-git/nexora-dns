import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#080D1A", // Midnight Navy
        "background-secondary": "#0B1224", // Deep Secondary
        surface: {
          DEFAULT: "#0B1224", // Deep Slate Blue
          elevated: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.12)",
          card: "rgba(255, 255, 255, 0.06)",
        },
        glass: {
          subtle: "rgba(255, 255, 255, 0.03)",
          surface: "rgba(255, 255, 255, 0.06)",
          strong: "rgba(255, 255, 255, 0.10)",
          elevated: "rgba(255, 255, 255, 0.14)",
          border: "rgba(255, 255, 255, 0.12)",
          "border-strong": "rgba(255, 255, 255, 0.20)",
          "border-cyan": "rgba(0, 229, 255, 0.35)",
          "border-violet": "rgba(139, 92, 246, 0.35)",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.12)",
          subtle: "rgba(255, 255, 255, 0.07)",
          glow: "rgba(0, 229, 255, 0.35)",
        },
        accent: {
          cyan: "#00E5FF", // Electric Cyan (Primary)
          "cyan-hover": "#38EFFF",
          "cyan-glow": "rgba(0, 229, 255, 0.4)",
          "cyan-dark": "#00A8BD",
          violet: "#8B5CF6", // Neon Violet (Secondary)
          "violet-hover": "#A78BFA",
          "violet-glow": "rgba(139, 92, 246, 0.35)",
          "violet-dark": "#6D28D9",
        },
        text: {
          main: "#F1F5F9", // Ice White
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -3px rgba(0, 229, 255, 0.45)",
        "glow-cyan-lg": "0 0 45px -5px rgba(0, 229, 255, 0.6)",
        "glow-violet": "0 0 25px -3px rgba(139, 92, 246, 0.4)",
        "glow-violet-lg": "0 0 45px -5px rgba(139, 92, 246, 0.55)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-inset": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
        "glass-strong": "0 12px 40px 0 rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)",
        "glass-cyan": "0 8px 32px 0 rgba(0, 229, 255, 0.16), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)",
        "glass-violet": "0 8px 32px 0 rgba(139, 92, 246, 0.16), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
        "glass-lg": "24px",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern": "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
        "grid-cyan": "linear-gradient(to right, rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 255, 0.05) 1px, transparent 1px)",
        "grid-violet": "linear-gradient(to right, rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 1px, transparent 1px)",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "scanner": {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "scanner": "scanner 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
